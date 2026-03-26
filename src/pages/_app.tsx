import type { AppProps } from 'next/app';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { LanguageProvider } from '@/src/context/LanguageContext';
import '@/src/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <div className={`${inter.variable} ${notoSansJP.variable}`}>
        <Component {...pageProps} />
      </div>
    </LanguageProvider>
  );
}
