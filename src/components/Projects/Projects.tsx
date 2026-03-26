import { useLanguage } from '@/src/context/LanguageContext';
import { useReveal } from '@/src/hooks/useReveal';
import type { Project } from '@/src/types/content';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  const { language } = useLanguage();
  const locale = language === 'ja' ? ja : en;
  const ref = useReveal();

  const featured = projects.filter((p) => p.featured);
  const sub = projects.filter((p) => !p.featured);

  return (
    <section ref={ref} id="projects" className={`${styles.section} reveal`}>
      <h2 className={styles.sectionTitle}>{locale.sections.projects}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.projectsSubtitle}</p>

      <div className={styles.groupLabel}>{locale.sections.featuredProjects}</div>
      <div className={styles.featuredGrid}>
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="featured" />
        ))}
      </div>

      {sub.length > 0 && (
        <>
          <div className={styles.groupLabel}>{locale.sections.subProjects}</div>
          <div className={styles.subGrid}>
            {sub.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="sub" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
