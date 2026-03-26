import Header from '@/src/components/Header/Header';
import Hero from '@/src/components/Hero/Hero';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Hero />
      </main>
    </>
  );
}
