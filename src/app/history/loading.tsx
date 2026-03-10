export default function Loading() {
  return (
    <div className="space-y-5 pb-4 animate-pulse">
      {/* Day group */}
      {[...Array(2)].map((_, g) => (
        <div key={g}>
          <div className="h-4 w-24 bg-white/[0.06] rounded-full mb-3" />
          <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-white/[0.06] rounded-full" />
                  <div className="h-3 w-32 bg-white/[0.04] rounded-full" />
                </div>
                <div className="h-6 w-14 bg-white/[0.06] rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
