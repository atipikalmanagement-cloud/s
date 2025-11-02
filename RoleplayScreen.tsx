
import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: The 'LiveSession' type is not exported from '@google/genai'. It has been removed.
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Difficulty, Scenario, Evaluation, Recording } from '../types';
import { SALESPERSON_MISSION, SALES_SCRIPT_GUIDE, AI_GENERAL_CONTEXT } from '../constants';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { getEvaluation } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';

interface RoleplayScreenProps {
  difficulty: Difficulty;
  scenario: Scenario;
  onEnd: (transcript: string[], evaluation: Evaluation) => void;
}

type CallStatus = 'connecting' | 'live' | 'paused' | 'analyzing' | 'ended' | 'error';

const RoleplayScreen: React.FC<RoleplayScreenProps> = ({ difficulty, scenario, onEnd }) => {
  const [status, setStatus] = useState<CallStatus>('connecting');
  const [userTranscript, setUserTranscript] = useState('');
  const [agentTranscript, setAgentTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 30); // 9.5 minutes to prevent API timeout

  const { addRecording } = useAuth();

  // Refs for managing session and media
  // FIX: Replaced non-exported 'LiveSession' type with 'any' to allow the code to compile.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const callAudioUrlsRef = useRef<string[]>([]);
  
  // Refs for managing state within async callbacks
  const fullTranscriptRef = useRef<string[]>([]);
  const callEndedRef = useRef(false);
  const statusRef = useRef(status);
  statusRef.current = status;


  const stopAudioProcessing = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm;codecs=opus' });
          if(audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);
            callAudioUrlsRef.current.push(audioUrl);
          }
          recordedChunksRef.current = [];
          mediaRecorderRef.current = null;
          resolve();
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve();
      }
    });
  }, []);

  const handleEndCall = useCallback(async () => {
    if (callEndedRef.current) return;
    callEndedRef.current = true;
    setStatus('analyzing');
    
    await stopRecording();
    stopAudioProcessing();

    if (sessionPromiseRef.current) {
      try {
        const session = await sessionPromiseRef.current;
        session.close();
        sessionPromiseRef.current = null;
      } catch (e) {
        console.warn("Session already closed or could not be closed:", e);
      }
    }
    
    try {
      const evaluationResult = await getEvaluation(fullTranscriptRef.current, scenario, SALESPERSON_MISSION);
      const newRecording: Omit<Recording, 'id'> = {
        date: new Date().toISOString(),
        difficulty,
        scenario,
        evaluation: evaluationResult,
        transcript: fullTranscriptRef.current,
        callAudioUrls: callAudioUrlsRef.current,
      };
      addRecording(newRecording);
      onEnd(fullTranscriptRef.current, evaluationResult);
    } catch(e) {
      console.error("Error getting evaluation:", e);
      const errorEvaluation: Evaluation = {
        eficacia: 0,
        leadQualificado: false,
        pontosDeMelhoria: ["Ocorreu um erro ao analisar a chamada. Por favor, tente novamente."]
      };
      onEnd(fullTranscriptRef.current, errorEvaluation);
    }
  }, [onEnd, scenario, stopAudioProcessing, stopRecording, addRecording, difficulty]);


  const startCall = useCallback(async (history: string[] = []) => {
    setStatus('connecting');
    callEndedRef.current = false;
    let outputAudioContext: AudioContext;
    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();
    
    try {
      if (!process.env.API_KEY) throw new Error("A chave de API do Gemini não foi configurada. Adicione a variável de ambiente API_KEY nas configurações do seu projeto Vercel.");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = outputAudioContext.createGain();
      
      const streamDestination = outputAudioContext.createMediaStreamDestination();
      outputNode.connect(streamDestination); // For recording
      outputNode.connect(outputAudioContext.destination); // For playback
      
      const aiAudioStream = streamDestination.stream;
      
      const historySummary = history.length > 0 ? `A chamada anterior terminou aqui. Continue a conversa a partir deste ponto:\n${history.slice(-6).join('\n')}` : `Comece a chamada dizendo apenas "Alô?" e depois espere pela resposta do vendedor.`;
      
      const systemInstruction = `
      Você é um agente de IA a participar num roleplay de vendas.
      FALE E RESPONDA SEMPRE EM PORTUGUÊS DE PORTUGAL.
      ${historySummary}
      
      **A SUA PERSONA:** ${scenario.persona}.
      **CONTEXTO GERAL:** ${AI_GENERAL_CONTEXT}
      
      O seu nível de ceticismo e desconfiança deve ser consistente com o nível de dificuldade: ${difficulty}.
      O vendedor não sabe os detalhes da sua persona, você deve revelá-los naturalmente durante a conversa.
      O seu objetivo é agir realisticamente. Seja mais passivo do que ativo, deixe o vendedor liderar. Muitos consultores como você não se lembram de preencher o formulário, aja em conformidade se for o caso.
      O vendedor tentará seguir um guião. Responda às perguntas dele de forma natural com base na sua persona.
      O guião que o vendedor provavelmente seguirá é este (NÃO o mencione, apenas use-o como contexto para as perguntas que ele fará): ${SALES_SCRIPT_GUIDE}
      `;
      
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: async () => {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Setup combined stream for recording
            const micTrack = mediaStreamRef.current.getAudioTracks()[0];
            const aiTrack = aiAudioStream.getAudioTracks()[0];
            const combinedStream = new MediaStream([micTrack, aiTrack]);
            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current.ondataavailable = (event) => {
              if (event.data.size > 0) recordedChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.start();
            
            // Setup audio processing for sending to Gemini
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);
            setStatus('live');
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) setUserTranscript(p => p + message.serverContent.inputTranscription.text);
            if (message.serverContent?.outputTranscription) setAgentTranscript(p => p + message.serverContent.outputTranscription.text);
            
            if (message.serverContent?.turnComplete) {
              const userInput = userTranscript.trim();
              const agentOutput = agentTranscript.trim();
              if(userInput) fullTranscriptRef.current.push(`Vendedor: ${userInput}`);
              if(agentOutput) fullTranscriptRef.current.push(`Cliente: ${agentOutput}`);
              setUserTranscript('');
              setAgentTranscript('');
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
            if (base64Audio) {
              setIsSpeaking(true);
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.onended = () => { sources.delete(source); if (sources.size === 0) setIsSpeaking(false); };
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sources.add(source);
            }
          },
          onerror: (e) => { console.error('Session error:', e); setStatus('error'); },
          onclose: () => {},
        },
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('error');
    }
  }, [difficulty, scenario]);

  const handleContinueCall = useCallback(async () => {
    await stopRecording();
    stopAudioProcessing();
    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.close();
    }
    setTimeLeft(9 * 60 + 30);
    startCall(fullTranscriptRef.current);
  }, [stopRecording, stopAudioProcessing, startCall]);

  useEffect(() => {
    startCall();
    return () => {
      callEndedRef.current = true; // Ensure end call logic doesn't run on unmount
      stopRecording();
      stopAudioProcessing();
      if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close()).catch(e => console.warn("Error closing session on cleanup:", e));
      }
    };
  }, [startCall, stopAudioProcessing, stopRecording]);
  
  useEffect(() => {
    if (status !== 'live') return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setStatus('paused');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);


  if (status === 'paused') {
    return (
        <div className="flex flex-col items-center justify-center bg-surface rounded-lg p-8 shadow-2xl border border-surface-light w-full max-w-lg mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-highlight mb-4">Sessão Pausada</h2>
            <p className="text-center text-gray-300 mb-8">O tempo da sessão terminou. Deseja continuar a chamada ou terminar e ver a sua avaliação?</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                    onClick={handleEndCall}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Terminar e Avaliar
                </button>
                <button
                    onClick={handleContinueCall}
                    className="w-full bg-highlight hover:bg-highlight-dark text-background font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Continuar Chamada (+9.5 min)
                </button>
            </div>
        </div>
    )
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'connecting': return { text: 'A Ligar...', color: 'text-highlight', icon: 'fa-spinner fa-spin' };
      case 'live': return { text: 'Em Chamada', color: 'text-green-400', icon: 'fa-phone-volume' };
      case 'analyzing': return { text: 'A Analisar...', color: 'text-highlight', icon: 'fa-spinner fa-spin' };
      case 'error': return { text: 'Erro na Chamada', color: 'text-red-500', icon: 'fa-exclamation-triangle' };
      default: return { text: 'Chamada Terminada', color: 'text-gray-400', icon: 'fa-phone-slash' };
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const { text, color, icon } = getStatusIndicator();

  return (
    <div className="flex flex-col items-center justify-center bg-surface rounded-lg p-8 shadow-2xl border border-surface-light w-full max-w-2xl mx-auto min-h-[500px]">
      <div className="text-center w-full">
        <div className={`flex items-center justify-center text-2xl font-bold mb-2 ${color}`}>
          <i className={`fas ${icon} mr-3`}></i>
          <span>{text}</span>
        </div>
        <div className="text-lg text-gray-400 mb-2">
            <i className="far fa-clock mr-2"></i>
            Tempo Restante: {formatTime(timeLeft)}
        </div>
        <p className="text-xs text-gray-500 mb-6">(Nota: A duração da chamada é limitada para garantir a estabilidade da sessão.)</p>
        <div className="relative w-48 h-48 mx-auto mb-8">
            <div className={`absolute inset-0 rounded-full border-4 ${isSpeaking ? 'border-highlight animate-pulse' : 'border-gray-600'} flex items-center justify-center transition-colors duration-300`}>
                 <i className="fas fa-robot text-6xl text-gray-400"></i>
            </div>
             <div className="absolute inset-0 rounded-full border-4 border-transparent border-highlight/50 animate-ping" style={{ animationPlayState: isSpeaking ? 'running' : 'paused' }}></div>
        </div>
        <div className="bg-background p-4 rounded-lg min-h-[120px] text-left mb-8">
            <p className="text-gray-400 text-sm">Vendedor:</p>
            <p className="text-text-main">{userTranscript || '...'}</p>
             <p className="text-gray-400 text-sm mt-2">Cliente:</p>
            <p className="text-highlight">{agentTranscript || '...'}</p>
        </div>
      </div>
      {status === 'live' && (
        <button
          onClick={() => setStatus('paused')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center"
        >
          <i className="fas fa-phone-slash mr-3"></i>
          Terminar Chamada
        </button>
      )}
      {status === 'error' && (
         <button
          onClick={() => window.location.reload()}
          className="bg-highlight hover:bg-highlight-dark text-background font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default RoleplayScreen;