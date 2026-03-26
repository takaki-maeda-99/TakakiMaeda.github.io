import { useLanguage } from '@/src/context/LanguageContext';
import styles from './Hero.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

export default function Hero() {
  const { language } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <section className={styles.hero}>
      <div>
        <div className={styles.eyebrow}>{locale.hero.eyebrow}</div>
        <h1 className={styles.name}>
          {language === 'ja' ? '前田 貴輝' : 'Takaki Maeda'}
        </h1>
        <p className={styles.catchphrase}>{locale.hero.catchphrase}</p>
        <p className={styles.description}>{locale.hero.description}</p>
        <div className={styles.actions}>
          <a className={`${styles.button} ${styles.primary}`} href="#projects">
            {locale.actions.viewProjects}
          </a>
          <a className={`${styles.button} ${styles.ghost}`} href="#contact">
            {locale.actions.sendEmail}
          </a>
        </div>
      </div>
      <div className={styles.visual}>
        <img src="/images/hero/profile.jpg" alt="Takaki Maeda" />
      </div>
    </section>
  );
}
