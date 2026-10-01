"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Brain,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Globe2,
  GraduationCap,
  Landmark,
  LibraryBig,
  LinkIcon,
  ShieldCheck,
  UserCheck,
  UsersRound,
  X,
} from "lucide-react";

const features = [
  {
    title: "Verify Lessons",
    description: "Review every lesson with clear trust signals before use.",
    icon: BadgeCheck,
    hint: "On this page",
  },
  {
    title: "Trusted Sources",
    description: "Surface credible references and explain the source of each lesson.",
    icon: BookOpen,
    hint: "Opens a modal",
  },
  {
    title: "Privacy & Safety",
    description: "Protect learner data with safety-first controls built for responsible AI use.",
    icon: ShieldCheck,
    href: "/privacy",
  },
  {
    title: "Community Guidelines",
    description: "Set clear expectations for respectful participation in the community.",
    icon: UsersRound,
    href: "/community-guidelines",
  },
  {
    title: "Accessibility",
    description: "Support inclusive learning with accessibility-first design and usability features.",
    icon: Accessibility,
    href: "/accessibility",
  },
  {
    title: "Impact Dashboard",
    description: "Track educational reach, learning outcomes, and community engagement metrics.",
    icon: BarChart3,
    href: "/impact",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const sourceItems = [
  {
    name: "UNESCO",
    title: "Media and Information Literacy",
    badge: "International",
    description: "UNESCO’s official Media and Information Literacy resources and global standards.",
    icon: Globe2,
    href: "https://www.unesco.org/en/media-information-literacy",
    buttonLabel: "Visit UNESCO",
  },
  {
    name: "NCERT",
    title: "NCERT Digital Textbooks",
    badge: "Government",
    description: "India’s official school curriculum and digital textbook platform.",
    icon: BookOpen,
    href: "https://ncert.nic.in/",
    buttonLabel: "Visit NCERT",
  },
  {
    name: "Government of India",
    title: "National Education Resources",
    badge: "Government",
    description: "Official education information and national learning resources from India.",
    icon: Landmark,
    href: "https://www.education.gov.in/",
    buttonLabel: "Visit Website",
  },
  {
    name: "OECD",
    title: "Artificial Intelligence",
    badge: "International",
    description: "OECD’s official artificial intelligence resource and policy hub.",
    icon: LibraryBig,
    href: "https://oecd.ai/",
    buttonLabel: "Visit Source",
  },
];

const transparencyItems = [
  {
    title: "AI Generated",
    description: "This lesson was initially generated using AI for accessibility and multilingual learning.",
    icon: Brain,
  },
  {
    title: "Human Reviewed",
    description: "Educational reviewers can validate AI-generated content for quality and accuracy.",
    icon: UserCheck,
  },
  {
    title: "Source Verified",
    description: "References are linked to trusted organizations such as UNESCO, NCERT, and official government sources.",
    icon: ShieldCheck,
  },
];

const verificationTimeline = [
  {
    title: "AI Generated",
    timestamp: "08:00 UTC",
    icon: Brain,
  },
  {
    title: "Human Review Completed",
    timestamp: "10:15 UTC",
    icon: UserCheck,
  },
  {
    title: "Sources Verified",
    timestamp: "10:42 UTC",
    icon: ShieldCheck,
  },
  {
    title: "Last Updated",
    timestamp: "Today",
    icon: CheckCircle2,
  },
];

export default function TrustCenter() {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isSourcesLoading, setIsSourcesLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isSourcesModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSourcesModalOpen]);

  useEffect(() => {
    if (!isSourcesModalOpen) {
      return;
    }

    setIsSourcesLoading(true);
    const timer = window.setTimeout(() => {
      setIsSourcesLoading(false);
      closeButtonRef.current?.focus();
    }, 220);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSourcesModalOpen]);

  useEffect(() => {
    if (!isSourcesModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSourcesModalOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const focusableList = Array.from(focusableElements).filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
      );

      if (focusableList.length === 0) {
        return;
      }

      const firstElement = focusableList[0];
      const lastElement = focusableList[focusableList.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSourcesModalOpen]);

  const sourceSkeletons = useMemo(
    () => Array.from({ length: 4 }, (_, index) => index),
    []
  );

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92))]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-white/10" />

        <motion.div
          className="grid w-full gap-8 lg:grid-cols-12 lg:items-center lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center lg:pr-2">
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 shadow-sm shadow-cyan-500/10">
              Trust, transparency, and learner safety
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              EduVision Trust Center
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              EduVision promotes trusted AI-powered education aligned with UNESCO Media & Information Literacy (MIL).
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="lg:col-span-5 flex h-full min-h-[220px] rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10"
            aria-label="Responsible AI learning summary"
          >
            <div className="flex w-full flex-col justify-between rounded-2xl border border-cyan-400/15 bg-slate-900/70 p-5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200/80">
                Responsible AI learning
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Built to support educators with clarity, safety, and reliable learning experiences.
              </p>
            </div>
          </motion.div>

          <motion.section
            variants={itemVariants}
            whileInView="show"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Verified for Educational Use
                </span>
                <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
                  Verify This Lesson
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  This lesson has been checked against trusted educational and cultural references.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                    <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                    AI Generated
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Confidence: 96%
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Updated: Aug 9, 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                    <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    4 Verified Sources
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                    Educational Quality
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-200">
                    <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                    UNESCO MIL
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex h-full min-h-[320px] flex-col justify-between gap-4 rounded-3xl border border-cyan-400/15 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 transition-colors hover:border-cyan-300/25 hover:shadow-cyan-500/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                      Trust summary
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      96%
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300"
                    type="button"
                    onClick={() => setIsSourcesModalOpen(true)}
                    aria-label="Open trusted sources modal"
                  >
                    View Sources
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  {[
                    { label: "Last Reviewed", value: "Aug 9, 2026" },
                    { label: "Review Type", value: "AI + Human" },
                    { label: "Status", value: "Verified" },
                    { label: "Use", value: "Educational" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm shadow-slate-950/20"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {transparencyItems.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.article
                    key={item.title}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex h-full min-h-[180px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-sm transition-colors hover:border-cyan-300/20 hover:bg-slate-900/85 hover:shadow-cyan-500/10"
                    aria-label={item.title}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
              EduVision promotes responsible AI use by combining artificial intelligence with Media & Information Literacy (MIL) principles.
            </p>
          </motion.section>

          <motion.section
            variants={itemVariants}
            whileInView="show"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-7 lg:p-8"
            aria-labelledby="verification-timeline-title"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  Verification flow
                </p>
                <h2 id="verification-timeline-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Verification Timeline
                </h2>
              </div>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-4"
              variants={containerVariants}
            >
              {verificationTimeline.map((step) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex h-full min-h-[170px] flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-sm transition-colors hover:border-cyan-300/20 hover:shadow-cyan-500/10"
                    aria-label={step.title}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent md:block" />
                    </div>

                    <div className="mt-5 flex h-full flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {step.title === "AI Generated" && "Initial content generation completed."}
                          {step.title === "Human Review Completed" && "A reviewer validated the lesson for clarity and accuracy."}
                          {step.title === "Sources Verified" && "Official references were checked against trusted sources."}
                          {step.title === "Last Updated" && "The verification record was refreshed for the latest review."}
                        </p>
                      </div>

                      <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200/70">
                        {step.timestamp}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>
        </motion.div>

        {isSourcesModalOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex h-dvh w-dvw items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setIsSourcesModalOpen(false)}
            aria-label="Trusted educational sources modal backdrop"
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="trusted-sources-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-[900px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40"
              onMouseDown={(event) => event.stopPropagation()}
              tabIndex={-1}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                    Verified references
                  </p>
                  <h3 id="trusted-sources-title" className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Trusted Educational Sources
                  </h3>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsSourcesModalOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="max-h-[80vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {isSourcesLoading
                    ? sourceSkeletons.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20"
                          aria-label="Loading source card"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-4">
                              <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-800/80" />
                              <div className="min-w-0 space-y-3">
                                <div className="h-4 w-28 animate-pulse rounded bg-slate-800/80" />
                                <div className="h-3 w-36 animate-pulse rounded bg-slate-800/80" />
                                <div className="h-3 w-52 animate-pulse rounded bg-slate-800/80" />
                              </div>
                            </div>
                            <div className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-slate-800/80" />
                          </div>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="h-4 w-32 animate-pulse rounded bg-slate-800/80" />
                            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-800/80" />
                          </div>
                        </div>
                      ))
                    : sourceItems.map((source) => {
                    const Icon = source.icon;

                    return (
                      <article
                        key={source.name}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:border-cyan-300/25 hover:shadow-cyan-500/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                              <Icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-lg font-semibold text-white">
                                {source.name}
                              </h4>
                              <p className="mt-1 text-sm font-medium text-cyan-200">
                                {source.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">
                                {source.description}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {source.badge}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            External reference
                          </div>

                          <motion.a
                            href={source.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-900"
                            aria-label={`${source.buttonLabel} in a new tab`}
                          >
                            {source.buttonLabel}
                          </motion.a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </section>
    </main>
  );
}
