'use client'

import { deleteSale } from '@/app/actions/history'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SaleDeleteButton({ saleId }: { saleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSale(saleId)
      router.refresh()
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-150">
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs font-bold text-white/30 hover:text-white/60 transition-colors px-2 py-1"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-white/[0.15] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
      title="Delete sale"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
