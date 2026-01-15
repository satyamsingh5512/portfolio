# 🚀 STEP-BY-STEP IMPLEMENTATION GUIDE
## Adding Missing Features from Reference Repository

This guide provides **exact, copy-paste ready commands** to implement all missing features.

---

## 📋 PHASE 1: CRITICAL FEATURES (30 minutes)

### 1.1 Install Lenis Smooth Scroll

**Install package:**
```bash
bun add lenis
```

**Update `src/app/layout.tsx`:**
```tsx
// Add this import at the top
import ReactLenis from 'lenis/react';

// Wrap your content with ReactLenis
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-hanken-grotesk antialiased`}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReactLenis root>  {/* ADD THIS */}
                <Navbar />
                {children}
                <OnekoCat />
                <Quote />
                <Footer />
                <ChatBubble />
                <UmamiAnalytics />
              </ReactLenis>  {/* ADD THIS */}
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
```

**Create `src/lib/lenis.ts`:**
```tsx
'use client';

export * from 'lenis/react';
```

✅ **Test:** Scroll your page - it should feel smoother!

---

### 1.2 Setup Husky + Lint-Staged

**Install packages:**
```bash
bun add -d husky lint-staged
```

**Add scripts to `package.json`:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --config .prettierrc --write",
      "eslint --fix"
    ],
    "*.{json,md}": [
      "prettier --config .prettierrc --write"
    ]
  }
}
```

**Initialize Husky:**
```bash
bun run prepare
```

**Create pre-commit hook:**
```bash
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx lint-staged' > .husky/pre-commit

chmod +x .husky/pre-commit
```

✅ **Test:** Make a change and commit - it should auto-format!

---

### 1.3 Add Telegram Test Script

**Create `src/validate/testTelegram.ts`:**
```typescript
// Quick test script to verify Telegram setup
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramBotInfo {
  ok: boolean;
  result?: {
    first_name: string;
    username: string;
  };
}

interface TelegramUpdate {
  ok: boolean;
  result: Array<{
    message: {
      chat: {
        id: number;
      };
    };
  }>;
}

interface TelegramSendResponse {
  ok: boolean;
  description?: string;
}

async function testTelegram(): Promise<void> {
  console.log('🔍 Testing Telegram Bot Setup...\n');

  if (!TELEGRAM_BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found in .env file!');
    return;
  }

  // Test 1: Check bot info
  console.log('1️⃣ Checking bot status...');
  const botInfoResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`,
  );
  const botInfo: TelegramBotInfo = await botInfoResponse.json();

  if (botInfo.ok && botInfo.result) {
    console.log('✅ Bot is active!');
    console.log(`   Name: ${botInfo.result.first_name}`);
    console.log(`   Username: @${botInfo.result.username}\n`);
  } else {
    console.log('❌ Bot token is invalid!\n');
    return;
  }

  // Test 2: Check for recent messages
  console.log('2️⃣ Checking for messages...');
  const updatesResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
  );
  const updates: TelegramUpdate = await updatesResponse.json();

  if (updates.ok && updates.result.length > 0) {
    console.log('✅ Found messages!');
    const lastMessage = updates.result[updates.result.length - 1];
    const correctChatId = lastMessage.message.chat.id;
    console.log(`   Your correct Chat ID: ${correctChatId}`);

    if (correctChatId.toString() === TELEGRAM_CHAT_ID) {
      console.log('   ✅ Chat ID in .env is CORRECT!\n');
    } else {
      console.log(`   ⚠️  Chat ID in .env is WRONG!`);
      console.log(`   Current .env value: ${TELEGRAM_CHAT_ID}`);
      console.log(`   Should be: ${correctChatId}\n`);
    }
  } else {
    console.log('❌ No messages found!');
    if (botInfo.result) {
      console.log(`   👉 Go to Telegram and search for @${botInfo.result.username}`);
    }
    console.log('   👉 Click START and send a message');
    console.log('   👉 Then run this script again\n');
    return;
  }

  // Test 3: Try sending a test message
  console.log('3️⃣ Sending test message...');
  const testMessage = '🎉 Contact form is working! This is a test message.';

  const sendResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: testMessage,
      }),
    },
  );

  const sendResult: TelegramSendResponse = await sendResponse.json();

  if (sendResult.ok) {
    console.log('✅ Test message sent successfully!');
    console.log('   Check your Telegram - you should see the test message\n');
    console.log('🎉 EVERYTHING IS WORKING!\n');
  } else {
    console.log('❌ Failed to send message!');
    console.log(`   Error: ${sendResult.description}\n`);
  }
}

