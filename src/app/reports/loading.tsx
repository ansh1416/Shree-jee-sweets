export default function Loading() {
  return (
    <div className="space-y-5 pb-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-3xl" />
        <div className="h-28 bg-white/[0.06] rounded-3xl" />
      </div>
      <div className="h-52 bg-[#13131e] rounded-3xl border border-white/[0.06]" />
      <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 flex justify-between items-center">
            <div className="h-3 w-32 bg-white/[0.06] rounded-full" />
            <div className="h-4 w-16 bg-white/[0.04] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
