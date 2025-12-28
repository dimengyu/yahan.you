export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  tags: string[];
  // New Technical Data Points
  locationCoordinates: string; // e.g., "40.7128° N, 74.0060° W"
  area?: string; // e.g., "45,000 SQ FT"
  mainImageCaption?: string;
  mainImageCategory?: string;
  hideMainImageInDetail?: boolean;
  gallery?: { url: string; caption: string; category?: string; }[];
}

export enum HobbyType {
  HAND = 'By Hand',
  PEN = 'By Pen',
  ELECTRONICS = 'By Electronics'
}

export interface Hobby {
  id: number;
  title: string;
  type: HobbyType;
  imageUrl: string;
  date?: string;
  description?: string;
  gallery?: { url: string; caption: string }[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  location: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}