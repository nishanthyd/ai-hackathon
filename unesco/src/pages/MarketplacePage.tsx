import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '../components/marketplace/SearchBar'
import FilterSidebar from '../components/marketplace/FilterSidebar'
import ProductGrid from '../components/marketplace/ProductGrid'
import ProductDetailModal from '../components/marketplace/ProductDetailModal'
import CartDrawer from '../components/marketplace/CartDrawer'
import SellPanel from '../components/marketplace/SellPanel'
import SectionHeading from '../components/SectionHeading'
import { mockMarketplaceListings } from '../data/mockMarketplaceListings'
import type { MarketplaceListing } from '../data/mockMarketplaceListings'
import { motionVariants } from '../utils/animation'
import { useLocation } from 'react-router-dom'

interface MarketplacePageProps {
  reducedMotion: boolean
  openSell: boolean
  onCloseSell: () => void
}

export default function MarketplacePage({ reducedMotion, openSell, onCloseSell }: MarketplacePageProps) {
  const location = useLocation()
  const params = location.state as { openSell?: boolean } | null
  const [search, setSearch] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Notes', 'Video'])
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceListing | null>(null)
  const [cartItems, setCartItems] = useState<MarketplaceListing[]>([])
  const [sellOpen, setSellOpen] = useState(openSell || !!params?.openSell)

  useEffect(() => {
    if (openSell) setSellOpen(true)
  }, [openSell])

  const subjects = useMemo(() => Array.from(new Set(mockMarketplaceListings.map((item) => item.subject))), [])
  const grades = useMemo(() => Array.from(new Set(mockMarketplaceListings.map((item) => item.grade))).sort((a, b) => Number(a) - Number(b)), [])

  const filteredListings = useMemo(
    () =>
      mockMarketplaceListings.filter((item) => {
        const matchesSearch = `${item.title} ${item.subject} ${item.seller}`.toLowerCase().includes(search.toLowerCase())
        const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(item.subject)
        const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(item.grade)
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type)
        return matchesSearch && matchesSubject && matchesGrade && matchesType
      }),
    [search, selectedSubjects, selectedGrades, selectedTypes]
  )

  const addToCart = (product: MarketplaceListing) => {
    setCartItems((items) => [...items, product])
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={motionVariants.pageTransition}
      className="space-y-16"
    >
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-10 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">Marketplace</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-textHigh sm:text-5xl">
              Buy classroom-ready notes and mini videos, or sell your own creations.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-textMid">
              Browse curated learning assets, compare quality details, and add realistic mock checkout items to a cart drawer.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.35fr_1fr] lg:px-8">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Buy with confidence"
              title="Find resources organized for subject, grade, and content type."
              description="Support student creators with polished study notes and video walkthroughs designed for classroom use."
            />
            <FilterSidebar
              subjects={subjects}
              grades={grades}
              selectedSubjects={selectedSubjects}
              selectedGrades={selectedGrades}
              selectedTypes={selectedTypes}
              onSubjectChange={setSelectedSubjects}
              onGradeChange={setSelectedGrades}
              onTypeChange={setSelectedTypes}
              onSellOpen={() => setSellOpen(true)}
            />
          </div>
          <div className="space-y-6">
            <SearchBar search={search} onSearch={setSearch} />
            <ProductGrid
              listings={filteredListings}
              onSelect={setSelectedProduct}
              onAddToCart={addToCart}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </section>

      <ProductDetailModal
        listing={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item) => {
          addToCart(item)
          setSelectedProduct(null)
        }}
      />
      <CartDrawer items={cartItems} onClose={() => setCartItems([])} reducedMotion={reducedMotion} />
      <SellPanel open={sellOpen} onClose={() => {
        setSellOpen(false)
        onCloseSell()
      }} reducedMotion={reducedMotion} />
    </motion.div>
  )
}
