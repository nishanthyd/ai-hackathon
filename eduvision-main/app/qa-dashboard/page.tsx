"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Bug,
  CheckCircle2,
  CircleAlert,
  Gauge,
  MonitorCheck,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
  TimerReset,
  UsersRound,
  WandSparkles,
  Workflow,
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

const qaStats = [
  {
    title: "Total Tests",
    value: 128,
    progress: 100,
    icon: TestTubeDiagonal,
  },
  {
    title: "Tests Passed",
    value: 116,
    progress: 91,
    icon: BadgeCheck,
  },
  {
    title: "Tests Failed",
    value: 12,
    progress: 9,
    icon: CircleAlert,
  },
  {
    title: "Accessibility Score",
    value: 94,
    suffix: "%",
    progress: 94,
    icon: Sparkles,
  },
  {
    title: "MIL Compliance",
    value: 97,
    suffix: "%",
    progress: 97,
    icon: ShieldCheck,
  },
  {
    title: "Performance Score",
    value: 92,
    suffix: "%",
    progress: 92,
    icon: Gauge,
  },
];

const testingCategories = [
  {
    title: "Functional Testing",
    status: "Passed",
    completion: 96,
    description:
      "Core learning flows, navigation, and trust-center interactions are behaving as expected.",
    icon: Workflow,
  },
  {
    title: "UI Testing",
    status: "In Progress",
    completion: 84,
    description:
      "Visual consistency, spacing, and premium component behavior are being reviewed across pages.",
    icon: MonitorCheck,
  },
  {
    title: "Accessibility Testing",
    status: "Passed",
    completion: 94,
    description:
      "Keyboard flow, focus visibility, semantic structure, and readability checks are in place.",
    icon: Sparkles,
  },
  {
    title: "Security Testing",
    status: "In Progress",
    completion: 78,
    description:
      "Privacy-first behaviors, route safety, and responsible data handling checks are under review.",
    icon: ShieldCheck,
  },
  {
    title: "Performance Testing",
    status: "Passed",
    completion: 92,
    description:
      "Build integrity, component responsiveness, and route performance meet current QA expectations.",
    icon: TimerReset,
  },
  {
    title: "Cross-browser Testing",
    status: "Failed",
    completion: 68,
    description:
      "Additional fixes are needed for full consistency across multiple browsers and device profiles.",
    icon: MonitorSmartphone,
  },
];

const bugItems = [
  {
    id: "QA-101",
    issue: "Feature card alignment shifts on narrow tablet widths",
    priority: "Medium",
    status: "Open",
    assignedTo: "Harshitha",
  },
  {
    id: "QA-102",
    issue: "Cross-browser spacing mismatch in dark hero sections",
    priority: "High",
    status: "In Progress",
    assignedTo: "UI Team",
  },
  {
    id: "QA-103",
    issue: "Missing reduced-motion optimization on animated dashboard cards",
    priority: "Low",
    status: "Open",
    assignedTo: "Frontend",
  },
  {
    id: "QA-104",
    issue: "Legacy warning copy needs final documentation review",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Documentation",
  },
  {
    id: "QA-105",
    issue: "VoiceOver label consistency check for modal controls",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Accessibility",
  },
];

const complianceItems = [
  "Verify This Lesson",
  "Trusted Sources",
  "AI Disclaimer",
  "Privacy Policy",
  "Community Guidelines",
  "Accessibility",
  "Source Validation",
];

const filters = ["All", "Open", "In Progress", "Resolved"] as const;

function getStatusClasses(status: string) {
  if (status === "Passed" || status === "Resolved") {
    return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "In Progress") {
    return "border border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border border-rose-400/20 bg-rose-400/10 text-rose-200";
}

export default function QaDashboardPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredBugs = useMemo(() => {
    if (activeFilter === "All") {
      return bugItems;
    }

    return bugItems.filter((bug) => bug.status === activeFilter);
  }, [activeFilter]);

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
              Quality, reliability, and MIL assurance
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quality Assurance Dashboard
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Monitoring testing, reliability, accessibility, and UNESCO MIL
              compliance.
            </p>
          </motion.div>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="qa-overview-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                QA overview
              </p>
              <h2
                id="qa-overview-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Testing health at a glance
              </h2>
            </div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              variants={sectionVariants}
            >
              {qaStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <motion.article
                    key={stat.title}
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
                      <div className="text-right">
                        <motion.p
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="text-3xl font-semibold text-white"
                        >
                          {stat.value}
                          {stat.suffix ?? ""}
                        </motion.p>
                      </div>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {stat.title}
                    </h3>

                    <div className="mt-5">
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-300">
                        Progress indicator: {stat.progress}%
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
            aria-labelledby="testing-categories-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Testing categories
              </p>
              <h2
                id="testing-categories-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Coverage across quality areas
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              variants={sectionVariants}
            >
              {testingCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <motion.article
                    key={category.title}
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
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          category.status
                        )}`}
                      >
                        {category.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {category.description}
                    </p>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Completion</span>
                        <span>{category.completion}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.completion}%` }}
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
            aria-labelledby="bug-tracker-title"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  Bug tracker
                </p>
                <h2
                  id="bug-tracker-title"
                  className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
                >
                  Active issue tracking
                </h2>
              </div>

              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Bug status filters"
              >
                {filters.map((filter) => {
                  const isActive = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                        isActive
                          ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                          : "border border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-300/25 hover:bg-slate-800"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr className="text-sm text-slate-300">
                      <th className="px-4 py-4 font-medium">Bug ID</th>
                      <th className="px-4 py-4 font-medium">Issue</th>
                      <th className="px-4 py-4 font-medium">Priority</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 font-medium">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBugs.map((bug) => (
                      <tr
                        key={bug.id}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-white">
                          {bug.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {bug.issue}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {bug.priority}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              bug.status
                            )}`}
                          >
                            {bug.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          {bug.assignedTo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="mil-compliance-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                UNESCO MIL compliance
              </p>
              <h2
                id="mil-compliance-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Verified platform trust checklist
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {complianceItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[76px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{item}</p>
                </div>
              ))}
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
                href="/impact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Previous to Impact Dashboard"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous: Impact
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Back to Trust Center"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Trust Center
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </main>
  );
}
