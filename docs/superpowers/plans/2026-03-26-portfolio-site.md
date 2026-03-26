# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (JP/EN) single-page portfolio site with Next.js SSG, showcasing career story, projects, and skills, deployed to GitHub Pages.

**Architecture:** Next.js with static export (`output: 'export'`). Content lives in MDX files (projects) and JSON files (timeline, skills). A React Context handles language switching. CSS Modules for styling (no extra dependencies, scoped by default). All data is loaded at build time via `getStaticProps`.

**Tech Stack:** Next.js 14+, TypeScript, CSS Modules, gray-matter, next-mdx-remote, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-03-26-portfolio-site-design.md`

---

## File Structure

```
TakakiMaeda.github.io/
├── content/
│   ├── projects/
│   │   └── example-robot.mdx       # One MDX file per project
│   ├── skills.json                  # Skill categories + items
│   └── timeline.json                # Timeline events
├── locales/
│   ├── ja.json                      # JP UI strings
│   └── en.json                      # EN UI strings
├── public/
│   └── images/
│       ├── projects/
│       ├── timeline/
│       └── hero/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.css
│   │   ├── Timeline/
│   │   │   ├── Timeline.tsx
│   │   │   └── Timeline.module.css
│   │   ├── Projects/
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── Projects.module.css
│   │   ├── Skills/
│   │   │   ├── Skills.tsx
│   │   │   └── Skills.module.css
│   │   ├── Contact/
│   │   │   ├── Contact.tsx
│   │   │   └── Contact.module.css
│   │   └── LanguageToggle/
│   │       ├── LanguageToggle.tsx
│   │       └── LanguageToggle.module.css
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── lib/
│   │   ├── getProjects.ts
│   │   └── getContent.ts
│   ├── pages/
│   │   ├── _app.tsx
│   │   └── index.tsx
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── content.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `src/pages/_app.tsx`, `src/pages/index.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /home/takakimaeda/TakakiMaeda.github.io
rm index.html
npx create-next-app@latest . --typescript --no-eslint --no-tailwind --no-app --import-alias "@/*" --src-dir
```

Note: The `--src-dir` flag ensures source code is placed under `src/`, matching our file structure. If create-next-app complains about a non-empty directory, use the manual approach:

```bash
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node
mkdir -p src/pages src/styles
```

- [ ] **Step 2: Configure next.config.js for static export**

Create `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

`output: 'export'` enables static generation. `images.unoptimized: true` is required because GitHub Pages has no image optimization server.

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create minimal pages**

Create `src/pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import '@/src/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

Create `src/pages/index.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Portfolio</h1>
    </main>
  );
}
```

Create `src/styles/globals.css`:

```css
:root {
  --ink: #1a1a2e;
  --ink-2: #4a4a5a;
  --bg: #f8f9fa;
  --bg-alt: #eef1f5;
  --accent: #2563eb;
  --accent-2: #10b981;
  --card: #ffffff;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  --radius: 16px;
  --radius-sm: 10px;
  --max-width: 1100px;
  --font-sans: 'Inter', 'Noto Sans JP', system-ui, sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--ink);
  background: var(--bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Add Google Fonts to _app.tsx or document**

Update `src/pages/_app.tsx` to include fonts via `next/font`:

```tsx
import type { AppProps } from 'next/app';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import '@/src/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${notoSansJP.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

```bash
npx next build
```

Expected: Build succeeds, `out/` directory is created with static files.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with static export config"
```

---

## Task 2: Type Definitions & Content Data Files

**Files:**
- Create: `src/types/content.ts`, `content/timeline.json`, `content/skills.json`, `content/projects/example-robot.mdx`, `locales/ja.json`, `locales/en.json`

- [ ] **Step 1: Define TypeScript types**

Create `src/types/content.ts`:

```ts
export type Language = 'ja' | 'en';

export interface TimelineEvent {
  period: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image?: string;
}