testTelegram().catch(console.error);
```

**Add script to `package.json`:**
```json
"scripts": {
  "test-telegram": "bun src/validate/testTelegram.ts"
}
```

✅ **Test:** Run `bun run test-telegram`

---

### 1.4 Install Knip

**Install package:**
```bash
bun add -d knip
```

**Create `knip.json`:**
```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["src/**/*.{ts,tsx,js,jsx}"],
  "project": ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!"],
  "ignore": ["public/oneko/oneko.js"],
  "ignoreDependencies": [
    "@mdx-js/loader",
    "@mdx-js/react",
    "@next/mdx",
    "@types/mdx",
    "date-fns",
    "motion",
    "recharts",
    "rehype-stringify",
    "remark-frontmatter",
    "remark-gfm",
    "shiki",
    "@tailwindcss/typography",
    "eslint-config-next",
    "tailwindcss",
    "tw-animate-css",
    "postcss",
    "bcryptjs",
    "next-auth",
    "katex",
    "react-katex",
    "rehype-katex",
    "remark-math",
    "@codemirror/lang-javascript",
    "@codemirror/lang-markdown",
    "@codemirror/lang-python",
    "@codemirror/theme-one-dark",
    "@uiw/react-codemirror",
    "uuid"
  ],
  "ignoreExportsUsedInFile": {
    "interface": true,
    "type": true
  }
}
```

**Add script to `package.json`:**
```json
"scripts": {
  "knip": "knip"
}
```

✅ **Test:** Run `bun run knip` to find unused code

---

## 📋 PHASE 2: OPTIONAL FEATURES (1-2 hours)

### 2.1 Add Gears Page

**Create `src/config/Gears.tsx`:**
```tsx
import Headphones from '@/components/svgs/devices/Headphones';
import Keyboard from '@/components/svgs/devices/Keyboard';
import Laptop from '@/components/svgs/devices/Laptop';
import Monitor from '@/components/svgs/devices/Monitor';
import Mouse from '@/components/svgs/devices/Mouse';
import Phone from '@/components/svgs/devices/Phone';

export const devices = [
  {
    name: 'Your Laptop Model',
    icon: <Laptop className="size-4" />,
  },
  {
    name: 'Your Monitor Model',
    icon: <Monitor className="size-4" />,
  },
  {
    name: 'Your Keyboard',
    icon: <Keyboard className="size-4" />,
  },
  {
    name: 'Your Mouse',
    icon: <Mouse className="size-4" />,
  },
  {
    name: 'Your Headphones',
    icon: <Headphones className="size-4" />,
  },
  {
    name: 'Your Phone',
    icon: <Phone className="size-4" />,
  },
];

export const webExtensions = [
  { name: 'uBlock Origin', href: 'https://ublockorigin.com/' },
  { name: 'React Developer Tools', href: 'https://react.dev/learn/react-developer-tools' },
  { name: 'Wappalyzer', href: 'https://www.wappalyzer.com/' },
  // Add your extensions
];

