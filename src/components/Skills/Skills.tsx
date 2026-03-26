import { useLanguage } from '@/src/context/LanguageContext';
import type { SkillCategory } from '@/src/types/content';
import styles from './Skills.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

interface Props {
  categories: SkillCategory[];
}

export default function Skills({ categories }: Props) {
  const { language, t } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <section id="skills" className={styles.section}>
      <h2 className={styles.sectionTitle}>{locale.sections.skills}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.skillsSubtitle}</p>
      <div className={styles.categories}>
        {categories.map((cat) => (
          <div key={cat.key} className={styles.category}>
            <div className={styles.categoryLabel}>
              {t(cat.label, cat.labelEn)}
            </div>
            <div className={styles.pills}>
              {cat.items.map((item) => (
                <span key={item} className={styles.pill}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