export interface TimelineData {
  events: TimelineEvent[];
}

export interface SkillCategory {
  key: string;
  label: string;
  labelEn: string;
  items: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface ProjectFrontmatter {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  github?: string;
  image?: string;
  featured: boolean;
  order: number;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
  contentEn?: string;
}

export interface ContactLink {
  label: string;
  url: string;
  icon: string;
}
```

- [ ] **Step 2: Create placeholder timeline.json**

Create `content/timeline.json`:

```json
{
  "events": [
    {
      "period": "20XX - 20XX",
      "title": "工場設備保全",
      "titleEn": "Factory Equipment Maintenance",
      "description": "重労働、危険作業、人手不足を現場で経験。自動化の必要性を実感した。",
      "descriptionEn": "Experienced heavy labor, dangerous work, and labor shortages firsthand. Realized the critical need for automation.",
      "image": "/images/timeline/factory.jpg"
    },
    {
      "period": "20XX",
      "title": "退職・大学進学",
      "titleEn": "Career Change & University",
      "description": "高度で複雑な作業を自動化するにはAIロボットが必須と確信し、会社を退職。大学に進学。",
      "descriptionEn": "Convinced that AI robotics is essential for automating complex tasks, quit the job and enrolled in university.",
      "image": "/images/timeline/university.jpg"
    },
    {
      "period": "20XX - 20XX",
      "title": "ロボット開発・アプリ開発",
      "titleEn": "Robotics & App Development",
      "description": "ロボットコンテスト参加、Webアプリケーション開発、多数のプロジェクトを経験。",
      "descriptionEn": "Participated in robotics competitions, developed web applications, and worked on numerous projects.",
      "image": "/images/timeline/projects.jpg"
    },
    {
      "period": "現在",
      "title": "AIロボット研究",
      "titleEn": "AI Robotics Research",
      "description": "VLA等のAIロボット研究に取り組み、現場の自動化に貢献することを目指す。",
      "descriptionEn": "Conducting AI robotics research including VLA, aiming to contribute to real-world automation.",
      "image": "/images/timeline/research.jpg"
    }
  ]
}
```

- [ ] **Step 3: Create placeholder skills.json**

Create `content/skills.json`:

```json
{
  "categories": [
    {
      "key": "robotics",
      "label": "ロボティクス",
      "labelEn": "Robotics",
      "items": ["ROS2", "SLAM", "Control Engineering", "Gazebo", "MoveIt"]
    },
    {
      "key": "ai",
      "label": "AI / ML",
      "labelEn": "AI / ML",
      "items": ["PyTorch", "TensorFlow", "VLA", "Computer Vision"]
    },
    {
      "key": "languages",
      "label": "プログラミング言語",
      "labelEn": "Programming Languages",
      "items": ["Python", "C++", "TypeScript"]
    },
    {
      "key": "web",
      "label": "Web開発",
      "labelEn": "Web Development",
      "items": ["Next.js", "React", "Node.js"]
    },
    {
      "key": "tools",
      "label": "ツール / インフラ",
      "labelEn": "Tools / Infra",
      "items": ["Git", "Docker", "Linux", "CAD"]
    }
  ]
}
```

- [ ] **Step 4: Create example MDX project file**

Install MDX dependencies:

```bash
npm install gray-matter next-mdx-remote
```

Create `content/projects/example-robot.mdx`:

```mdx
---
title: "自律移動ロボット"
titleEn: "Autonomous Mobile Robot"
description: "ロボットコンテスト向けに開発した自律移動ロボット。SLAMによる自己位置推定と経路計画を実装。"
descriptionEn: "An autonomous mobile robot built for a robotics competition. Implements SLAM-based localization and path planning."
tags: ["ROS2", "SLAM", "Python", "Gazebo"]
github: "https://github.com/TakakiMaeda/example"
image: "/images/projects/robot.jpg"
featured: true
order: 1
---
```

- [ ] **Step 5: Create locale files**

Create `locales/ja.json`:

```json
{
  "nav": {
    "story": "ストーリー",
    "projects": "プロジェクト",
    "skills": "スキル",
    "contact": "コンタクト"
  },
  "hero": {
    "eyebrow": "ポートフォリオ",
    "catchphrase": "現場を知るAIロボット研究者",
    "description": "工場の現場課題を原点に、AIロボットで自動化の未来を切り拓く。"
  },
  "sections": {
    "story": "ストーリー",
    "storySubtitle": "現場から研究室へ。",
    "projects": "プロジェクト",
    "projectsSubtitle": "これまでの制作物と研究。",
    "featuredProjects": "主なプロジェクト",
    "subProjects": "要素技術・成果物",
    "skills": "技術スタック",
    "skillsSubtitle": "使用している技術。",
    "contact": "コンタクト",
    "contactSubtitle": "お気軽にご連絡ください。"
  },
  "actions": {
    "viewProjects": "プロジェクトを見る",
    "viewGitHub": "GitHubを見る",
    "sendEmail": "メールを送る"
  }
}
```

Create `locales/en.json`:

```json
{
  "nav": {
    "story": "Story",
    "projects": "Projects",
    "skills": "Skills",
    "contact": "Contact"
  },
  "hero": {
    "eyebrow": "Portfolio",
    "catchphrase": "AI Robotics Researcher with Factory Floor Experience",
    "description": "From factory floor challenges to cutting-edge AI robotics — building the future of automation."
  },
  "sections": {
    "story": "Story",
    "storySubtitle": "From the factory to the lab.",
    "projects": "Projects",
    "projectsSubtitle": "Selected work and research.",
    "featuredProjects": "Featured Projects",
    "subProjects": "Element Technologies",
    "skills": "Tech Stack",
    "skillsSubtitle": "Technologies I work with.",
    "contact": "Contact",
    "contactSubtitle": "Feel free to reach out."
  },
  "actions": {
    "viewProjects": "View Projects",
    "viewGitHub": "View GitHub",
    "sendEmail": "Send Email"
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/types/content.ts content/ locales/
git commit -m "feat: add type definitions, content data files, and locale strings"
```

---

## Task 3: Language Context & Content Loading

**Files:**
- Create: `src/context/LanguageContext.tsx`, `src/lib/getContent.ts`, `src/lib/getProjects.ts`

- [ ] **Step 1: Create LanguageContext**

Create `src/context/LanguageContext.tsx`:

```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language } from '@/src/types/content';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (ja: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  }, []);

