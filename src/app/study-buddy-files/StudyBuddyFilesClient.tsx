"use client";

import Container from "@/components/common/Container";
import Github from "@/components/svgs/Github";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  Globe,
  MonitorDown,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

/**
 * Both native builds are hosted on GitHub. Point these at the files page for
 * now — once the binaries are uploaded, swap them for direct release-asset
 * URLs, e.g.
 *   https://github.com/satyamsingh5512/StudyBuddy/releases/download/v1.0.0/studybuddy_1.0.0_amd64.deb
 *   https://github.com/satyamsingh5512/StudyBuddy/releases/download/v1.0.0/studybuddy_1.0.0.apk
 */
const GITHUB_FILES_URL =
  "https://github.com/satyamsingh5512/StudyBuddy/files";
const LINUX_DEB_URL = GITHUB_FILES_URL;
const ANDROID_APK_URL = GITHUB_FILES_URL;
const GITHUB_REPO_URL = "https://github.com/satyamsingh5512/StudyBuddy";
const WEB_APP_URL = "https://sbd.satym.in";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const linuxSteps = [
  {
    title: "Grab the .deb",
    body: "Hit the Linux download button — you'll land on the StudyBuddy files page on GitHub where the .deb lives.",
  },
  {
    title: "Install it",
    body: "Run the package with your installer, or from a terminal.",
    code: "sudo dpkg -i studybuddy_*.deb && sudo apt-get install -f",
  },
  {
    title: "Launch & focus",
    body: "Open StudyBuddy from your app grid and sign in — timers, tasks and streaks sync with the web app.",
  },
];

const androidSteps = [
  {
    title: "Grab the .apk",
    body: "Hit the Android download button — you'll land on the StudyBuddy files page on GitHub where the .apk lives.",
  },
  {
    title: "Allow the install",
    body: "Open the downloaded file and allow “Install unknown apps” for your browser when Android asks.",
  },
  {
    title: "Open & study",
    body: "Launch StudyBuddy, sign in, and your schedule, timer history and leaderboard carry over.",
  },
];

function Orb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ""}`}
    />
  );
}

function PlatformCard({
  index,
  eyebrow,
  fileType,
  title,
  description,
  href,
  accent,
  meta,
  icon,
  cta,
}: {
  index: number;
  eyebrow: string;
  fileType: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  meta: { label: string; value: string }[];
  icon: React.ReactNode;
  cta: string;
}) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      custom={index}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-card/80 p-6 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 dark:border-white/10"
    >
      {/* hover glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-24 right-[-15%] size-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25 ${accent}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-13 items-center justify-center rounded-2xl border border-black/10 bg-muted/70 p-3 dark:border-white/10">
          {icon}
        </div>
        <span className="rounded-full border border-black/10 bg-muted/60 px-3 py-1 font-mono text-xs font-semibold tracking-wide dark:border-white/10">
          {fileType}
        </span>
      </div>

      <p className="text-muted-foreground mt-6 text-xs font-semibold tracking-[0.22em] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-[0.95rem]">
        {description}
      </p>

      <dl className="mt-6 space-y-2.5 border-t border-black/10 pt-5 text-sm dark:border-white/10">
        {meta.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-col gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${cta} — opens the StudyBuddy files page on GitHub`}
          className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
        >
          <Download className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
          {cta}
          <ArrowUpRight className="size-4 opacity-70" />
        </a>
        <a
          href={GITHUB_FILES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground inline-flex items-center justify-center gap-1.5 text-xs font-medium transition-colors hover:text-foreground"
        >
          <Github className="size-3.5" />
          Browse all files on GitHub
          <ExternalLink className="size-3" />
        </a>
      </div>
    </motion.article>
  );
}

