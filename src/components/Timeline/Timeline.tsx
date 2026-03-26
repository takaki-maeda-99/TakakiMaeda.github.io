import { useLanguage } from '@/src/context/LanguageContext';
import type { TimelineEvent } from '@/src/types/content';
import styles from './Timeline.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

interface Props {
  events: TimelineEvent[];
}

export default function Timeline({ events }: Props) {
  const { language, t } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <section id="story" className={styles.section}>
      <h2 className={styles.sectionTitle}>{locale.sections.story}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.storySubtitle}</p>
      <div className={styles.timeline}>
        {events.map((event, i) => (
          <div key={i} className={styles.item}>
            <div>
              <div className={styles.period}>{event.period}</div>
              <h3 className={styles.itemTitle}>
                {t(event.title, event.titleEn)}
              </h3>
              <p className={styles.itemDescription}>
                {t(event.description, event.descriptionEn)}
              </p>
            </div>
            {event.image && (
              <img
                className={styles.itemImage}
                src={event.image}
                alt={t(event.title, event.titleEn)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
