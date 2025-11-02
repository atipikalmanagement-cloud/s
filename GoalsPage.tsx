
import React, { useState, useEffect } from 'react';
import { GOALS } from '../constants';
import { Goal } from '../types';
import { useAuth } from '../hooks/useAuth';

const GoalsPage: React.FC = () => {
    const { recordings } = useAuth();
    const [userGoals, setUserGoals] = useState<Goal[]>([]);

    useEffect(() => {
        const updatedGoals = GOALS.map(goal => {
            let achieved = false;
            switch(goal.id) {
                case 'g1': // 5 Roleplays
                    achieved = recordings.length >= 5;
                    break;
                case 'g2': // 80% efficacy on Medium/Hard
                    achieved = recordings.some(r => (r.difficulty === 'medium' || r.difficulty === 'hard') && r.evaluation.eficacia >= 80);
                    break;
                case 'g3': // Schedule 3 meetings
                    achieved = recordings.filter(r => r.scenario.isQualified && r.evaluation.leadQualificado).length >= 3;
                    break;
                case 'g4': // Pass a Hard scenario
                    achieved = recordings.some(r => r.difficulty === 'hard' && r.evaluation.eficacia > 60);
                    break;
                default:
                    break;
            }
            return { ...goal, achieved };
        });
        setUserGoals(updatedGoals);
    }, [recordings]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-8 text-highlight">
        Metas a Atingir
      </h1>
      <div className="space-y-4">
        {userGoals.map(goal => (
          <div key={goal.id} className={`p-6 rounded-lg shadow-lg flex items-start space-x-4 transition-all duration-300 ${goal.achieved ? 'bg-highlight/10 border-l-4 border-highlight' : 'bg-surface border-l-4 border-surface-light'}`}>
            <div className={`text-3xl ${goal.achieved ? 'text-highlight' : 'text-gray-500'}`}>
              <i className={`fas ${goal.achieved ? 'fa-check-circle' : 'fa-bullseye'}`}></i>
            </div>
            <div>
                <h2 className="text-xl font-bold text-text-main">{goal.title}</h2>
                <p className="text-gray-300">{goal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;