'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useAddProductsToOfferMutation,
  useRemoveProductsFromOfferMutation,
  type Offer,
  useGetOffersQuery,
} from './_service/offersApi'
import OfferFormModal from '@/components/admin/OfferFormModal'
import OffersCard from '@/components/offers/OffersCard'

type OfferFormValues = {
  name?: string
  description?: string
  discountPercentage?: number
  discountFixed?: number
  startsAt: string
  endsAt: string
  isActive?: boolean
}

export default function AdminOffersPage() {
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const { data, isLoading, isError } = useGetOffersQuery()
  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation()
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation()
  const [deleteOffer, { isLoading: isDeleting }] = useDeleteOfferMutation()
  const [addProducts] = useAddProductsToOfferMutation()
  const [removeProducts] = useRemoveProductsFromOfferMutation()

  const activeOffers = data?.activeOffers ?? []
  const inactiveOffers = data?.inactiveOffers ?? []

  const handleSubmit = async (values: OfferFormValues) => {
    if (modal === 'edit' && editingOffer) {
      await updateOffer({ id: editingOffer.id, ...values }).unwrap()
    } else {
      await createOffer(values).unwrap()
    }
    closeModal()
  }

  const handleAddProducts = async (offerId: number, productIds: number[]) => {
    await addProducts({ id: offerId, productIds }).unwrap()
  }

  const handleRemoveProducts = async (offerId: number, productIds: number[]) => {
    await removeProducts({ id: offerId, productIds }).unwrap()
  }

  const openEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditingOffer(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteOffer(id).unwrap()
      setConfirmDelete(null)
    } catch {
      // error handled by RTK
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-(family-name:--font-playfair) text-3xl font-semibold text-(--retro-cream)">
            Ofertas
          </h1>
          <p className="mt-1 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60">
            {activeOffers.length} oferta{activeOffers.length !== 1 ? 's' : ''} activa{activeOffers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 rounded-lg border border-(--retro-gold)/40 bg-(--retro-terracota)/20 px-4 py-2.5 font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.2em] text-(--retro-gold) transition-colors hover:bg-(--retro-terracota)/35"
        >
          <Plus size={18} />
          Nueva oferta
        </button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 mb-6">
          <p className="font-(family-name:--font-dm-sans) text-sm text-red-400">
            Error al cargar las ofertas.
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10'>


        {/* Active offers */}
        {isLoading ? (
          <div className="flex min-h-50 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-(--retro-gold)/70" />
          </div>
        ) : activeOffers.length === 0 ? (
          <div className="rounded-lg border border-(--retro-gold)/15 bg-(--retro-dark)/40 py-16 text-center">
            <p className="font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60">
              No hay ofertas activas. Crea la primera desde el botón superior.
            </p>
          </div>
        ) : activeOffers.map((offer) => (
          <OffersCard
            key={offer.id}
            offer={offer}
            confirmDelete={confirmDelete}
            isDeleting={isDeleting}
            onEdit={openEdit}
            onDelete={handleDelete}
            onConfirmDelete={setConfirmDelete}
          // onAddProducts={handleAddProducts}
          // onRemoveProducts={handleRemoveProducts}
          />
        ))}
      </div>



      {/* Inactive offers */}
      {!isLoading && inactiveOffers.length > 0 && (
        <div className="mt-10">
          <div className="mb-4">
            <h2 className="font-(family-name:--font-playfair) text-xl font-semibold text-(--retro-cream)">
              Ofertas inactivas
            </h2>
            <p className="mt-1 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60">
              {inactiveOffers.length} oferta{inactiveOffers.length !== 1 ? 's' : ''} inactiva{inactiveOffers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10'>
            {inactiveOffers.map((offer) => (
              <OffersCard
                key={offer.id}
                offer={offer}
                confirmDelete={confirmDelete}
                isDeleting={isDeleting}
                onEdit={openEdit}
                onDelete={handleDelete}
                onConfirmDelete={setConfirmDelete}
              // onAddProducts={handleAddProducts}
              // onRemoveProducts={handleRemoveProducts}
              />
            )
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <OfferFormModal
          offer={editingOffer}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  )
}