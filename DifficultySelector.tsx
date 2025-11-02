
import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultyCard: React.FC<{
  level: Difficulty;
  title: string;
  description: string;
  icon: string;
  borderColor: string;
  onSelect: (difficulty: Difficulty) => void;
}> = ({ level, title, description, icon, borderColor, onSelect }) => (
  <button
    onClick={() => onSelect(level)}
    className={`bg-surface p-8 rounded-lg shadow-lg border border-surface-light hover:border-highlight transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-center group w-full`}
  >
    <i className={`fas ${icon} text-5xl text-highlight mb-4 group-hover:scale-110 transition-transform duration-300`}></i>
    <h3 className="text-2xl font-bold text-text-main mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </button>
);

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 w-full">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-highlight">
        Simulador de Vendas AI
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl">
        Escolha o nível de dificuldade para iniciar a sua chamada de qualificação. A IA irá gerar um novo cenário e personalidade.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <DifficultyCard
          level="easy"
          title="Fácil"
          description="O potencial cliente é mais recetivo e colaborativo."
          icon="fa-seedling"
          borderColor="border-green-500"
          onSelect={onSelect}
        />
        <DifficultyCard
          level="medium"
          title="Médio"
          description="O potencial cliente apresenta objeções e ceticismo moderado."
          icon="fa-fire"
          borderColor="border-yellow-500"
          onSelect={onSelect}
        />
        <DifficultyCard
          level="hard"
          title="Difícil"
          description="O potencial cliente é desafiador, desconfiado e testa os seus limites."
          icon="fa-skull-crossbones"
          borderColor="border-red-500"
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default DifficultySelector;