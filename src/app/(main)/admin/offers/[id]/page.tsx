'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  useGetOfferQuery,
  useAddProductsToOfferMutation,
  useRemoveProductsFromOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
  type Offer,
  type ProductOffer,
} from '../_service/offersApi'
import { useGetProductsQuery } from '@/app/(main)/shop/_service/shopApi'
import {
  ArrowLeft,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Loader2,
  Pencil,
  Search,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import OfferFormModal from '@/components/admin/OfferFormModal'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

const formatDiscount = (offer: Offer) =>
  offer.discountPercentage != null
    ? `${offer.discountPercentage}% off`
    : `$${Number(offer.discountFixed).toFixed(2)} off`

const isExpired = (endsAt: string) => new Date(endsAt) < new Date()

type OfferFormValues = {
  name?: string
  description?: string
  discountPercentage?: number
  discountFixed?: number
  startsAt: string
  endsAt: string
  isActive?: boolean
}

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const offerId = Number(id)

  const { data, isLoading, isError } = useGetOfferQuery(offerId)
  const { data: productsData } = useGetProductsQuery({})

  const [addProducts, { isLoading: isAdding }] = useAddProductsToOfferMutation()
  const [removeProducts, { isLoading: isRemoving }] = useRemoveProductsFromOfferMutation()
  const [deleteOffer, { isLoading: isDeleting }] = useDeleteOfferMutation()
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation()

  const [search, setSearch] = useState('')
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const offer = data?.offer

  const linkedProductIds = new Set(offer?.products?.map((p) => p.productId) ?? [])

  const availableProducts = productsData?.products.filter(
    (p) =>
      !linkedProductIds.has(p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleAdd = async (productId: number) => {
    await addProducts({ id: offerId, productIds: [productId] }).unwrap()
  }

  const handleRemove = async (productId: number) => {
    await removeProducts({ id: offerId, productIds: [productId] }).unwrap()
    setConfirmRemove(null)
  }

  const handleDelete = async () => {
    await deleteOffer(offerId).unwrap()
    router.push('/admin/offers')
  }

  const handleUpdate = async (values: OfferFormValues) => {
    await updateOffer({ id: offerId, ...values }).unwrap()
    setEditModal(false)
  }

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-(--retro-gold)/70" />
      </div>
    )
  }

  if (isError || !offer) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-(family-name:--font-dm-sans) text-sm text-red-400">
          No se pudo cargar la oferta.
        </p>
      </div>
    )
  }

  const expired = isExpired(offer.endsAt)

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

      {/* Back */}
      <Link
        href="/admin/offers"
        className="mb-8 inline-flex items-center gap-2 font-(family-name:--font-dm-sans) text-xs uppercase tracking-wider text-(--retro-paper)/50 hover:text-(--retro-gold) transition-colors"
      >
        <ArrowLeft size={14} />
        Volver a ofertas
      </Link>

      {/* ── Offer header card ── */}
      <div className="mt-6 rounded-xl border border-(--retro-gold)/20 bg-(--retro-dark)/60 p-6 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          {/* Left: info */}
          <div className="flex flex-col gap-3">
            {/* Discount + status */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-(--retro-gold)/30 bg-(--retro-gold)/10 px-3 py-1.5">
                <Tag size={14} className="text-(--retro-gold)" />
                <span className="font-(family-name:--font-playfair) text-xl font-semibold text-(--retro-gold)">
                  {formatDiscount(offer)}
                </span>
              </div>
              {expired ? (
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
              )}
            </div>

            {/* Name */}
            <h1 className="font-(family-name:--font-playfair) text-2xl font-semibold text-(--retro-cream)">
              {offer.name ?? 'Sin nombre'}
            </h1>

            {/* Description */}
            {offer.description && (
              <p className="font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60 leading-relaxed max-w-lg">
                {offer.description}
              </p>
            )}

            {/* Dates */}
            <div className="flex items-center gap-1.5 text-(--retro-paper)/40">
              <Calendar size={13} />
              <span className="font-(family-name:--font-dm-sans) text-xs">
                {formatDate(offer.startsAt)} → {formatDate(offer.endsAt)}
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-(--retro-gold)/30 px-3 py-2 font-(family-name:--font-dm-sans) text-xs uppercase tracking-wider text-(--retro-paper)/60 hover:bg-(--retro-gold)/10 hover:text-(--retro-gold) transition-colors"
            >
              <Pencil size={14} />
              Editar
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg px-3 py-2 font-(family-name:--font-dm-sans) text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirmar'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg px-3 py-2 font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/60"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-(--retro-rust)/30 px-3 py-2 font-(family-name:--font-dm-sans) text-xs uppercase tracking-wider text-(--retro-rust)/70 hover:bg-(--retro-rust)/10 hover:text-(--retro-rust) transition-colors"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Two columns: linked products + add products ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Linked products */}
        <div className="rounded-xl border border-(--retro-gold)/15 bg-(--retro-dark)/40 overflow-hidden">
          <div className="border-b border-(--retro-gold)/10 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-(family-name:--font-playfair) text-lg font-semibold text-(--retro-cream)">
                Productos en oferta
              </h2>
              <p className="font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/50 mt-0.5">
                {offer.products?.length ?? 0} producto{(offer.products?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="divide-y divide-(--retro-gold)/10">
            {!offer.products?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-(--retro-paper)/30">
                <Package size={28} className="mb-2" />
                <p className="font-(family-name:--font-dm-sans) text-xs">
                  Sin productos asignados
                </p>
              </div>
            ) : (
              offer.products.map((po: ProductOffer) => {
                const image = po.product?.images?.[0]
                return (
                  <div key={po.productId} className="flex items-center gap-3 px-5 py-3 hover:bg-(--retro-warm)/10 transition-colors">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-(--retro-deep)">
                      {image?.url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.url}`}
                          alt={image.altText ?? po.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-(--retro-paper)/20">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-(family-name:--font-playfair) text-sm font-medium text-(--retro-cream) truncate">
                        {po.product.name}
                      </p>
                      <p className="font-(family-name:--font-dm-sans) text-[11px] text-(--retro-paper)/40 truncate">
                        {po.product.slug}
                      </p>
                    </div>
                    {confirmRemove === po.productId ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemove(po.productId)}
                          disabled={isRemoving}
                          className="rounded px-2 py-1 font-(family-name:--font-dm-sans) text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          {isRemoving ? <Loader2 size={12} className="animate-spin" /> : 'Quitar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRemove(null)}
                          className="rounded px-2 py-1 font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/50"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(po.productId)}
                        className="shrink-0 rounded p-1.5 text-(--retro-paper)/30 hover:bg-(--retro-rust)/15 hover:text-(--retro-rust) transition-colors"
                        aria-label="Quitar producto"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Add products */}
        <div className="rounded-xl border border-(--retro-gold)/15 bg-(--retro-dark)/40 overflow-hidden">
          <div className="border-b border-(--retro-gold)/10 px-5 py-4">
            <h2 className="font-(family-name:--font-playfair) text-lg font-semibold text-(--retro-cream)">
              Añadir productos
            </h2>
            <p className="font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/50 mt-0.5">
              {availableProducts.length} producto{availableProducts.length !== 1 ? 's' : ''} disponible{availableProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-(--retro-gold)/10">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--retro-paper)/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full rounded-lg border border-(--retro-gold)/20 bg-(--retro-deep) pl-9 pr-3 py-2 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream) placeholder:text-(--retro-paper)/30 focus:border-(--retro-gold)/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-(--retro-gold)/10 max-h-[420px] overflow-y-auto">
            {availableProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-(--retro-paper)/30">
                <Package size={28} className="mb-2" />
                <p className="font-(family-name:--font-dm-sans) text-xs">
                  {search ? 'Sin resultados' : 'Todos los productos ya están en la oferta'}
                </p>
              </div>
            ) : (
              availableProducts.map((product) => {
                const image = product.images?.[0]
                return (
                  <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-(--retro-warm)/10 transition-colors">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-(--retro-deep)">
                      {image?.url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.url}`}
                          alt={image.altText ?? product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-(--retro-paper)/20">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-(family-name:--font-playfair) text-sm font-medium text-(--retro-cream) truncate">
                        {product.name}
                      </p>
                      <p className="font-(family-name:--font-dm-sans) text-[11px] text-(--retro-paper)/40 truncate">
                        {product.slug}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdd(product.id)}
                      disabled={isAdding}
                      className="shrink-0 rounded p-1.5 text-(--retro-paper)/30 hover:bg-(--retro-gold)/15 hover:text-(--retro-gold) transition-colors disabled:opacity-40"
                      aria-label="Añadir producto"
                    >
                      {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editModal && (
        <OfferFormModal
          offer={offer}
          onClose={() => setEditModal(false)}
          onSubmit={handleUpdate}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  )
}