
import React from 'react';
import { Scenario } from '../types';

interface PreCallBriefingProps {
  scenario: Scenario;
  onStart: () => void;
  onBack: () => void;
}

const InfoCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-background p-4 rounded-lg text-center">
        <i className={`fas ${icon} text-2xl text-highlight mb-2`}></i>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-text-main">{value}</p>
    </div>
);

const PreCallBriefing: React.FC<PreCallBriefingProps> = ({ scenario, onStart, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-surface rounded-lg p-8 shadow-2xl border border-surface-light w-full max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-2 text-text-main">Informações do Lead</h2>
        <p className="text-gray-300 mb-8 text-center">Prepare-se para a chamada. Aqui estão os detalhes que você tem sobre o potencial cliente.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
            <InfoCard label="Nome" value={scenario.briefing.name} icon="fa-user" />
            <InfoCard label="Experiência" value={scenario.briefing.experience} icon="fa-briefcase" />
            <InfoCard label="Agência" value={scenario.briefing.agency} icon="fa-building" />
            <InfoCard label="Faturação (2024)" value={scenario.briefing.revenue} icon="fa-euro-sign" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
                onClick={onBack}
                className="bg-surface-light hover:bg-gray-600 text-text-main font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out w-full sm:w-auto"
            >
                Voltar
            </button>
            <button
                onClick={onStart}
                className="bg-highlight hover:bg-highlight-dark text-background font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-xl w-full sm:w-auto"
            >
                <i className="fas fa-phone mr-3"></i>
                Iniciar Chamada
            </button>
        </div>
    </div>
  );
};

export default PreCallBriefing;