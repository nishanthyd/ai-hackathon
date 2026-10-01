"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  ChartNoAxesColumn,
  Globe2,
  GraduationCap,
  Languages,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
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

const impactMetrics = [
  { title: "Videos Generated", value: 428, icon: ChartNoAxesColumn, progress: 82 },
  { title: "Students Reached", value: 12450, icon: UsersRound, progress: 89 },
  { title: "Quiz Completion Rate", value: 91, suffix: "%", icon: BadgeCheck, progress: 91 },
  { title: "Verified Lessons", value: 312, icon: ShieldCheck, progress: 86 },
  { title: "Languages Supported", value: 14, icon: Languages, progress: 70 },
  { title: "Community Posts", value: 968, icon: MessagesSquare, progress: 78 },
  { title: "Source Verification Rate", value: 97, suffix: "%", icon: Sparkles, progress: 97 },
  { title: "Cultural Topics Covered", value: 63, icon: Globe2, progress: 74 },
];

const analyticsCards = [
  {
    title: "Learning Engagement",
    description:
      "Learners continue interacting with trusted lessons, quizzes, and verification prompts across core journeys.",
    value: "88%",
    progress: 88,
    icon: GraduationCap,
  },
  {
    title: "Language Distribution",
    description:
      "Content reach is expanding across multilingual audiences to improve equitable access to learning materials.",
    value: "76%",
    progress: 76,
    icon: Languages,
  },
  {
    title: "Verification Success Rate",
    description:
      "Lesson validation and source transparency continue to support high-confidence educational usage.",
    value: "97%",
    progress: 97,
    icon: ShieldCheck,
  },
  {
    title: "Community Activity",
    description:
      "Participation in discussions, learning prompts, and knowledge-sharing reflects healthy engagement growth.",
    value: "81%",
    progress: 81,
    icon: MessagesSquare,
  },
];

const milImpactCards = [
  {
    title: "Critical Thinking",
    description:
      "Learners are encouraged to question, evaluate, and reflect on the credibility of digital information.",
    impact: 93,
    icon: Brain,
  },
  {
    title: "Digital Literacy",
    description:
      "EduVision supports safer and more informed participation in digital learning environments.",
    impact: 95,
    icon: Sparkles,
  },
  {
    title: "Cultural Preservation",
    description:
      "Educational content helps surface local histories, languages, and diverse cultural perspectives.",
    impact: 87,
    icon: Globe2,
  },
  {
    title: "Responsible Information Sharing",
    description:
      "Verification reminders and trusted sources promote more careful sharing of educational content.",
    impact: 96,
    icon: ShieldCheck,
  },
];

const sdgCards = [
  {
    title: "SDG 4: Quality Education",
    description:
      "EduVision broadens access to trusted, inclusive, and multilingual educational content for more learners.",
    icon: BookOpen,
  },
  {
    title: "SDG 10: Reduced Inequalities",
    description:
      "Accessible design and multilingual delivery help reduce barriers to digital learning participation.",
    icon: UsersRound,
  },
  {
    title: "SDG 16: Peace, Justice & Strong Institutions",
    description:
      "Media and Information Literacy principles support trustworthy knowledge-sharing and responsible digital citizenship.",
    icon: Target,
  },
];

export default function ImpactPage() {
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
          <motion.div
            variants={itemVariants}
            className="lg:col-span-12 flex flex-col items-start"
          >
            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 shadow-sm shadow-cyan-500/10">
              Reach, learning outcomes, and community impact
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              EduVision Impact Dashboard
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Measuring educational reach, Media & Information Literacy, and
              community engagement.
            </p>
          </motion.div>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="impact-overview-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Impact overview
              </p>
              <h2
                id="impact-overview-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Key education metrics
              </h2>
            </div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              variants={sectionVariants}
            >
              {impactMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <motion.article
                    key={metric.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    tabIndex={0}
                    className="flex h-full min-h-[220px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 outline-none transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10 focus-visible:border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <motion.p
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="text-3xl font-semibold text-white"
                      >
                        {metric.value}
                        {metric.suffix ?? ""}
                      </motion.p>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {metric.title}
                    </h3>
                    <div className="mt-5">
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-300">
                        Progress indicator: {metric.progress}%
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="analytics-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Analytics section
              </p>
              <h2
                id="analytics-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Dashboard insights
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              variants={sectionVariants}
            >
              {analyticsCards.map((card) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    tabIndex={0}
                    className="flex h-full min-h-[240px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 outline-none transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10 focus-visible:border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {card.value}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Progress</span>
                        <span>{card.progress}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${card.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
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
            aria-labelledby="mil-impact-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                UNESCO MIL impact
              </p>
              <h2
                id="mil-impact-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Literacy outcomes supported by EduVision
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              variants={sectionVariants}
            >
              {milImpactCards.map((card) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    tabIndex={0}
                    className="flex h-full min-h-[230px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 outline-none transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10 focus-visible:border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {card.impact}%
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="sdg-alignment-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                SDG alignment
              </p>
              <h2
                id="sdg-alignment-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Sustainable development contribution
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-3"
              variants={sectionVariants}
            >
              {sdgCards.map((card) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    tabIndex={0}
                    className="flex h-full min-h-[220px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 outline-none transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10 focus-visible:border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {card.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
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
                Return to the Trust Center for platform trust, verification,
                and learner safety details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Link
                href="/accessibility"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Previous to Accessibility"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous: Accessibility
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
                href="/qa-dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Next to QA Dashboard"
              >
                Next: QA Dashboard
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </main>
  );
}
