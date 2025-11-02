
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Recording } from '../types';

const RecordingItem: React.FC<{ recording: Recording }> = ({ recording }) => {
    const [isOpen, setIsOpen] = useState(false);
    const scoreColor = recording.evaluation.eficacia >= 75 ? 'text-green-400' : recording.evaluation.eficacia >= 40 ? 'text-highlight' : 'text-red-400';

    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden border border-surface-light">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-surface-light/50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex-1 mb-4 sm:mb-0">
                    <p className="text-lg font-bold text-text-main">vs. {recording.scenario.briefing.name}</p>
                    <p className="text-sm text-gray-400">{new Date(recording.date).toLocaleString('pt-PT')}</p>
                </div>
                <div className="flex items-center space-x-6 self-stretch sm:self-center">
                    <div className="text-center">
                        <span className="text-xs text-gray-400">Dificuldade</span>
                        <p className="font-semibold capitalize">{recording.difficulty}</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-400">Eficácia</span>
                        <p className={`font-bold text-lg ${scoreColor}`}>{recording.evaluation.eficacia}%</p>
                    </div>
                </div>
                <div className="hidden sm:block text-2xl text-gray-500 transition-transform duration-300 ml-6" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                    <i className="fas fa-chevron-down"></i>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-surface-light animate-fade-in bg-background/50">
                    {recording.callAudioUrls && recording.callAudioUrls.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-bold text-text-main mb-2">Gravação da Chamada</h4>
                            <div className="space-y-3">
                                {recording.callAudioUrls.map((url, index) => (
                                    <div key={index}>
                                        <p className="text-sm text-gray-400 mb-1">Parte {index + 1}</p>
                                        <audio controls src={url} className="w-full">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-text-main mb-2">Pontos de Melhoria</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                {recording.evaluation.pontosDeMelhoria.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main mb-2">Transcrição</h4>
                            <div className="h-40 overflow-y-auto bg-surface p-2 rounded text-xs space-y-1">
                                {recording.transcript.map((line, i) => (
                                    <p key={i} className={line.startsWith('Vendedor:') ? 'text-gray-300' : 'text-highlight'}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const RecordingsPage: React.FC = () => {
  const { recordings } = useAuth();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-8 text-highlight">
        Gravações de Treino
      </h1>
      
      {recordings.length > 0 ? (
        <div className="space-y-4">
            {recordings.map(rec => <RecordingItem key={rec.id} recording={rec} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-lg">
            <i className="fas fa-history text-5xl text-gray-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-text-main">Nenhuma Gravação Encontrada</h2>
            <p className="text-gray-400">Complete o seu primeiro roleplay para ver o relatório aqui.</p>
        </div>
      )}
    </div>
  );
};

export default RecordingsPage;