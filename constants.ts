
import { Project } from './types';

export const THEME = {
  primary: '#6b21a8', 
  secondary: '#FFD700', 
  background: '#0a0118', 
  cardBg: '#FFFFFF',
  textMain: '#FFFFFF',
  textDark: '#1a1a1a'
};

export const CATEGORIES = ['All projects', 'IoT', 'Robotics', 'AI', 'Electronics', '3D Printing'];

export const THEMES = [
  'General',
  'Health & food science',
  'Sustainable Living',
  'Future of Transportation',
  'Aesthetics (Visual and Wearable)',
  'Emerging Technologies',
  'Entrepreneurship',
  'City and Urban Landscape',
  'Language (Media and Communication)',
  'Sample'
];

export const AVATAR_BG = 'b6e3f4';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Smart Garden Monitoring',
    description: 'A reference mission for students to understand IoT integration.',
    author: 'EPSUPPORT1234',
    difficulty: 'Intermediate',
    category: 'IoT',
    theme: 'Sample',
    thumbnail: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800',
    views: 1240,
    likes: 89,
    duration: '4 Hours',
    hardware: [{ name: 'ESP32', link: '#', image: 'https://picsum.photos/id/1/100/100' }],
    software: [],
    steps: [],
    comments: [],
    publishedAt: '2023-10-15',
    status: 'approved'
  },
  {
    id: '2',
    title: 'Solar Tracker v2',
    description: 'Maximum efficiency solar panel positioning system.',
    author: 'Sunlight Dev',
    difficulty: 'Advanced',
    category: 'Electronics',
    theme: 'Sustainable Living',
    thumbnail: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800',
    views: 2100,
    likes: 156,
    duration: '8 Hours',
    hardware: [],
    software: [],
    steps: [],
    comments: [],
    publishedAt: '2023-12-20',
    status: 'approved'
  }
];
