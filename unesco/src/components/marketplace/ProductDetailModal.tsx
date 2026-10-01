import type { MarketplaceListing } from '../../data/mockMarketplaceListings'
import { openTrustCenter } from '../../utils/config'

interface ProductDetailModalProps {
  listing: MarketplaceListing | null
  onClose: () => void
  onAddToCart: (listing: MarketplaceListing) => void
}

export default function ProductDetailModal({ listing, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!listing) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#09111E]/95 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">{listing.type} preview</p>
            <h2 className="mt-4 text-3xl font-semibold text-textHigh">{listing.title}</h2>
            <p className="mt-3 text-sm leading-7 text-textMid">{listing.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
          >
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0C1530]/95 p-6">
            <div className="mb-6 h-56 rounded-[2rem] bg-gradient-to-br from-accent3/15 to-accent2/10 p-6 text-textHigh">
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-[#081025]/95 p-5">
                <div className="text-5xl">{listing.type === 'Video' ? '🎬' : '📘'}</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-textMid">Preview video frame</p>
                  <p className="mt-3 text-2xl font-semibold text-textHigh">Grade {listing.grade}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.75rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-textMid">Seller</p>
                <p className="mt-2 text-base font-semibold text-textHigh">{listing.seller}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-textMid">Rating</p>
                <p className="mt-2 text-base font-semibold text-textHigh">{listing.rating.toFixed(1)} / 5</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-[#101A2F]/95 p-6">
            <div className="rounded-[1.75rem] bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-textMid">Price</p>
              <p className="mt-2 text-3xl font-semibold text-textHigh">${listing.price}</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onAddToCart(listing)}
                className="w-full rounded-full bg-gradient-to-r from-accent2 to-accent3 px-5 py-4 text-sm font-semibold text-primary transition hover:scale-[1.01]"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={openTrustCenter}
                className="w-full rounded-full border border-accent2/30 bg-accent2/10 px-5 py-4 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:bg-accent2/20 hover:text-accent2 inline-flex items-center justify-center gap-2"
                title="Open EduVision Trust Center for Media and Information Literacy verification"
              >
                <svg className="h-4 w-4 text-accent2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Check Credibility for MIL</span>
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
