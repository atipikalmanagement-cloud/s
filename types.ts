export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Briefing {
  name: string;
  experience: string;
  agency: string;
  revenue: string;
}

export interface Scenario {
  id: string;
  isQualified: boolean;
  briefing: Briefing;
  persona: string;
}

export interface Evaluation {
  eficacia: number;
  leadQualificado: boolean;
  pontosDeMelhoria: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Added for authentication
    avatar?: string;
}

export interface Recording {
    id: string;
    date: string;
    difficulty: Difficulty;
    scenario: Scenario;
    evaluation: Evaluation;
    transcript: string[];
    callAudioUrls?: string[]; // Changed from agentAudioUrl to support multiple segments
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    achieved: boolean;
}