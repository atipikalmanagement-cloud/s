
import React from 'react';
import { Evaluation, Scenario, Difficulty } from '../types';

interface EvaluationScreenProps {
  evaluation: Evaluation;
  scenario: Scenario;
  difficulty: Difficulty;
  onRetry: () => void;
  transcript: string[];
}

const EvaluationScreen: React.FC<EvaluationScreenProps> = ({ evaluation, scenario, difficulty, onRetry, transcript }) => {
  const scoreColor = evaluation.eficacia >= 75 ? 'text-green-400' : evaluation.eficacia >= 40 ? 'text-highlight' : 'text-red-400';

  const handleDownload = () => {
    let reportContent = `Relatório de Avaliação - ${new Date().toLocaleString('pt-PT')}\n`;
    reportContent += `======================================================\n\n`;
    reportContent += `Cenário: ${scenario.briefing.name}\n`;
    reportContent += `Dificuldade: ${difficulty}\n`;
    reportContent += `\n--- AVALIAÇÃO ---\n`;
    reportContent += `Eficácia: ${evaluation.eficacia}%\n`;
    reportContent += `Avaliação da Qualificação: ${evaluation.leadQualificado === scenario.isQualified ? 'Correta' : 'Incorreta'}\n`;
    reportContent += `(O vendedor concluiu que o lead era qualificado: ${evaluation.leadQualificado ? 'Sim' : 'Não'})\n`;
    reportContent += `(Na verdade, o lead era qualificado: ${scenario.isQualified ? 'Sim' : 'Não'})\n`;
    reportContent += `\nPontos de Melhoria:\n`;
    evaluation.pontosDeMelhoria.forEach(p => {
        reportContent += `- ${p}\n`;
    });
    reportContent += `\n--- TRANSCRIÇÃO COMPLETA ---\n`;
    transcript.forEach(line => {
        reportContent += `${line}\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-roleplay-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface rounded-lg p-6 md:p-8 shadow-2xl border border-surface-light w-full animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-highlight">
        Avaliação da Chamada
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-background p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Eficácia</h3>
          <p className={`text-5xl font-bold ${scoreColor}`}>{evaluation.eficacia}%</p>
        </div>
        <div className="bg-background p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Lead Era Qualificado?</h3>
          <p className={`text-4xl font-bold ${scenario.isQualified ? 'text-green-400' : 'text-red-400'}`}>
            {scenario.isQualified ? 'Sim' : 'Não'}
          </p>
        </div>
        <div className="bg-background p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Sua Avaliação</h3>
           <p className={`text-4xl font-bold ${evaluation.leadQualificado === scenario.isQualified ? 'text-green-400' : 'text-red-400'}`}>
            {evaluation.leadQualificado === scenario.isQualified ? 'Correta' : 'Incorreta'}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-background p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-text-main flex items-center">
                <i className="fas fa-lightbulb mr-3 text-highlight"></i>
                Pontos de Melhoria
            </h3>
            <ul className="space-y-3 text-gray-300 list-disc list-inside">
                {evaluation.pontosDeMelhoria.map((point, index) => (
                <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
        <div className="bg-background p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-text-main flex items-center">
                <i className="fas fa-file-alt mr-3 text-highlight"></i>
                Transcrição
            </h3>
            <div className="h-48 overflow-y-auto bg-surface p-3 rounded-md text-sm space-y-2">
                {transcript.map((line, index) => (
                    <p key={index} className={line.startsWith('Vendedor:') ? 'text-gray-300' : 'text-highlight'}>{line}</p>
                ))}
            </div>
        </div>
      </div>
      
      <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto bg-highlight hover:bg-highlight-dark text-background font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Praticar Novamente
        </button>
         <button
          onClick={handleDownload}
          className="w-full sm:w-auto bg-surface-light hover:bg-gray-600 text-text-main font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
           <i className="fas fa-download mr-2"></i>
          Baixar Relatório
        </button>
      </div>
    </div>
  );
};

export default EvaluationScreen;