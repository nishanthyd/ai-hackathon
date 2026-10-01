import type { MarketplaceListing } from '../../data/mockMarketplaceListings'

interface CartDrawerProps {
  items: MarketplaceListing[]
  onClose: () => void
  reducedMotion: boolean
}

export default function CartDrawer({ items, onClose, reducedMotion }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)

  if (items.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:items-center sm:justify-end">
      <div className={`w-full max-w-md rounded-t-[2rem] border border-white/10 bg-[#08101F]/95 p-6 shadow-soft backdrop-blur-xl sm:rounded-l-[2rem] sm:rounded-r-none ${
        reducedMotion ? 'transition-none' : 'transition-transform duration-300 ease-out'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">Cart summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-textHigh">Your selected resources</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-[1.75rem] border border-white/10 bg-[#0B1221]/95 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-textMid">{item.type}</p>
                  <h3 className="mt-2 text-lg font-semibold text-textHigh">{item.title}</h3>
                  <p className="mt-2 text-sm text-textMid">Seller {item.seller}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-textHigh">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-textHigh">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-textMid">Subtotal</p>
            <p className="text-xl font-semibold">${subtotal}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-textMid">Checkout is mocked locally and designed to feel production-grade while backend payments are pending.</p>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-full bg-white/5 px-5 py-4 text-sm font-semibold text-textMid transition cursor-not-allowed"
          title="Checkout will be enabled once the payment backend is connected"
        >
          Checkout (mock)
        </button>
      </div>
    </div>
  )
}
