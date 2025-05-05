export type UserRole = 'teacher' | 'child' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Child extends User {
  role: 'child';
  age: number;
  grade: string;
  parentId: string;
  teacherId: string;
  progress: {
    [gameId: string]: {
      completedLevels: number[];
      currentLevel: number;
      highestScore: number;
    };
  };
}

export interface Teacher extends User {
  role: 'teacher';
  students: string[]; // child IDs
  classes: string[];
}

export interface Parent extends User {
  role: 'parent';
  children: string[]; // child IDs
}

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  levels: Level[];
  skills: string[];
  ageRange: [number, number];
}

export interface Level {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
  instructions: string;
  challenges: Challenge[];
  timeLimit?: number;
  pointsToPass: number;
}

export interface Challenge {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  points: number;
  hint?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<User>;
}

export interface GameProgress {
  gameId: string;
  levelsCompleted: number;
  totalLevels: number;
  highestScore: number;
  lastPlayed: Date;
}