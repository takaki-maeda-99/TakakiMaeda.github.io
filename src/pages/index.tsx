import type { InferGetStaticPropsType } from 'next';
import Header from '@/src/components/Header/Header';
import Hero from '@/src/components/Hero/Hero';
import Timeline from '@/src/components/Timeline/Timeline';
import Projects from '@/src/components/Projects/Projects';
import Skills from '@/src/components/Skills/Skills';
import { getTimeline, getSkills } from '@/src/lib/getContent';
import { getAllProjects } from '@/src/lib/getProjects';

export function getStaticProps() {
  const timeline = getTimeline();
  const projects = getAllProjects();
  const skills = getSkills();

  return {
    props: { timeline, projects, skills },
  };
}

export default function Home({
  timeline,
  projects,
  skills,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Hero />
        <Timeline events={timeline.events} />
        <Projects projects={projects} />
        <Skills categories={skills.categories} />
      </main>
    </>
  );
}
