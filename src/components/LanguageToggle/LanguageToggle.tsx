import { useLanguage } from '@/src/context/LanguageContext';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className={styles.toggle}
      onClick={toggleLanguage}
      aria-label={language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      {language === 'ja' ? 'EN' : 'JP'}
    </button>
  );
}
