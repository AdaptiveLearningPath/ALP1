import { User, Child, Teacher, Parent } from '../types';

export const mockUsers: User[] = [
  {
    id: 'teacher-1',
    name: 'Ms. Johnson',
    email: 'teacher@example.com',
    role: 'teacher',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    students: ['child-1', 'child-2', 'child-3'],
    classes: ['Class A', 'Class B'],
  } as Teacher,
  
  {
    id: 'parent-1',
    name: 'David Williams',
    email: 'parent@example.com',
    role: 'parent',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    children: ['child-1'],
  } as Parent,
  
  {
    id: 'child-1',
    name: 'Alex Williams',
    email: 'child@example.com',
    role: 'child',
    avatar: 'https://randomuser.me/api/portraits/kids/3.jpg',
    age: 8,
    grade: '3rd Grade',
    parentId: 'parent-1',
    teacherId: 'teacher-1',
    progress: {
      'game-1': {
        completedLevels: [1, 2],
        currentLevel: 3,
        highestScore: 850,
      },
      'game-2': {
        completedLevels: [1],
        currentLevel: 2,
        highestScore: 720,
      },
    },
  } as Child,
];