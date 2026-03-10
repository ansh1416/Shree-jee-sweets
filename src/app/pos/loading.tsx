export default function Loading() {
  return (
    <div className="space-y-4 pb-4 animate-pulse">
      {/* Grid of product buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[110px] bg-white/[0.06] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
