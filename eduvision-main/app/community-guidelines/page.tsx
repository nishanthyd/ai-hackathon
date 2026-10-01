"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CircleCheckBig,
  Globe2,
  HeartHandshake,
  MessageSquareWarning,
  ShieldCheck,
  UsersRound,
  UserShield,
  ScrollText,
  Scale,
  Lock,
  FlagTriangleRight,
  ClipboardCheck,
  BadgeInfo,
  BookOpen,
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const rules = [
  {
    title: "Respect Others",
    description: "Use courteous language and treat every learner with dignity.",
    icon: HeartHandshake,
  },
  {
    title: "Verify Before Sharing",
    description: "Check facts and sources before posting content to the community.",
    icon: BadgeCheck,
  },
  {
    title: "No Hate Speech",
    description: "Do not post content that targets people based on identity or background.",
    icon: ShieldCheck,
  },
  {
    title: "Educational Discussions Only",
    description: "Keep conversations focused on learning, questions, and constructive exchange.",
    icon: BookOpenCheck,
  },
  {
    title: "Cite Trusted Sources",
    description: "Reference reputable organizations, textbooks, and verified educational resources.",
    icon: ScrollText,
  },
  {
    title: "Respect Cultural Diversity",
    description: "Honor different cultures, languages, and perspectives in every discussion.",
    icon: Globe2,
  },
  {
    title: "Protect Privacy",
    description: "Never share personal, school, or sensitive information about others.",
    icon: Lock,
  },
  {
    title: "Report Misleading Content",
    description: "Flag inaccurate or harmful content so moderators can review it quickly.",
    icon: FlagTriangleRight,
  },
];

const timeline = [
  {
    step: "Step 1",
    title: "Report",
    description: "A community member reports a concern using the feedback flow.",
    icon: MessageSquareWarning,
  },
  {
    step: "Step 2",
    title: "Review",
    description: "Moderators review the report and verify the surrounding context.",
    icon: ClipboardCheck,
  },
  {
    step: "Step 3",
    title: "Moderator Decision",
    description: "The moderation team decides whether action or clarification is needed.",
    icon: Scale,
  },
  {
    step: "Step 4",
    title: "Resolution",
    description: "The issue is resolved and the reporting member receives a response.",
    icon: CircleCheckBig,
  },
];

const values = [
  {
    label: "Respect",
    value: "100%",
    description: "Positive tone and inclusive language in every interaction.",
    icon: UsersRound,
  },
  {
    label: "Trust",
    value: "Verified",
    description: "Clear moderation standards that support reliable conversations.",
    icon: BadgeInfo,
  },
  {
    label: "Learning",
    value: "Focused",
    description: "Discussions remain centered on educational goals and outcomes.",
    icon: BookOpen,
  },
  {
    label: "Safety",
    value: "Protected",
    description: "Privacy-aware and moderation-backed community behavior.",
    icon: UserShield,
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92))]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-white/10" />

        <motion.div
          className="grid gap-8 lg:grid-cols-12 lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <motion.div variants={itemVariants} className="lg:col-span-12 flex flex-col items-start justify-center">
            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 shadow-sm shadow-cyan-500/10">
              Community standards for EduVision
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Community Guidelines
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Building a respectful learning community.
            </p>
          </motion.div>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="guidelines-rules-title"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  Community rules
                </p>
                <h2 id="guidelines-rules-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Rules Grid
                </h2>
              </div>
            </div>

            <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={sectionVariants}>
              {rules.map((rule) => {
                const Icon = rule.icon;

                return (
                  <motion.article
                    key={rule.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="group flex h-full min-h-[220px] flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/30 backdrop-blur-sm transition-colors hover:border-cyan-300/30 hover:bg-white/8 hover:shadow-cyan-500/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {rule.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {rule.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="guidelines-timeline-title"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  Moderation flow
                </p>
                <h2 id="guidelines-timeline-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Reporting Process Timeline
                </h2>
              </div>
            </div>

            <motion.div className="grid gap-4 md:grid-cols-4" variants={sectionVariants}>
              {timeline.map((step) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.title}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex h-full min-h-[190px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-sm transition-colors hover:border-cyan-300/20 hover:shadow-cyan-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent md:block" />
                    </div>

                    <div className="mt-5 flex h-full flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                          {step.step}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="guidelines-values-title"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  Community metrics
                </p>
                <h2 id="guidelines-values-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Community Values
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <motion.article
                    key={value.label}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex h-full min-h-[200px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-sm transition-colors hover:border-cyan-300/20 hover:shadow-cyan-500/10"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {value.value}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {value.label}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {value.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>

          <motion.footer
            variants={itemVariants}
            className="lg:col-span-12 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:flex-row sm:items-center sm:p-7 lg:p-8"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
                Back navigation
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Return to the Trust Center for platform verification details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Previous to Privacy"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous: Privacy
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Back to Trust Center"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Trust Center
              </Link>
              <Link
                href="/accessibility"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Next to Accessibility"
              >
                Next: Accessibility
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </main>
  );
}


