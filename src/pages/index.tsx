import type { InferGetStaticPropsType } from 'next';
import Header from '@/src/components/Header/Header';
import Hero from '@/src/components/Hero/Hero';
import Timeline from '@/src/components/Timeline/Timeline';
import { getTimeline } from '@/src/lib/getContent';

export function getStaticProps() {
  const timeline = getTimeline();

  return {
    props: { timeline },
  };
}

export default function Home({
  timeline,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Hero />
        <Timeline events={timeline.events} />
      </main>
    </>
  );
}
