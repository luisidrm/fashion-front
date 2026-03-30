'use client'

import { LogOut, X } from 'lucide-react'

export default function LogoutModal({
  onClose,
  onConfirm,
  isLoading,
}: {
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-[var(--retro-black)]/60"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-sm rounded-xl border border-[var(--retro-gold)]/20 bg-[var(--retro-dark)] p-6 shadow-xl">
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1.5 text-[var(--retro-paper)]/40 hover:bg-[var(--retro-gold)]/10 hover:text-[var(--retro-cream)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--retro-rust)]/30 bg-[var(--retro-rust)]/10">
          <LogOut size={20} className="text-[var(--retro-rust)]" />
        </div>

        {/* Text */}
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--retro-cream)]">
          Cerrar sesión
        </h2>
        <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
          ¿Estás seguro de que quieres cerrar sesión?
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--retro-gold)]/25 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/70 hover:bg-[var(--retro-gold)]/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--retro-rust)]/40 bg-[var(--retro-rust)]/20 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-rust)] hover:bg-[var(--retro-rust)]/35 disabled:opacity-60 transition-colors"
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--retro-rust)] border-t-transparent" />
            ) : (
              <LogOut size={14} />
            )}
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}