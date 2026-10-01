import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Accessibility,
  BadgeCheck,
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  Globe2,
  Landmark,
  LibraryBig,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { motionVariants } from '../utils/animation'
import { TRUST_CENTER_URL } from '../utils/config'

interface AboutPageProps {
  reducedMotion?: boolean
}

const features = [
  {
    title: 'Verify Lessons',
    description: 'Review every lesson with clear trust signals before use.',
    icon: BadgeCheck,
    href: TRUST_CENTER_URL,
    hint: 'Opens Trust Center',
  },
  {
    title: 'Trusted Sources',
    description: 'Surface credible references and explain the source of each lesson.',
    icon: BookOpen,
    hint: 'Opens a modal',
    isModal: true,
  },
  {
    title: 'Privacy & Safety',
    description: 'Protect learner data with safety-first controls built for responsible AI use.',
    icon: ShieldCheck,
    href: `${TRUST_CENTER_URL}/privacy`,
  },
  {
    title: 'Community Guidelines',
    description: 'Set clear expectations for respectful participation in the community.',
    icon: UsersRound,
    href: `${TRUST_CENTER_URL}/community-guidelines`,
  },
  {
    title: 'Accessibility',
    description: 'Support inclusive learning with accessibility-first design and usability features.',
    icon: Accessibility,
    href: `${TRUST_CENTER_URL}/accessibility`,
  },
  {
    title: 'Impact Dashboard',
    description: 'Track educational reach, learning outcomes, and community engagement metrics.',
    icon: BarChart3,
    href: `${TRUST_CENTER_URL}/impact`,
  },
]

const sourceItems = [
  {
    name: 'UNESCO',
    title: 'Media and Information Literacy',
    badge: 'International',
    description: 'UNESCO’s official Media and Information Literacy resources and global standards.',
    icon: Globe2,
    href: 'https://www.unesco.org/en/media-information-literacy',
    buttonLabel: 'Visit UNESCO',
  },
  {
    name: 'NCERT',
    title: 'NCERT Digital Textbooks',
    badge: 'Government',
    description: 'India’s official school curriculum and digital textbook platform.',
    icon: BookOpen,
    href: 'https://ncert.nic.in/',
    buttonLabel: 'Visit NCERT',
  },
  {
    name: 'Government of India',
    title: 'National Education Resources',
    badge: 'Government',
    description: 'Official education information and national learning resources from India.',
    icon: Landmark,
    href: 'https://www.education.gov.in/',
    buttonLabel: 'Visit Website',
  },
  {
    name: 'OECD',
    title: 'Artificial Intelligence',
    badge: 'International',
    description: 'OECD’s official artificial intelligence resource and policy hub.',
    icon: LibraryBig,
    href: 'https://oecd.ai/',
    buttonLabel: 'Visit Source',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function AboutPage({ reducedMotion }: AboutPageProps) {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* 1. About Us Hero Section */}
      <section className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-8 sm:p-10 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-accent2">About EduVision</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-textHigh sm:text-4xl lg:text-5xl">
          Empowering Global Learners Through AI & Media Literacy
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-textMid sm:text-lg">
          EduVision combines AI-powered storytelling, multilingual animation engines, and verified Media & Information Literacy (MIL) frameworks to make heritage and STEM education accessible, engaging, and trusted worldwide.
        </p>
      </section>

      {/* 2. Platform Features Section */}
      <motion.section
        variants={itemVariants}
        whileInView="show"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }}
        className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6 shadow-soft backdrop-blur-xl sm:p-8 lg:p-10"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
              Core trust signals
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Platform features
            </h2>
          </div>
        </div>

        <motion.div variants={containerVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            const isModalTrigger = feature.isModal

            return (
              <motion.article
                key={feature.title}
                variants={itemVariants}
                whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group flex h-full min-h-[200px] flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm transition-colors hover:border-cyan-300/30 hover:bg-white/10"
              >
                {isModalTrigger ? (
                  <button
                    type="button"
                    onClick={() => setIsSourcesModalOpen(true)}
                    className="flex h-full flex-col text-left outline-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-slate-500/25 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                        {feature.hint}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </button>
                ) : (
                  <a
                    href={feature.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col text-left outline-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-300" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </a>
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </motion.section>

      {/* 3. Additional Resources Section */}
      <motion.section
        variants={itemVariants}
        whileInView="show"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }}
        className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6 shadow-soft backdrop-blur-xl sm:p-8 lg:p-10"
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
            Explore more
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Additional Resources
          </h2>
        </div>

        <motion.div variants={containerVariants} className="grid gap-4 sm:grid-cols-2">
          <motion.article
            variants={itemVariants}
            whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="group flex h-full min-h-[200px] flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm transition-colors hover:border-cyan-300/30 hover:bg-white/10 cursor-pointer"
          >
            <a
              href={`${TRUST_CENTER_URL}/impact`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col outline-none"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                Impact Dashboard
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                View educational reach, learning outcomes, and community engagement metrics across EduVision.
              </p>
            </a>
          </motion.article>

          <motion.article
            variants={itemVariants}
            whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="group flex h-full min-h-[200px] flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm transition-colors hover:border-cyan-300/30 hover:bg-white/10 cursor-pointer"
          >
            <a
              href={`${TRUST_CENTER_URL}/qa-dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col outline-none"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20">
                <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                QA Dashboard
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Monitor testing, reliability, accessibility, and UNESCO MIL compliance status.
              </p>
            </a>
          </motion.article>
        </motion.div>
      </motion.section>

      {/* Trusted Sources Modal */}
      {isSourcesModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setIsSourcesModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[900px] overflow-hidden rounded-3xl border border-white/10 bg-[#09111E] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Verified references
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Trusted Educational Sources
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sourceItems.map((source) => {
                const Icon = source.icon

                return (
                  <article
                    key={source.name}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition-all hover:border-cyan-300/25"
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

                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-cyan-300/30 hover:bg-slate-900"
                      >
                        {source.buttonLabel}
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
