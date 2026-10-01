"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Brain,
  ClipboardCheck,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ServerCog,
  ShieldCheck,
  Trash2,
  UserCheck,
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

const overviewCards = [
  {
    title: "Data Protection",
    description:
      "Learner data is collected minimally, stored carefully, and used only to support trusted educational experiences.",
    icon: LockKeyhole,
    badge: "Protected",
  },
  {
    title: "Student Safety",
    description:
      "Platform safeguards, moderation standards, and privacy-first defaults help keep learning spaces safer.",
    icon: ShieldCheck,
    badge: "Moderated",
  },
  {
    title: "AI Transparency",
    description:
      "AI assistance is clearly framed, monitored responsibly, and designed to support—not replace—human judgment.",
    icon: Brain,
    badge: "Responsible",
  },
  {
    title: "User Rights",
    description:
      "Users can review, update, export, or request deletion of eligible data through clear support channels.",
    icon: UserCheck,
    badge: "Accessible",
  },
];

const policySections = [
  {
    title: "Information We Collect",
    description:
      "We may collect account details, learning activity, device information, and support messages needed to operate EduVision effectively.",
    icon: Database,
  },
  {
    title: "How We Use Your Data",
    description:
      "Your data helps us deliver learning experiences, improve reliability, personalize features, and maintain a safe educational environment.",
    icon: ClipboardCheck,
  },
  {
    title: "Student Safety Policy",
    description:
      "We prioritize learner wellbeing through community standards, moderation workflows, and safer defaults for educational participation.",
    icon: UsersRound,
  },
  {
    title: "AI Usage Policy",
    description:
      "AI-generated support is used to assist learning, but users are encouraged to verify important information with trusted educational sources.",
    icon: Brain,
  },
  {
    title: "Content Ownership",
    description:
      "Users keep ownership of their original submissions while granting EduVision the limited rights needed to provide platform functionality.",
    icon: FileText,
  },
  {
    title: "Data Security",
    description:
      "We use access controls, secure infrastructure, and platform monitoring practices to reduce risk and protect stored information.",
    icon: ServerCog,
  },
  {
    title: "User Rights",
    description:
      "Users may request access, correction, export, or removal of eligible personal information through appropriate support channels.",
    icon: UserCheck,
  },
  {
    title: "Account Deletion",
    description:
      "Account deletion requests are handled carefully so users can remove their presence and associated records where applicable.",
    icon: Trash2,
  },
  {
    title: "Contact & Support",
    description:
      "Questions about privacy, safety, or data handling can be directed to the EduVision support contact for review and follow-up.",
    icon: Mail,
  },
];

export default function PrivacyPage() {
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
              Privacy, protection, and responsible learning
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Privacy & Safety
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Protecting learners, their data, and their educational
              experience.
            </p>
          </motion.div>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="privacy-overview-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Privacy overview
              </p>
              <h2
                id="privacy-overview-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Summary at a glance
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
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {card.badge}
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
            className="lg:col-span-12 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="privacy-trust-banner-title"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25">
                <BadgeInfo className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                  Trust banner
                </p>
                <h2
                  id="privacy-trust-banner-title"
                  className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
                >
                  Our commitment
                </h2>
                <p className="mt-4 max-w-4xl text-base leading-7 text-cyan-50/95">
                  EduVision never sells student data. Educational information is
                  protected and handled responsibly in accordance with Media &
                  Information Literacy principles.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="privacy-policies-title"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                Policies and standards
              </p>
              <h2
                id="privacy-policies-title"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                Privacy & safety details
              </h2>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              variants={sectionVariants}
            >
              {policySections.map((section) => {
                const Icon = section.icon;

                return (
                  <motion.article
                    key={section.title}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    tabIndex={0}
                    className="flex h-full min-h-[230px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 outline-none transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10 focus-visible:border-cyan-300/40 focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {section.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {section.description}
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
                Return to the Trust Center for verification details and source
                transparency.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Back to Trust Center"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Trust Center
              </Link>
              <Link
                href="/community-guidelines"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                aria-label="Next to Community Guidelines"
              >
                Next: Community Guidelines
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </section>
    </main>
  );
}
