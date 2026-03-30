import type { Offer } from "@/app/(main)/admin/offers/_service/offersApi"
import { CheckCircle2, Pencil, Trash2, XCircle, Tag, Calendar } from "lucide-react"
import Link from "next/link"

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

const formatDiscount = (offer: Offer) =>
  offer.discountPercentage != null
    ? `${offer.discountPercentage}% off`
    : `$${Number(offer.discountFixed).toFixed(2)} off`

const isExpired = (endsAt: string) => new Date(endsAt) < new Date()

export default function OfferCard({
  offer,
  confirmDelete,
  isDeleting,
  onEdit,
  onDelete,
  onConfirmDelete,
}: {
  offer: Offer
  confirmDelete: number | null
  isDeleting: boolean
  onEdit: (offer: Offer) => void
  onDelete: (id: number) => void
  onConfirmDelete: (id: number | null) => void
}) {
  const expired = isExpired(offer.endsAt)

  const statusBadge = expired ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-(--retro-rust)/30 bg-(--retro-rust)/10 px-2 py-0.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-wider text-(--retro-rust)">
      <XCircle size={11} /> Expirada
    </span>
  ) : offer.isActive ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-wider text-emerald-400">
      <CheckCircle2 size={11} /> Activa
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-(--retro-paper)/15 bg-(--retro-paper)/5 px-2 py-0.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-wider text-(--retro-paper)/40">
      <XCircle size={11} /> Inactiva
    </span>
  )

  return (
    <div className="group relative flex flex-col rounded-xl border border-(--retro-gold)/15 bg-(--retro-dark)/60 p-5 transition-colors hover:border-(--retro-gold)/30 hover:bg-(--retro-dark)">
      <Link href={`/admin/offers/${offer.id}`}>
        {/* Top row: discount badge + status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-lg border border-(--retro-gold)/30 bg-(--retro-gold)/10 px-3 py-1.5">
            <Tag size={14} className="text-(--retro-gold)" />
            <span className="font-(family-name:--font-playfair) text-lg font-semibold text-(--retro-gold)">
              {formatDiscount(offer)}
            </span>
          </div>
          {statusBadge}
        </div>

        {/* Name */}
        <p className="font-(family-name:--font-playfair) text-base font-medium text-(--retro-cream) mb-1">
          {offer.name}
        </p>

        {/* Description */}
        {offer.description && (
          <p className="font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/55 mb-4 leading-relaxed line-clamp-2">
            {offer.description}
          </p>
        )}

        {/* Date range */}
        <div className="mt-auto flex items-center gap-1.5 text-(--retro-paper)/40">
          <Calendar size={12} />
          <span className="font-(family-name:--font-dm-sans) text-[11px]">
            {formatDate(offer.startsAt)} → {formatDate(offer.endsAt)}
          </span>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-(--retro-gold)/10" />

      </Link>
      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {confirmDelete === offer.id ? (
          <>
            <button
              type="button"
              onClick={() => onDelete(offer.id)}
              disabled={isDeleting}
              className="rounded px-2 py-1 font-(family-name:--font-dm-sans) text-xs text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete(null)}
              className="rounded px-2 py-1 font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/70 hover:text-(--retro-cream) transition-colors"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(offer)}
              className="rounded p-2 text-(--retro-paper)/50 transition-colors hover:bg-(--retro-gold)/15 hover:text-(--retro-gold)"
              aria-label="Editar"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete(offer.id)}
              className="rounded p-2 text-(--retro-paper)/50 transition-colors hover:bg-(--retro-rust)/20 hover:text-(--retro-rust)"
              aria-label="Eliminar"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}