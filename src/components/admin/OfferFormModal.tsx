'use client'

import { X, Loader2, Check } from 'lucide-react'
import { useState } from 'react'
import type { Offer } from '../../app/(main)/admin/offers/_service/offersApi'
import { useGetProductsQuery } from '@/app/(main)/shop/_service/shopApi'

// Create: no productIds — offer is created standalone, products added after
type CreateOfferValues = {
  name?: string
  description?: string
  discountPercentage?: number
  discountFixed?: number
  startsAt: string
  endsAt: string
  isActive: boolean
}

// The modal also manages product associations separately
type OfferFormModalProps = {
  offer: Offer | null
  onClose: () => void
  onSubmit: (values: CreateOfferValues) => Promise<void>
  onAddProducts?: (offerId: number, productIds: number[]) => Promise<void>
  onRemoveProducts?: (offerId: number, productIds: number[]) => Promise<void>
  isSubmitting: boolean
}

const toISO = (dateStr: string) => new Date(dateStr).toISOString()

const isWithinPeriod = (startsAt: string, endsAt: string) => {
  const now = new Date()
  return now >= new Date(startsAt) && now <= new Date(endsAt)
}

const inputClass = "w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
const labelClass = "mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60"

export default function OfferFormModal({
  offer,
  onClose,
  onSubmit,
  onAddProducts,
  onRemoveProducts,
  isSubmitting,
}: OfferFormModalProps) {

  const [name, setName] = useState(offer?.name ?? '')
  const [description, setDescription] = useState(offer?.description ?? '')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    offer?.discountFixed != null ? 'fixed' : 'percentage'
  )
  const [discountValue, setDiscountValue] = useState(
    String(offer?.discountPercentage ?? offer?.discountFixed ?? '')
  )
  const [startsAt, setStartsAt] = useState(
    offer?.startsAt ? offer.startsAt.split('T')[0] : ''
  )
  const [endsAt, setEndsAt] = useState(
    offer?.endsAt ? offer.endsAt.split('T')[0] : ''
  )
  const [isActive, setIsActive] = useState(offer?.isActive ?? true)
  const [error, setError] = useState<string | null>(null)



  const handleActiveToggle = () => {
    if (!isActive) {
      if (!startsAt || !endsAt) {
        setError('Define las fechas antes de activar la oferta.')
        return
      }
      if (!isWithinPeriod(startsAt, endsAt)) {
        setError('La oferta solo puede activarse si la fecha actual está dentro del período.')
        return
      }
    }
    setError(null)
    setIsActive((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numDiscount = Number(discountValue)
    if (!discountValue || isNaN(numDiscount) || numDiscount < 0) return setError('Descuento no válido.')
    if (!startsAt || !endsAt) return setError('Las fechas son requeridas.')
    if (new Date(startsAt) >= new Date(endsAt)) return setError('La fecha de inicio debe ser anterior a la de fin.')
    if (isActive && !isWithinPeriod(startsAt, endsAt)) {
      return setError('La oferta solo puede estar activa si la fecha actual está dentro del período.')
    }

    try {
      // 1. Create or update the offer itself (no products)
      await onSubmit({
        name: name || undefined,
        description: description || undefined,
        ...(discountType === 'percentage'
          ? { discountPercentage: numDiscount }
          : { discountFixed: numDiscount }),
        startsAt: toISO(startsAt),
        endsAt: toISO(endsAt),
        isActive,
      })

      // 2. Sync product associations only when editing
      if (offer && (onAddProducts || onRemoveProducts)) {
        const toAdd = selectedProductIds.filter((id) => !existingProductIds.includes(id))
        const toRemove = existingProductIds.filter((id) => !selectedProductIds.includes(id))

        if (toAdd.length > 0 && onAddProducts) {
          await onAddProducts(offer.id, toAdd)
        }
        if (toRemove.length > 0 && onRemoveProducts) {
          await onRemoveProducts(offer.id, toRemove)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-(--retro-black)/60"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-md rounded-xl border border-(--retro-gold)/20 bg-(--retro-dark) p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-(family-name:--font-playfair) text-xl font-semibold text-(--retro-cream)">
            {offer ? 'Editar oferta' : 'Nueva oferta'}
          </h2>
          <button type="button" onClick={onClose} className="rounded p-2 text-(--retro-paper)/60 hover:bg-(--retro-gold)/15 hover:text-(--retro-cream)">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Product picker — shown in edit mode to manage associations */}
          {!offer && (
            // On create — show a note that products are added after creation
            <div className="rounded-lg border border-(--retro-gold)/15 bg-(--retro-deep) px-4 py-3">
              <p className="font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/50">
                Podrás asociar productos a esta oferta una vez creada.
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelClass}>
              Nombre <span className="normal-case text-[var(--retro-paper)]/30">(opcional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Black Friday"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Descripción <span className="normal-case text-[var(--retro-paper)]/30">(opcional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Detalles de la oferta..."
              className="w-full resize-none rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
            />
          </div>

          {/* Discount type */}
          <div>
            <label className={labelClass}>Tipo de descuento</label>
            <div className="flex gap-2">
              {(['percentage', 'fixed'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDiscountType(type)}
                  className={`flex-1 rounded-lg border py-2 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider transition-colors ${discountType === type
                      ? 'border-[var(--retro-gold)]/60 bg-[var(--retro-gold)]/10 text-[var(--retro-gold)]'
                      : 'border-[var(--retro-gold)]/20 text-[var(--retro-paper)]/50 hover:border-[var(--retro-gold)]/40'
                    }`}
                >
                  {type === 'percentage' ? 'Porcentaje %' : 'Fijo $'}
                </button>
              ))}
            </div>
          </div>

          {/* Discount value */}
          <div>
            <label className={labelClass}>
              {discountType === 'percentage' ? 'Descuento (%)' : 'Descuento ($)'}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min={0}
              max={discountType === 'percentage' ? 100 : undefined}
              step="0.01"
              required
              className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              placeholder={discountType === 'percentage' ? '10' : '5.00'}
            />
          </div>

          {/* Dates */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Inicio</label>
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Fin</label>
              <input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--retro-gold)]/20 bg-[var(--retro-deep)] px-4 py-3">
            <div>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/70">
                Oferta activa
              </span>
              {isActive && startsAt && endsAt && !isWithinPeriod(startsAt, endsAt) && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[var(--retro-rust)] mt-0.5">
                  Fuera del período definido
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleActiveToggle}
              className={`relative h-5 w-9 rounded-full transition-colors ${isActive ? 'bg-[var(--retro-gold)]' : 'bg-[var(--retro-paper)]/20'
                }`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${isActive ? 'left-[18px]' : 'left-0.5'
                }`} />
            </button>
          </div>

          {error && (
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-rust)]">{error}</p>
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
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-(--retro-gold)/40 bg-(--retro-terracota)/30 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-gold)] hover:bg-[var(--retro-terracota)]/50 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {offer ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}