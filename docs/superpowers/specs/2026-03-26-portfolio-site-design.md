# Portfolio Site Design Spec

## Overview

技術力とストーリー（経歴・動機）の両方が伝わるポートフォリオサイト。
工場設備保全 → 退職・大学進学 → ロボット開発・AI研究という独自のキャリアパスを前面に出し、「どんな人間なのか」が初見でわかる構成にする。

名刺QRからのアクセスを想定し、シングルページで完結する。

## Constraints

- GitHub Pages で公開（静的サイトのみ）
- Next.js SSG（Static Site Generation）を使用
- サーバーサイド処理は禁止
- 日英両対応

## Target Audience

- 技術系企業のエンジニア
- ロボット・制御・AI に関心のある人

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js (SSG, `next export`) |
| Language | TypeScript |
| Styling | CSS Modules or Tailwind CSS (TBD in implementation plan) |
| Content | MDX (projects), JSON (skills) |
| i18n | Custom context-based toggle (no heavy library) |
| Hosting | GitHub Pages |
| Animation | CSS transitions + Intersection Observer (lightweight) |

## Site Structure

Single page, scroll-based. Fixed header with navigation links and language toggle.

### Section 1: Hero

- Full-width first view
- Name displayed prominently (Japanese + Romaji)
- One-line catchphrase conveying "who this person is" (e.g., 「現場を知るAIロボット研究者」)
- Profile photo + robot visual (both)
- Brief affiliation / research field
- Fixed header: section nav links + JP/EN toggle

### Section 2: Story (Timeline)

- Vertical timeline layout (connected nodes with a line)
- Each node contains: time period, title, short description (2-3 lines), optional photo
- Timeline flow:
  1. Factory equipment maintenance — experienced real-world challenges (heavy labor, dangerous work, labor shortage)
  2. Decision to quit and enter university — conviction that AI robotics is needed for complex automation
  3. University — robotics projects, app development, AI research
  4. Present — VLA and AI robotics research
- Each step includes a brief "motivation/why" to form the narrative core
- Photos accompany each node where available

### Section 3: Projects

Two-tier card layout.

**Featured projects (5-6, `featured: true`):**
- Large cards
- Each card: thumbnail image/video, project name, short description, tech tags, GitHub link button
- Expandable for more detail (accordion or inline expand)

**Sub-projects (element technologies, `featured: false`):**
- Smaller cards in a grid below featured projects
- Each card: title, one-line description, tech tags, optional GitHub link
- Examples: independent steering mechanism, robot arm fabrication/control

### Section 4: Skills

- Grouped by category, displayed as pill/tag UI
- Categories:
  - Robotics: ROS2, SLAM, Control Engineering, Gazebo, MoveIt, etc.
  - AI / ML: PyTorch, TensorFlow, VLA, Computer Vision, etc.
  - Programming Languages: Python, C++, TypeScript, etc.
  - Web Development: Next.js, React, Node.js, etc.
  - Tools / Infra: Git, Docker, Linux, CAD, etc.

### Section 5: Contact

- Simple link buttons with icons
- GitHub, Email, other SNS (X, LinkedIn, etc.)

## Content Management

### Projects: MDX files

Location: `content/projects/`

Each project is a single `.mdx` file with frontmatter:

```yaml
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

<!-- Optional: extended description in MDX (supports both JP and EN) -->
```

- Adding a project = adding one `.mdx` file
- `featured: true` for main projects, `false` for sub/element projects
- `order` field controls display order

### Skills: JSON file

Location: `content/skills.json`

```json
{
  "categories": [
    {
      "key": "robotics",
      "label": "ロボティクス",
      "labelEn": "Robotics",
      "items": ["ROS2", "SLAM", "Control Engineering", "Gazebo", "MoveIt"]
    }
  ]
}
```

- Adding a skill = adding a string to the `items` array
- Adding a category = adding an object to the `categories` array

### Timeline: JSON file

Location: `content/timeline.json`

```json
{
  "events": [
    {
      "period": "20XX - 20XX",
      "title": "工場設備保全",
      "titleEn": "Factory Equipment Maintenance",
      "description": "重労働、危険作業、人手不足を現場で経験...",
      "descriptionEn": "Experienced heavy labor, dangerous work, and labor shortages firsthand...",
      "image": "/images/timeline/factory.jpg"
    }
  ]
}
```

## Internationalization (i18n)

- Language state managed via React Context
- Toggle button in the header switches between JP and EN
- All content files contain both `title`/`titleEn`, `description`/`descriptionEn` pairs
- UI strings (section headings, button labels) stored in a simple locale map (`locales/ja.json`, `locales/en.json`)
- Default language: Japanese
- URL does not change on toggle (client-side state only, since it's a single page)

## Directory Structure

```
TakakiMaeda.github.io/
├── content/
│   ├── projects/          # .mdx files per project
│   ├── skills.json
│   └── timeline.json
├── locales/
│   ├── ja.json            # JP UI strings
│   └── en.json            # EN UI strings
├── public/
│   └── images/
│       ├── projects/      # Project images/videos
│       ├── timeline/      # Timeline photos
│       └── hero/          # Hero section visuals
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Timeline.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   └── LanguageToggle.tsx
│   ├── context/
│   │   └── LanguageContext.tsx
│   ├── lib/
│   │   ├── getProjects.ts    # Read & parse MDX files at build time
│   │   └── getContent.ts     # Read JSON content files
│   ├── pages/
│   │   └── index.tsx          # Single page, renders all sections
│   └── styles/
│       └── globals.css
├── next.config.js             # SSG + static export config
├── package.json
└── tsconfig.json
```

## Design Notes

- **Tone**: Clean and modern. Light or neutral base with subtle tech accents. Not overly dark-theme, but professional.
- **Typography**: Sans-serif for body (e.g., Inter, Noto Sans JP). Clean, readable.
- **Responsiveness**: Mobile-first. All sections must work well on phone screens (QR code access from business cards).
- **Performance**: Static export, minimal JS. Images optimized. Lighthouse score target: 90+.
- **Accessibility**: Semantic HTML, proper heading hierarchy, alt text on images, sufficient color contrast.

## Out of Scope

- Server-side rendering or API routes
- CMS integration (content is file-based)
- Blog functionality
- Authentication or user accounts
- Analytics (can be added later as a separate concern)
