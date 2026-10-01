export const pageMeta = {
  title: 'EduVision | AI-Powered Multilingual Cultural Learning',
  description:
    'EduVision is an AI-powered multilingual cultural learning platform for UNESCO Global Youth Hackathon 2026, empowering media literacy, verification, and heritage preservation.',
  image: '/favicon.svg',
  url: 'https://eduvsion.vercel.app'
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageMeta.title,
  description: pageMeta.description,
  url: pageMeta.url,
  publisher: {
    '@type': 'Organization',
    name: 'EduVision',
    logo: {
      '@type': 'ImageObject',
      url: pageMeta.image
    }
  }
}
