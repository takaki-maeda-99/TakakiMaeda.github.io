import { useState } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import type { Project } from '@/src/types/content';
import styles from './Projects.module.css';

interface Props {
  project: Project;
  variant: 'featured' | 'sub';
}

export default function ProjectCard({ project, variant }: Props) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`${styles.card} ${variant === 'sub' ? styles.subCard : ''}`}>
      {project.image && (
        <img
          className={styles.cardImage}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${project.image}`}
          alt={t(project.title, project.titleEn)}
        />
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          {t(project.title, project.titleEn)}
        </h3>
        <p className={styles.cardDescription}>
          {t(project.description, project.descriptionEn)}
        </p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        {project.github && (
          <a
            className={styles.githubLink}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub →
          </a>
        )}
        {variant === 'featured' && project.content && (
          <>
            <button
              className={styles.expandButton}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? (language === 'ja' ? '閉じる' : 'Close')
                : (language === 'ja' ? '詳細を見る' : 'Details')}
            </button>
            {expanded && (
              <div className={styles.expandedContent}>
                {project.content}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
