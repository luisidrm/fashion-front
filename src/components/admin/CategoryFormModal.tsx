'use client'

import { X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type Category } from '../../app/(main)/admin/categories/_service/categoriesApi'

export default function CategoryFormModal({
  category,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  category: Category | null
  onClose: () => void
  onSubmit: (values: Partial<Category>) => Promise<void>
  isSubmitting: boolean
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setName(val)
    if (!category) {
      setSlug(val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({ name, slug, description })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.')
    }
  }

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
      <div className="relative w-full max-w-md rounded-xl border border-[var(--retro-gold)]/20 bg-[var(--retro-dark)] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--retro-cream)]">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--retro-paper)]/60 hover:bg-[var(--retro-gold)]/15 hover:text-[var(--retro-cream)]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              placeholder="Ej. Camisetas"
            />
          </div>
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              placeholder="ej-camisetas"
            />
          </div>
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              placeholder="Descripción de la categoría"
            />
          </div>

          {error && (
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-rust)]">
              {error}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[var(--retro-gold)]/25 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/70 hover:bg-[var(--retro-gold)]/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--retro-gold)]/40 bg-[var(--retro-terracota)]/30 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-gold)] hover:bg-[var(--retro-terracota)]/50 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {category ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}