  const t = useCallback(
    (ja: string, en: string) => (language === 'ja' ? ja : en),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
```

- [ ] **Step 2: Create getContent.ts**

Create `src/lib/getContent.ts`:

```ts
import fs from 'fs';
import path from 'path';
import type { TimelineData, SkillsData } from '@/src/types/content';

const contentDir = path.join(process.cwd(), 'content');

export function getTimeline(): TimelineData {
  const filePath = path.join(contentDir, 'timeline.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getSkills(): SkillsData {
  const filePath = path.join(contentDir, 'skills.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
```

- [ ] **Step 3: Create getProjects.ts**

Create `src/lib/getProjects.ts`:

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project, ProjectFrontmatter } from '@/src/types/content';

const projectsDir = path.join(process.cwd(), 'content', 'projects');

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.mdx'));

  const projects = files.map((filename) => {
    const filePath = path.join(projectsDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = data as ProjectFrontmatter;

    return {
      ...frontmatter,
      slug: filename.replace(/\.mdx$/, ''),
      content,
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 4: Wire LanguageProvider into _app.tsx**

Update `src/pages/_app.tsx`:

```tsx
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
```

- [ ] **Step 5: Verify build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/context/ src/lib/ src/pages/_app.tsx
git commit -m "feat: add language context, content loaders, and wire provider"
```

---

## Task 4: Header & Language Toggle

**Files:**
- Create: `src/components/Header/Header.tsx`, `src/components/Header/Header.module.css`, `src/components/LanguageToggle/LanguageToggle.tsx`, `src/components/LanguageToggle/LanguageToggle.module.css`

- [ ] **Step 1: Create LanguageToggle component**

Create `src/components/LanguageToggle/LanguageToggle.module.css`:

```css
.toggle {
  background: var(--bg-alt);
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  color: var(--ink);
  transition: background 0.2s;
}

.toggle:hover {
  background: var(--ink);
  color: var(--bg);
}
```

Create `src/components/LanguageToggle/LanguageToggle.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Header component**

Create `src/components/Header/Header.module.css`:

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(248, 249, 250, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.name {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navLink {
  color: var(--ink-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.navLink:hover {
  color: var(--ink);
}

@media (max-width: 640px) {
  .nav {
    gap: 12px;
  }

  .navLink {
    font-size: 13px;
  }
}
```

Create `src/components/Header/Header.tsx`:

```tsx
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
```

- [ ] **Step 3: Add Header to index.tsx**

Update `src/pages/index.tsx`:

```tsx
import Header from '@/src/components/Header/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <h1>Portfolio</h1>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify build and check visually**

```bash
npx next build && npx serve out
```

Open `http://localhost:3000` and verify: fixed header with nav links and JP/EN toggle.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header/ src/components/LanguageToggle/ src/pages/index.tsx
git commit -m "feat: add fixed header with navigation and language toggle"
```

---

## Task 5: Hero Section

**Files:**
- Create: `src/components/Hero/Hero.tsx`, `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Create Hero styles**

Create `src/components/Hero/Hero.module.css`:

```css
.hero {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px 60px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
  min-height: 80vh;
}

.eyebrow {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 12px;
}

.name {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 8px;
}

.catchphrase {
  font-size: clamp(18px, 2.5vw, 24px);
  color: var(--ink-2);
  font-weight: 500;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: var(--ink-2);
  line-height: 1.8;
  margin-bottom: 28px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.button {
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.85;
}

.primary {
  background: var(--ink);
  color: var(--bg);
}

.ghost {
  border: 1.5px solid var(--ink);
  color: var(--ink);
  background: transparent;
}

.visual {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--bg-alt);
}

.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 40px 20px 40px;
    min-height: auto;
  }

  .visual {
    order: -1;
  }
}
```

- [ ] **Step 2: Create Hero component**

Create `src/components/Hero/Hero.tsx`:

```tsx
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
        {/* User will add their own hero image */}
        <img src="/images/hero/profile.jpg" alt="Takaki Maeda" />
      </div>
    </section>
  );
}
```

Note: The name "前田 貴輝" is a placeholder — the user should replace it with the correct kanji if different.

- [ ] **Step 3: Add Hero to index.tsx**

Update `src/pages/index.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/ src/pages/index.tsx
git commit -m "feat: add Hero section with bilingual support"
```

---

## Task 6: Timeline Section

**Files:**
- Create: `src/components/Timeline/Timeline.tsx`, `src/components/Timeline/Timeline.module.css`

- [ ] **Step 1: Create Timeline styles**

Create `src/components/Timeline/Timeline.module.css`:

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px;
}

.sectionTitle {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sectionSubtitle {
  color: var(--ink-2);
  margin-bottom: 40px;
}

.timeline {
  position: relative;
  display: grid;
  gap: 32px;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--bg-alt);
}

.item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  background: var(--card);
  border-radius: var(--radius-sm);
  padding: 24px;
  box-shadow: var(--shadow);
}

.item::before {
  content: '';
  position: absolute;
  left: -29px;
  top: 28px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 3px solid var(--bg);
}

.period {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}

.itemTitle {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.itemDescription {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.7;
}

.itemImage {
  width: 160px;
  height: 120px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--bg-alt);
}

@media (max-width: 640px) {
  .item {
    grid-template-columns: 1fr;
  }

  .itemImage {
    width: 100%;
    height: 180px;
  }
}
```

- [ ] **Step 2: Create Timeline component**

Create `src/components/Timeline/Timeline.tsx`:

```tsx
import { useLanguage } from '@/src/context/LanguageContext';
import type { TimelineEvent } from '@/src/types/content';
import styles from './Timeline.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

interface Props {
  events: TimelineEvent[];
}

export default function Timeline({ events }: Props) {
  const { language, t } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  return (
    <section id="story" className={styles.section}>
      <h2 className={styles.sectionTitle}>{locale.sections.story}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.storySubtitle}</p>
      <div className={styles.timeline}>
        {events.map((event, i) => (
          <div key={i} className={styles.item}>
            <div>
              <div className={styles.period}>{event.period}</div>
              <h3 className={styles.itemTitle}>
                {t(event.title, event.titleEn)}
              </h3>
              <p className={styles.itemDescription}>
                {t(event.description, event.descriptionEn)}
              </p>
            </div>
            {event.image && (
              <img
                className={styles.itemImage}
                src={event.image}
                alt={t(event.title, event.titleEn)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Timeline into index.tsx with getStaticProps**

Update `src/pages/index.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: Build succeeds. Timeline data loads from JSON.

- [ ] **Step 5: Commit**

```bash
git add src/components/Timeline/ src/pages/index.tsx
git commit -m "feat: add Timeline section with bilingual content from JSON"
```

---

## Task 7: Projects Section

**Files:**
- Create: `src/components/Projects/Projects.tsx`, `src/components/Projects/ProjectCard.tsx`, `src/components/Projects/Projects.module.css`

- [ ] **Step 1: Create Projects styles**

Create `src/components/Projects/Projects.module.css`:

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px;
}

.sectionTitle {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sectionSubtitle {
  color: var(--ink-2);
  margin-bottom: 40px;
}

.groupLabel {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 16px;
}

.featuredGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.subGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: var(--card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.cardImage {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--bg-alt);
  display: block;
}

.cardBody {
  padding: 20px;
}

.cardTitle {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}

.cardDescription {
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background: var(--bg-alt);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-2);
}

.githubLink {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}

.githubLink:hover {
  text-decoration: underline;
}

/* Small cards for sub-projects */
.subCard .cardImage {
  aspect-ratio: 16 / 9;
}

.subCard .cardBody {
  padding: 16px;
}

.subCard .cardTitle {
  font-size: 15px;
}

.subCard .cardDescription {
  font-size: 13px;
}

.expandButton {
  background: none;
  border: 1px solid var(--bg-alt);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  color: var(--ink-2);
  font-family: var(--font-sans);
  margin-top: 8px;
  transition: background 0.2s;
}

.expandButton:hover {
  background: var(--bg-alt);
}

.expandedContent {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-2);
}

@media (max-width: 768px) {
  .featuredGrid {
    grid-template-columns: 1fr;
  }

  .subGrid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create ProjectCard component**

Create `src/components/Projects/ProjectCard.tsx`:

```tsx
import { useState } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import type { Project } from '@/src/types/content';
import styles from './Projects.module.css';

interface Props {
  project: Project;
  variant: 'featured' | 'sub';
}

export default function ProjectCard({ project, variant }: Props) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`${styles.card} ${variant === 'sub' ? styles.subCard : ''}`}>
      {project.image && (
        <img
          className={styles.cardImage}
          src={project.image}
          alt={t(project.title, project.titleEn)}
        />
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          {t(project.title, project.titleEn)}
        </h3>
        <p className={styles.cardDescription}>
          {t(project.description, project.descriptionEn)}
        </p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        {project.github && (
          <a
            className={styles.githubLink}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub →
          </a>
        )}
        {variant === 'featured' && project.content && (
          <>
            <button
              className={styles.expandButton}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? (language === 'ja' ? '閉じる' : 'Close')
                : (language === 'ja' ? '詳細を見る' : 'Details')}
            </button>
            {expanded && (
              <div className={styles.expandedContent}>
                {project.content}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create Projects component**

Create `src/components/Projects/Projects.tsx`:

```tsx
import { useLanguage } from '@/src/context/LanguageContext';
import type { Project } from '@/src/types/content';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  const { language } = useLanguage();
  const locale = language === 'ja' ? ja : en;

  const featured = projects.filter((p) => p.featured);
  const sub = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className={styles.section}>
      <h2 className={styles.sectionTitle}>{locale.sections.projects}</h2>
      <p className={styles.sectionSubtitle}>{locale.sections.projectsSubtitle}</p>

      <div className={styles.groupLabel}>{locale.sections.featuredProjects}</div>
      <div className={styles.featuredGrid}>
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="featured" />
        ))}
      </div>

      {sub.length > 0 && (
        <>
          <div className={styles.groupLabel}>{locale.sections.subProjects}</div>
          <div className={styles.subGrid}>
            {sub.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="sub" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Wire Projects into index.tsx**

Update `src/pages/index.tsx`:

```tsx
import type { InferGetStaticPropsType } from 'next';
import Header from '@/src/components/Header/Header';
import Hero from '@/src/components/Hero/Hero';
import Timeline from '@/src/components/Timeline/Timeline';
import Projects from '@/src/components/Projects/Projects';
import { getTimeline } from '@/src/lib/getContent';
import { getAllProjects } from '@/src/lib/getProjects';

export function getStaticProps() {
  const timeline = getTimeline();
  const projects = getAllProjects();

  return {
    props: { timeline, projects },
  };
}

export default function Home({
  timeline,
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '60px' }}>
        <Hero />
        <Timeline events={timeline.events} />
        <Projects projects={projects} />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npx next build
```

Expected: Build succeeds. Projects load from MDX files.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects/ src/pages/index.tsx
git commit -m "feat: add Projects section with featured/sub two-tier layout"
```

---

## Task 8: Skills Section

**Files:**
- Create: `src/components/Skills/Skills.tsx`, `src/components/Skills/Skills.module.css`

- [ ] **Step 1: Create Skills styles**

Create `src/components/Skills/Skills.module.css`:

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px;
}

.sectionTitle {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sectionSubtitle {
  color: var(--ink-2);
  margin-bottom: 40px;
}

.categories {
  display: grid;
  gap: 28px;
}

.category {
  background: var(--card);
  border-radius: var(--radius-sm);
  padding: 24px;
  box-shadow: var(--shadow);
}

.categoryLabel {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 14px;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  background: var(--bg-alt);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}
```

- [ ] **Step 2: Create Skills component**

Create `src/components/Skills/Skills.tsx`:

```tsx
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
```

- [ ] **Step 3: Wire Skills into index.tsx**

Update `src/pages/index.tsx` — add `getSkills()` to `getStaticProps` and render `<Skills>`:

```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills/ src/pages/index.tsx
git commit -m "feat: add Skills section with category-grouped pill layout"
```

---

## Task 9: Contact Section

**Files:**
- Create: `src/components/Contact/Contact.tsx`, `src/components/Contact/Contact.module.css`

- [ ] **Step 1: Create Contact styles**

Create `src/components/Contact/Contact.module.css`:

```css
.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.sectionTitle {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sectionSubtitle {
  color: var(--ink-2);
  margin-bottom: 32px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: var(--card);
  color: var(--ink);
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.link:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.icon {
  font-size: 18px;
}
```

- [ ] **Step 2: Create Contact component**

Create `src/components/Contact/Contact.tsx`:

```tsx
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
```

Note: The user should replace `your-email@example.com` with their real email and add additional social links (X, LinkedIn) as needed.

- [ ] **Step 3: Wire Contact into index.tsx**

Update `src/pages/index.tsx` — add Contact import and render after Skills:

```tsx
import Contact from '@/src/components/Contact/Contact';
// ... (add to the JSX after <Skills />)
<Contact />
```

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact/ src/pages/index.tsx
git commit -m "feat: add Contact section with social links"
```

---

## Task 10: Scroll Animations

**Files:**
- Create: `src/hooks/useReveal.ts`
- Modify: `src/styles/globals.css`, all section components

- [ ] **Step 1: Create useReveal hook**

Create `src/hooks/useReveal.ts`:

```ts
import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

- [ ] **Step 2: Add reveal animation styles to globals.css**

Append to `src/styles/globals.css`:

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .revealed {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: Apply useReveal to each section component**

For each section (Hero, Timeline, Projects, Skills, Contact), add:

```tsx
import { useReveal } from '@/src/hooks/useReveal';

// Inside the component:
const ref = useReveal();

// On the outer section/div element, append 'reveal' to the existing className:
// Hero:     <section ref={ref} className={`${styles.hero} reveal`}>
// Timeline: <section ref={ref} className={`${styles.section} reveal`}>
// Projects: <section ref={ref} className={`${styles.section} reveal`}>
// Skills:   <section ref={ref} className={`${styles.section} reveal`}>
// Contact:  <section ref={ref} className={`${styles.section} reveal`}>
```

This is a mechanical change to 5 files. Each section's outermost element gets `ref={ref}` and `className` gains ` reveal`. Use each component's actual root class name (e.g., `styles.hero` for Hero, `styles.section` for others).

- [ ] **Step 4: Verify build and visual check**

```bash
npx next build && npx serve out
```

Scroll through the page — each section should fade in as it enters the viewport.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/ src/styles/globals.css src/components/
git commit -m "feat: add scroll reveal animations with Intersection Observer"
```

---

## Task 11: Responsive Polish & Meta Tags

**Files:**
- Modify: `src/pages/index.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Add meta tags and page title**

Update `src/pages/index.tsx` — add `Head` from `next/head`:

```tsx
import Head from 'next/head';

// Inside Home component, before Header:
<Head>
  <title>Takaki Maeda - AI Robotics Researcher</title>
  <meta name="description" content="Portfolio of Takaki Maeda — AI robotics researcher with factory floor experience. ROS2, SLAM, VLA, and more." />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" />
  <meta property="og:title" content="Takaki Maeda - AI Robotics Researcher" />
  <meta property="og:description" content="From factory floor to AI robotics research." />
  <meta property="og:type" content="website" />
</Head>
```

- [ ] **Step 2: Review responsive breakpoints**

Check all CSS module files at 320px, 375px, 768px, 1024px widths. Fix any overflow or layout issues found. Key areas:
- Header nav wrapping on small screens
- Hero grid stacking on mobile
- Project cards stacking on mobile
- Timeline images stacking on mobile

- [ ] **Step 3: Verify build**

```bash
npx next build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.tsx src/styles/ src/components/
git commit -m "feat: add meta tags and responsive polish"
```

---

## Task 12: GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Update .gitignore**

Create or update `.gitignore`:

```
node_modules/
.next/
out/
*.tsbuildinfo
```

- [ ] **Step 2: Add build script to package.json**

Ensure `package.json` scripts include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

- [ ] **Step 3: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify full build locally**

```bash
npm run build
ls out/index.html
```

Expected: `out/index.html` exists with full static content.

- [ ] **Step 5: Commit**

```bash
git add .github/ .gitignore package.json
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
```

- [ ] **Step 6: Push and verify deployment**

```bash
git push origin main
```

Check GitHub Actions tab — workflow should run and deploy to `https://TakakiMaeda.github.io/`.

Note: GitHub Pages must be configured to use "GitHub Actions" as the source in the repository settings (Settings → Pages → Source → GitHub Actions).
