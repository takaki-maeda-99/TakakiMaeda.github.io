import { useLanguage } from '@/src/context/LanguageContext';
import styles from './Contact.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

// Contact links are defined here. UPDATE these before deploying:
// - Replace the email with your actual email address
// - Add/remove social links as needed (X, LinkedIn, etc.)
const contactLinks = [
  {
    label: 'GitHub',
    url: 'https://github.com/TakakiMaeda',
    icon: '🔗',
  },
  {
    label: 'Email',
    url: 'mailto:REPLACE_WITH_YOUR_EMAIL@example.com',
    icon: '✉️',
  },
];

export default function Contact() {
  const { language } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <section id="contact" className={styles.section}>
      <h2 className={styles.sectionTitle}>{locale.sections.contact}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.contactSubtitle}</p>
      <div className={styles.links}>
        {contactLinks.map((link) => (
          <a
            key={link.label}
            className={styles.link}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.icon}>{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
