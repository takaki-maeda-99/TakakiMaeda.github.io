import { useLanguage } from '@/src/context/LanguageContext';
import LanguageToggle from '@/src/components/LanguageToggle/LanguageToggle';
import styles from './Header.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

export default function Header() {
  const { language } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.name}>Takaki Maeda</span>
        <nav className={styles.nav}>
          <a className={styles.navLink} href="#story">{locale.nav.story}</a>
          <a className={styles.navLink} href="#projects">{locale.nav.projects}</a>
          <a className={styles.navLink} href="#skills">{locale.nav.skills}</a>
          <a className={styles.navLink} href="#contact">{locale.nav.contact}</a>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
