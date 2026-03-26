import fs from 'fs';
import path from 'path';
import type { TimelineData, SkillsData } from '@/src/types/content';

const contentDir = path.join(process.cwd(), 'content');

export function getTimeline(): TimelineData {
  const filePath = path.join(contentDir, 'timeline.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getSkills(): SkillsData {
  const filePath = path.join(contentDir, 'skills.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
