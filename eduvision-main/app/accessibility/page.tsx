"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Captions,
  CheckCircle2,
  Eye,
  Keyboard,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  ScanSearch,
  Sparkles,
  Type,
  Waves,
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

const overviewCards = [
  {
    title: "Inclusive Design",
    description:
      "Layouts and interactions are designed to support diverse learner needs across devices and contexts.",
    icon: Sparkles,
  },
  {
    title: "Keyboard Navigation",
    description:
      "Core experiences are designed so learners can move through the platform without relying on a mouse.",
    icon: Keyboard,
  },
  {
    title: "Visual Accessibility",
    description:
      "Readable contrast, clear focus states, and accessible color choices help content stay understandable.",
    icon: Eye,
  },
  {
    title: "Learning Support",
    description:
      "Accessibility features support comprehension, participation, and more equitable digital learning.",
    icon: BadgeCheck,
  },
];

const accessibilityFeatures = [
  {
    title: "Keyboard Navigation",
    description:
      "Interactive elements are reachable and operable with keyboard input for more inclusive navigation.",
    icon: Keyboard,
    status: "Implemented",
  },
  {
    title: "Screen Reader Compatibility",
    description:
      "Semantic structure and meaningful labels help assistive technologies interpret page content more clearly.",
    icon: ScanSearch,
    status: "Implemented",
  },
  {
    title: "Video Captions & Subtitles",
    description:
      "Media experiences can support captioning to improve understanding for deaf and hard-of-hearing learners.",
    icon: Captions,
    status: "Planned",
  },
  {
    title: "High Contrast Support",
    description:
      "High-contrast interface decisions improve readability and reduce visual strain across learning sessions.",
    icon: Eye,
    status: "Implemented",
  },
  {
    title: "Responsive Mobile Design",
    description:
      "Layouts adapt across screen sizes so learners can access content comfortably on phones, tablets, and desktops.",
    icon: MonitorSmartphone,
    status: "Implemented",
  },
  {
    title: "Readable Typography",
    description:
      "Font sizing, spacing, and hierarchy are chosen to make educational information easier to scan and read.",
    icon: Type,
    status: "Implemented",
  },
  {
    title: "Color Accessibility",
    description:
      "Color usage is supported by structure and contrast so meaning is not communicated by color alone.",
    icon: Palette,
    status: "Implemented",
  },
  {
    title: "Reduced Motion Support",
    description:
      "Motion can be softened or limited in future enhancements to better support learners with sensitivity to animation.",
    icon: Waves,
    status: "Planned",
  },
];

const checklistItems = [
  "Keyboard accessible",
  "Mobile responsive",
  "Captions supported",
  "High contrast UI",
  "Focus indicators",
  "Semantic HTML",
  "Responsive layout",
  "Accessible buttons",
];

export default function AccessibilityPage() {
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
              Inclusion, access, and learner support
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Accessibility
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Making education inclusive and accessible for every learner.
            </p>
          </motion.div>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="accessibility-overview-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Accessibility overview
              </p>
              <h2
                id="accessibility-overview-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Inclusive access at a glance
              </h2>
            </div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              variants={sectionVariants}
            >
              {overviewCards.map((card) => {
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

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="accessibility-features-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Accessibility features
              </p>
              <h2
                id="accessibility-features-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Current support and roadmap
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              variants={sectionVariants}
            >
              {accessibilityFeatures.map((feature) => {
                const Icon = feature.icon;
                const isImplemented = feature.status === "Implemented";

                return (
                  <motion.article
                    key={feature.title}
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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isImplemented
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="accessibility-checklist-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Accessibility checklist
              </p>
              <h2
                id="accessibility-checklist-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Core accessibility signals
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {checklistItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-5 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="unesco-inclusion-title"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25">
                <MousePointerClick className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                  UNESCO inclusion statement
                </p>
                <h2
                  id="unesco-inclusion-title"
                  className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
                >
                  Equitable digital learning
                </h2>
                <p className="mt-4 text-base leading-7 text-cyan-50/95">
                  EduVision is designed to make quality education accessible to
                  all learners by following inclusive design principles and
                  supporting UNESCO&apos;s vision of equitable digital learning.
                </p>
              </div>
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
                Return to the Trust Center for platform trust, verification,
                and learner safety details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Link
                href="/community-guidelines"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Previous to Community Guidelines"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous: Community Guidelines
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
                href="/impact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Next to Impact Dashboard"
              >
                Next: Impact
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </main>
  );
}
