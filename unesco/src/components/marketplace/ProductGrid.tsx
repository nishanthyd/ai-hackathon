import type { MarketplaceListing } from '../../data/mockMarketplaceListings'
import { openTrustCenter } from '../../utils/config'

interface ProductGridProps {
  listings: MarketplaceListing[]
  onSelect: (listing: MarketplaceListing) => void
  onAddToCart: (listing: MarketplaceListing) => void
  reducedMotion: boolean
}

export default function ProductGrid({ listings, onSelect, onAddToCart, reducedMotion }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <article
          key={listing.id}
          className={`group flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6 shadow-soft backdrop-blur-xl ${
            reducedMotion ? '' : 'transition hover:-translate-y-1 hover:border-accent2/40 hover:shadow-glow'
          }`}
        >
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-accent2">{listing.type}</p>
                <h3 className="mt-3 text-xl font-semibold text-textHigh">{listing.title}</h3>
              </div>
              <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm font-semibold text-textHigh">${listing.price}</div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2 text-xs text-textMid">
              <span className="rounded-full bg-white/5 px-3 py-2">{listing.subject}</span>
              <span className="rounded-full bg-white/5 px-3 py-2">Grade {listing.grade}</span>
            </div>

            <p className="mb-6 text-sm leading-7 text-textMid">{listing.description}</p>

            <div className="flex flex-wrap gap-3">
              {listing.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-2 text-xs text-textMid">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onSelect(listing)}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2 text-center"
            >
              View details
            </button>
            <button
              type="button"
              onClick={openTrustCenter}
              className="flex-1 rounded-full border border-accent2/30 bg-accent2/10 px-3 py-3 text-xs font-semibold text-textHigh transition hover:border-accent2 hover:bg-accent2/20 hover:text-accent2 inline-flex items-center justify-center gap-1.5 text-center"
              title="Open EduVision Trust Center for Media and Information Literacy verification"
            >
              <svg className="h-3.5 w-3.5 text-accent2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Check Credibility for MIL</span>
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(listing)}
              className="flex-1 rounded-full bg-gradient-to-r from-accent2 to-accent3 px-3 py-3 text-xs font-semibold text-primary transition hover:scale-[1.01] text-center"
            >
              Add to cart
            </button>
          </div>
        </article>
      ))}
      {listings.length === 0 ? (
        <article className="col-span-full rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-8 text-center text-textMid shadow-soft backdrop-blur-xl">
          <p className="text-lg font-semibold text-textHigh">No listings match the current filters.</p>
          <p className="mt-3 text-sm leading-7">Try removing a filter or searching with a broader keyword.</p>
        </article>
      ) : null}
    </div>
  )
}
