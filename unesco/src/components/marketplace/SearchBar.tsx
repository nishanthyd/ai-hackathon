interface SearchBarProps {
  search: string
  onSearch: (value: string) => void
}

export default function SearchBar({ search, onSearch }: SearchBarProps) {
  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-6 shadow-soft backdrop-blur-xl">
      <label className="block text-sm font-medium text-textHigh">
        Search listings
        <input
          type="text"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by topic, seller, or resource"
          className="mt-4 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
        />
      </label>
    </div>
  )
}
