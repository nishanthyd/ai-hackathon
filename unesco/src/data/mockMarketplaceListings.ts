export interface MarketplaceListing {
  id: string
  title: string
  subject: string
  grade: string
  price: number
  seller: string
  rating: number
  type: 'Notes' | 'Video'
  description: string
  tags: string[]
  thumbnail: string
}

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'market-01',
    title: 'AI Ethics Notes for Grade 9',
    subject: 'Social Studies',
    grade: '9',
    price: 7,
    seller: 'Lina K.',
    rating: 4.9,
    type: 'Notes',
    description: 'A polished set of verified notes covering media ethics, responsible sharing, and UNESCO values.',
    tags: ['Ethics', 'UNESCO', 'Media Literacy'],
    thumbnail: 'notes'
  },
  {
    id: 'market-02',
    title: 'Visual Science Review Video - Ecosystems',
    subject: 'Science',
    grade: '5',
    price: 12,
    seller: 'Omar S.',
    rating: 4.8,
    type: 'Video',
    description: 'A narrated classroom-style animation that explains food chains and habitats with strong visuals.',
    tags: ['Ecosystems', 'Video Lesson', 'Interactive'],
    thumbnail: 'video'
  },
  {
    id: 'market-03',
    title: 'Math Concept Map - Fractions & Ratios',
    subject: 'Mathematics',
    grade: '7',
    price: 6,
    seller: 'Aria M.',
    rating: 4.7,
    type: 'Notes',
    description: 'Downloadable study guide with examples, practice questions, and verification prompts.',
    tags: ['Fractions', 'Ratios', 'Study Guide'],
    thumbnail: 'notes'
  },
  {
    id: 'market-04',
    title: 'Multilingual Language Story Builder Video',
    subject: 'Languages',
    grade: '6',
    price: 14,
    seller: 'Sofia N.',
    rating: 4.9,
    type: 'Video',
    description: 'A creative language-building animation that teaches grammar through story arcs and characters.',
    tags: ['Grammar', 'Storytelling', 'Multilingual'],
    thumbnail: 'video'
  },
  {
    id: 'market-05',
    title: 'Visual Heritage Notes Packet',
    subject: 'Arts',
    grade: '8',
    price: 8,
    seller: 'Kai H.',
    rating: 4.6,
    type: 'Notes',
    description: 'A crisp, illustrated notes bundle that ties heritage projects to design thinking and media.',
    tags: ['Heritage', 'Arts', 'Design'],
    thumbnail: 'notes'
  },
  {
    id: 'market-06',
    title: 'Student Presentation Deck - Social Impact',
    subject: 'Social Studies',
    grade: '10',
    price: 11,
    seller: 'Mira T.',
    rating: 4.8,
    type: 'Video',
    description: 'A mock presentation and animated explainer for digital citizenship and global civic engagement.',
    tags: ['Presentation', 'Global Issues', 'Civic'],
    thumbnail: 'video'
  }
]
