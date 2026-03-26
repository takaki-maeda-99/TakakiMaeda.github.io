import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Header from '@/src/components/Header/Header';
import Hero from '@/src/components/Hero/Hero';
import Timeline from '@/src/components/Timeline/Timeline';
import Projects from '@/src/components/Projects/Projects';
import Skills from '@/src/components/Skills/Skills';
import Contact from '@/src/components/Contact/Contact';
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
      <Head>
        <title>Takaki Maeda - AI Robotics Researcher</title>
        <meta name="description" content="Portfolio of Takaki Maeda — AI robotics researcher with factory floor experience. ROS2, SLAM, VLA, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Takaki Maeda - AI Robotics Researcher" />
        <meta property="og:description" content="From factory floor to AI robotics research." />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Hero />
        <Timeline events={timeline.events} />
        <Projects projects={projects} />
        <Skills categories={skills.categories} />
        <Contact />
      </main>
    </>
  );
}
