
import React, { useState, useCallback } from 'react';
import { Difficulty, Scenario, Evaluation } from '../types';
import { generateDynamicScenario } from '../services/geminiService';
import DifficultySelector from '../components/DifficultySelector';
import PreCallBriefing from '../components/PreCallBriefing';
import RoleplayScreen from '../components/RoleplayScreen';
import EvaluationScreen from '../components/EvaluationScreen';

type TrainerState = 'selecting_difficulty' | 'generating_scenario' | 'pre_call_briefing' | 'in_progress' | 'evaluation';

const TrainerPage: React.FC = () => {
  const [trainerState, setTrainerState] = useState<TrainerState>('selecting_difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);

  const handleDifficultySelect = useCallback(async (selectedDifficulty: Difficulty) => {
    setTrainerState('generating_scenario');
    setDifficulty(selectedDifficulty);
    try {
        const newScenario = await generateDynamicScenario(selectedDifficulty);
        setScenario(newScenario);
        setTranscript([]);
        setEvaluation(null);
        setTrainerState('pre_call_briefing');
    } catch (error) {
        console.error("Failed to generate scenario:", error);
        // Optionally, handle the error, e.g., show an error message and return to selection
        setTrainerState('selecting_difficulty');
    }
  }, []);

  const handleStartCall = useCallback(() => {
    setTrainerState('in_progress');
  }, []);

  const handleRoleplayEnd = useCallback((finalTranscript: string[], finalEvaluation: Evaluation) => {
    setTranscript(finalTranscript);
    setEvaluation(finalEvaluation);
    setTrainerState('evaluation');
  }, []);

  const resetState = useCallback(() => {
    setTrainerState('selecting_difficulty');
    setDifficulty(null);
    setScenario(null);
    setEvaluation(null);
    setTranscript([]);
  }, []);

  const renderContent = () => {
    switch (trainerState) {
      case 'generating_scenario':
        return (
            <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-highlight"></i>
                <p className="mt-4 text-lg text-gray-300">A gerar um novo cenário...</p>
            </div>
        );
      case 'pre_call_briefing':
        return scenario && <PreCallBriefing scenario={scenario} onStart={handleStartCall} onBack={resetState} />;
      case 'in_progress':
        if (!difficulty || !scenario) {
            resetState();
            return null;
        }
        return (
          <RoleplayScreen
            difficulty={difficulty}
            scenario={scenario}
            onEnd={handleRoleplayEnd}
          />
        );
      case 'evaluation':
        if (!evaluation || !scenario || !difficulty) {
            resetState();
            return null;
        }
        return (
          <EvaluationScreen
            evaluation={evaluation}
            scenario={scenario}
            difficulty={difficulty}
            onRetry={resetState}
            transcript={transcript}
          />
        );
      case 'selecting_difficulty':
      default:
        return <DifficultySelector onSelect={handleDifficultySelect} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
        {renderContent()}
    </div>
  );
};

export default TrainerPage;