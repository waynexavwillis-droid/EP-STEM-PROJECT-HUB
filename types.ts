
export interface User {
  username: string;
  role: 'admin' | 'user';
  avatarSeed: string;
}

export interface Hardware {
  name: string;
  link: string;
  image: string;
}

export interface Software {
  name: string;
  type: string;
}

export interface LessonStep {
  title: string;
  content: string;
  image?: string;
  youtubeUrl?: string;
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
  makecodeUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatarColor: string;
  likes: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'IoT' | 'Robotics' | 'AI' | 'Electronics' | '3D Printing';
  theme: 'Health & food science' | 'Sustainable Living' | 'Future of Transportation' | 'Aesthetics (Visual and Wearable)' | 'Emerging Technologies' | 'Entrepreneurship' | 'City and Urban Landscape' | 'Language (Media and Communication)' | 'General' | 'Sample';
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  hardware: Hardware[];
  software: Software[];
  steps: LessonStep[];
  comments: Comment[];
  publishedAt: string;
  makecodeUrl?: string;
  status: 'approved' | 'pending';
  isFlagged?: boolean;
}

export interface InteractiveProject extends Project {
  isLikedByUser?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  authorAvatar?: string;
  category: string;
  status: 'approved' | 'pending';
  isFlagged?: boolean;
}

export type ViewState = 'grid' | 'detail' | 'create' | 'community' | 'submissions';

export interface AppState {
  currentView: ViewState;
  selectedProjectId: string | null;
  searchQuery: string;
  activeCategory: string;
  activeDifficulty: string;
  activeSort: string;
  user: User | null;
}