export default function StudyBuddyFilesClient() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative overflow-x-clip">
      {/* ── ambient background ─────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(120,120,255,0.14),transparent_70%)] dark:bg-[radial-gradient(60%_45%_at_50%_0%,rgba(140,140,255,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(127,127,127,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.09)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(70%_55%_at_50%_0%,black_35%,transparent_100%)]" />
        <Orb className="top-[-6rem] left-[8%] size-72 bg-violet-500/25 dark:bg-violet-500/20" />
        <Orb className="top-[10rem] right-[4%] size-80 bg-sky-500/20 dark:bg-sky-400/10" />
        <Orb className="top-[38rem] left-[-6rem] size-96 bg-fuchsia-500/10" />
      </div>

      <Container as="div" className="pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* ── hero ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mx-auto max-w-3xl text-center"
        >
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-muted/60 py-1.5 pr-4 pl-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-muted dark:border-white/10"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
              <Sparkles className="size-3" />
              New
            </span>
            StudyBuddy native builds are here
            <ArrowRight className="size-3.5 opacity-60" />
          </a>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            StudyBuddy,
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              on every device you own.
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-balance sm:text-lg">
            Timers, tasks, streaks and the leaderboard — now as native apps.
            Pick your platform below and you&apos;ll be taken to the
            StudyBuddy files page on GitHub where the installers live.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#downloads"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99] sm:w-auto"
            >
              <FileDown className="size-4" />
              Get the apps
            </a>
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-card/70 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto dark:border-white/10"
            >
              <Globe className="size-4" />
              Use the web app instead
            </a>
          </div>

          {/* stats */}
          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              { k: "Platforms", v: "Linux + Android" },
              { k: "Delivery", v: "via GitHub" },
              { k: "Sync", v: "Web ↔ App" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 1}
                className="rounded-2xl border border-black/10 bg-card/60 px-3 py-4 backdrop-blur dark:border-white/10"
              >
                <dt className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  {s.k}
                </dt>
                <dd className="mt-1 text-sm font-bold sm:text-base">{s.v}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* ── download cards ───────────────────────────────── */}
        <div
          id="downloads"
          className="mt-14 grid scroll-mt-24 gap-5 sm:mt-20 md:grid-cols-2"
        >
          <PlatformCard
            index={0}
            eyebrow="For Linux desktops"
            fileType=".deb"
            title="StudyBuddy for Linux"
            description="Debian package for Ubuntu, Debian, Pop!_OS, Mint and derivatives. Installs like any native app and stays in your launcher."
            href={LINUX_DEB_URL}
            accent="bg-violet-500"
            cta="Download .deb from GitHub"
            icon={<MonitorDown className="size-6" />}
            meta={[
              { label: "Format", value: "Debian (.deb)" },
              { label: "Arch", value: "x86_64 (amd64)" },
              { label: "Needs", value: "Ubuntu 22.04+ / Debian 12+" },
            ]}
          />
          <PlatformCard
            index={1}
            eyebrow="For Android phones"
            fileType=".apk"
            title="StudyBuddy for Android"
            description="Sideload-ready Android build with the full focus timer, tasks and social feed — perfect for studying away from your desk."
            href={ANDROID_APK_URL}
            accent="bg-emerald-500"
            cta="Download .apk from GitHub"
            icon={<Smartphone className="size-6" />}
            meta={[
              { label: "Format", value: "Android (.apk)" },
              { label: "Needs", value: "Android 9.0+" },
              { label: "Install", value: "Sideload via file manager" },
            ]}
          />
        </div>

        {/* ── hosting note ─────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          custom={0}
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-black/15 bg-muted/40 p-5 text-sm sm:flex-row sm:items-center dark:border-white/15"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-card dark:border-white/10">
            <Github className="size-5" />
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Both buttons redirect to{" "}
            <a
              href={GITHUB_FILES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline decoration-dotted underline-offset-4 hover:decoration-solid"
            >
              github.com/satyamsingh5512/StudyBuddy/files
            </a>{" "}
            — that&apos;s where the .deb and .apk are published for their
            respective devices. New builds appear there first.
          </p>
        </motion.div>

        {/* ── install guides ───────────────────────────────── */}
        <div className="mt-14 grid gap-5 sm:mt-20 md:grid-cols-2">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={0}
            aria-labelledby="linux-install"
            className="rounded-3xl border border-black/10 bg-card/70 p-6 backdrop-blur sm:p-8 dark:border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-black/10 bg-muted/70 dark:border-white/10">
                <Terminal className="size-5" />
              </div>
              <div>
                <h2 id="linux-install" className="text-lg font-bold">
                  Install on Linux
                </h2>
                <p className="text-muted-foreground text-xs">
                  Three steps, under a minute
                </p>
              </div>
            </div>
            <ol className="mt-6 space-y-5">
              {linuxSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.body}
                    </p>
                    {step.code && (
                      <code className="mt-2 block overflow-x-auto rounded-xl border border-black/10 bg-muted/70 px-3 py-2.5 font-mono text-xs break-all dark:border-white/10">
                        {step.code}
                      </code>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={1}
            aria-labelledby="android-install"
            className="rounded-3xl border border-black/10 bg-card/70 p-6 backdrop-blur sm:p-8 dark:border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-black/10 bg-muted/70 dark:border-white/10">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h2 id="android-install" className="text-lg font-bold">
                  Install on Android
                </h2>
                <p className="text-muted-foreground text-xs">
                  Sideload in three taps
                </p>
              </div>
            </div>
            <ol className="mt-6 space-y-5">
              {androidSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-black/10 bg-muted/50 p-4 text-xs leading-relaxed dark:border-white/10">
              <ShieldCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <p className="text-muted-foreground">
                Android will warn you because the app is sideloaded outside
                the Play Store — that&apos;s expected. The .apk comes straight
                from the official StudyBuddy GitHub repo.
              </p>
            </div>
          </motion.section>
        </div>

        {/* ── feature strip ────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          custom={0}
          className="mt-6 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: <Zap className="size-4" />,
              title: "Stays in sync",
              body: "Sign in once — tasks, timer history and points follow you across web, Linux and Android.",
            },
            {
              icon: <ShieldCheck className="size-4" />,
              title: "Straight from source",
              body: "Every installer is published on the public StudyBuddy GitHub repo. No mirrors, no repacks.",
            },
            {
              icon: <CheckCircle2 className="size-4" />,
              title: "Free forever",
              body: "Both native builds are free. If a download hasn't appeared yet, check back — uploads land here first.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-black/10 bg-card/60 p-5 backdrop-blur dark:border-white/10"
            >
              <div className="text-muted-foreground flex size-9 items-center justify-center rounded-xl border border-black/10 bg-muted/60 dark:border-white/10">
                {f.icon}
              </div>
              <h3 className="mt-3 text-sm font-bold">{f.title}</h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── missing build / footer CTA ───────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          custom={0}
          aria-labelledby="stay-updated"
          className="relative mt-6 overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-600 p-8 text-center text-white sm:p-12 dark:border-white/10"
        >
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="relative">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <BellRing className="size-6" />
            </div>
            <h2 id="stay-updated" className="mt-4 text-2xl font-bold sm:text-3xl">
              Don&apos;t see your file yet?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Builds are uploaded to the GitHub files page as they ship. Watch
              the repo or star it to get notified the moment the .deb and .apk
              drop.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.99]"
              >
                <Github className="size-4" />
                Star / Watch on GitHub
              </a>
              <a
                href={WEB_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
              >
                Open web app
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </motion.section>
      </Container>
    </main>
  );
}
