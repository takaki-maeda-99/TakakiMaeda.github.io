import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project, ProjectFrontmatter } from '@/src/types/content';

const projectsDir = path.join(process.cwd(), 'content', 'projects');

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.mdx'));

  const projects = files.map((filename) => {
    const filePath = path.join(projectsDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = data as ProjectFrontmatter;

    return {
      ...frontmatter,
      slug: filename.replace(/\.mdx$/, ''),
      content,
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}
