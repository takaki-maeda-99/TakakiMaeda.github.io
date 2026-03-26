export type Language = 'ja' | 'en';

export interface TimelineEvent {
  period: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image?: string;
}

export interface TimelineData {
  events: TimelineEvent[];
}

export interface SkillCategory {
  key: string;
  label: string;
  labelEn: string;
  items: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface ProjectFrontmatter {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  github?: string;
  image?: string;
  featured: boolean;
  order: number;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
  contentEn?: string;
}

export interface ContactLink {
  label: string;
  url: string;
  icon: string;
}