export const software = [
  { name: 'VS Code', href: 'https://code.visualstudio.com/' },
  { name: 'Notion', href: 'https://www.notion.so/' },
  { name: 'Figma', href: 'https://www.figma.com/' },
  // Add your software
];
```

**Create `src/app/gears/page.tsx`:**
```tsx
import Container from '@/components/common/Container';
import Monitor from '@/components/svgs/devices/Monitor';
import { Separator } from '@/components/ui/separator';
import { devices, software, webExtensions } from '@/config/Gears';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { ArrowUpRight, Puzzle } from 'lucide-react';
import { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import React from 'react';

export const metadata: Metadata = {
  ...getMetadata('/gears'),
  robots: {
    index: true,
    follow: true,
  },
};

export default function GearsPage() {
  return (
    <Container className="py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Gears
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            My gears and tools I use to get my work done.
          </p>
        </div>
        <Separator />

        {/* Devices Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Devices</h2>
          <div className="flex flex-col flex-wrap gap-4">
            {devices.map((device) => (
              <div key={device.name} className="flex items-center gap-4">
                <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 dark:border-white/10">
                  {device.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-secondary text-sm">{device.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Web Extensions Section */}
        <div className="space-y-4 pt-10">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 dark:border-white/10">
              <Puzzle className="size-4" />
            </div>
            <h2 className="text-2xl font-semibold">Web Extensions</h2>
          </div>
          <div className="mt-8 flex flex-col flex-wrap gap-4">
            {webExtensions.map((extension, index) => (
              <div key={extension.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 px-2 py-1 dark:border-white/10">
                    <span className="text-secondary text-sm">{index + 1}</span>
                  </div>
                  <h3 className="text-secondary ml-4 flex items-center gap-1 text-sm">
                    <Link target="_blank" href={extension.href}>
                      {extension.name}
                    </Link>
                    <ArrowUpRight className="size-4" />
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Software Section */}
        <div className="space-y-4 pt-10">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 dark:border-white/10">
              <Monitor className="size-4" />
            </div>
            <h2 className="text-2xl font-semibold">Software</h2>
          </div>
          <div className="mt-8 flex flex-col flex-wrap gap-4">
            {software.map((app, index) => (
              <div key={app.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 px-2 py-1 dark:border-white/10">
                    <span className="text-secondary text-sm">{index + 1}</span>
                  </div>
                  <h3 className="text-secondary ml-4 flex items-center gap-1 text-sm">
                    <Link target="_blank" href={app.href}>
                      {app.name}
                    </Link>
                    <ArrowUpRight className="size-4" />
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
```

**Update `src/config/Meta.tsx`:**
Add this to `pageMetadata`:
```tsx
'/gears': {
  title: 'Gears - My Setup & Tools',
  description: 'Discover the tools, devices, and software I use to get my work done efficiently.',
  keywords: ['setup', 'tools', 'devices', 'software', 'productivity', 'development environment'],
  ogImage: '/meta/gears.png',
  twitterCard: 'summary_large_image',
},
```

✅ **Test:** Visit `/gears` page

---

### 2.2 Add Setup Landing Component

**Create `src/components/landing/Setup.tsx`:**
```tsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import Code from '../svgs/Code';
import Gear from '../svgs/Gear';
import { Card } from '../ui/card';

const setup = [
  {
    name: 'Gears Used',
    description: 'Productivity Tools, Gears I use to get my work done.',
    icon: <Gear className="size-4" />,
    href: '/gears',
  },
  {
    name: 'VS Code Setup',
    description: 'VS Code Setup I use daily.',
    icon: <Code className="size-4" />,
    href: '/setup',
  },
];

export default function Setup() {
  return (
    <Container className="mt-10">
      <SectionHeading subHeading="Development" heading="Setup" />
      <div className="mt-8 flex flex-col gap-4">
        {setup.map((item) => (
          <Link className="group" href={item.href} key={item.name}>
            <Card className="flex flex-row items-center justify-between gap-4 px-4 py-2">
              <div className="bg-muted flex items-center justify-center rounded-md p-2">
                {item.icon}
              </div>
              <div className="flex w-full flex-col">
                <h3 className="text-base font-semibold">{item.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="hidden size-4 transition-all duration-300 group-hover:block" />
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
```

**Update `src/app/page.tsx`:**
```tsx
import Setup from '@/components/landing/Setup';  // Add this import

export default function page() {
  return (
    <Container className="min-h-screen py-16">
      <Hero />
      <Experience />
      <Work />
      <About />
      <Github />
      <Blog />
      <CTA />
      <Setup />  {/* Add this line */}
      <Journey />
    </Container>
  );
}
```

✅ **Test:** Check homepage for Setup section

---

### 2.3 Add GitHub Actions Workflow

**Create `.github/workflows/lint.yml`:**
```yaml
name: Build Succeeds on PR

on:
  pull_request:
    branches:
      - main

jobs:
  build:
    name: Build on project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - name: Install dependencies
        run: bun install
      - name: Lint the project
        run: bun run lint
      - name: Build the project
        run: bun run build
      - name: Check formatting
        run: bunx prettier --check "**/*.{js,jsx,ts,tsx,json,md}"
```

✅ **Test:** Create a PR to see it run

---

## 📋 PHASE 3: DOCUMENTATION (15 minutes)

### 3.1 Add CONTRIBUTING.md

**Create `CONTRIBUTING.md`:**
```markdown
# Contributing to Portfolio

Thank you for your interest in contributing!

## Development Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Copy `.env.example` to `.env.local`
4. Run development server: `bun dev`

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Run `bun run lint` before committing
- Format code with `bun run format`

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a PR with clear description

Thank you! 🎉
```

---

## ✅ VERIFICATION CHECKLIST

After implementation, verify:

- [ ] Smooth scrolling works
- [ ] Pre-commit hook runs on commit
- [ ] `bun run test-telegram` works
- [ ] `bun run knip` runs successfully
- [ ] `/gears` page displays correctly
- [ ] Setup section appears on homepage
- [ ] GitHub Actions workflow file exists
- [ ] All tests pass
- [ ] Build succeeds: `bun run build`

---

## 🎉 DONE!

You've successfully implemented all missing features!

**Next Steps:**
1. Customize the Gears page with your actual equipment
2. Test all new features
3. Commit your changes
4. Deploy to production

**Questions?** Check the DEEP_COMPARISON_ANALYSIS.md for more details.
