'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeactivateProductMutation,
  type Product,
  useLazyGetProductBySlugQuery,
  useLazyGetProductsQuery,
} from '@/app/(main)/shop/_service/shopApi'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import ProductFormModal from '@/components/admin/ProductFormModal'
import { ProductResponse } from '@/app/(main)/shop/_service/shopApi'
import { ProductImages } from '@/components/admin/MultiImagePicker'

const LIMIT = 12
// FormSubmitValues here too
type FormSubmitValues = {
  name: string
  slug: string
  description: string
  price: number
  stock: number        // was stockQuantity
  categoryId?: number
  images: ProductImages[]
  sizes?: { sizeId: number; stock: number }[]  // add this
}

export default function AdminProductsPage() {

  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)


  const [products, setProducts] = useState<Product[]>([])
  const [refresh, setRefresh] = useState(false)
  const [total, setTotal] = useState(0)

  const [getProducts, { isFetching, isLoading }] = useLazyGetProductsQuery()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deactivateProduct, { isLoading: isDeactivating }] =
    useDeactivateProductMutation()

  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts({ page, limit: LIMIT }).unwrap().then((res: ProductResponse) => {
        setProducts(res.products)
        setTotal(res.total)
      })
    }
    fetchProducts()
  }, [page, getProducts, refresh])

  const handleSubmit = async (values: FormSubmitValues) => {
    if (modal === 'edit' && editingProduct) {
      await updateProduct({ id: editingProduct.id, ...values }).unwrap()
      setRefresh(!refresh)
    } else {
      await createProduct(values as unknown as Product).unwrap()
      setRefresh(!refresh)
    }
    closeModal()
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditingProduct(null)
  }

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateProduct(id).unwrap()
      setConfirmDelete(null)
    } catch {
      // error handled by RTK
    }
  }

  const totalPages = Math.ceil(total / LIMIT) || 1

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--retro-cream)]">
            Productos
          </h1>
          <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
            {total} producto{total !== 1 ? 's' : ''} en catálogo
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--retro-gold)]/40 bg-[var(--retro-terracota)]/20 px-4 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-[0.2em] text-[var(--retro-gold)] transition-colors hover:bg-[var(--retro-terracota)]/35"
        >
          <Plus size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--retro-gold)]/70" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-[var(--retro-gold)]/15 bg-[var(--retro-dark)]/40 py-16 text-center">
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
            No hay productos. Crea el primero desde el botón superior.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[var(--retro-gold)]/15 bg-[var(--retro-dark)]/40">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--retro-gold)]/15">
                    <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Categoría
                    </th>
                    {/* <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      
                    </th> */}
                    <th className="px-4 py-3 text-right font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Precio
                    </th>
                    <th className="w-24 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const primaryImage = product.images?.[0]

                    return (
                    <tr
                      key={product.id}
                      className="border-b border-[var(--retro-gold)]/10 transition-colors hover:bg-[var(--retro-warm)]/20"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-[var(--retro-deep)]">
                            {primaryImage?.url ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${primaryImage.url}`}
                                alt={primaryImage.altText ?? product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[var(--retro-paper)]/30">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-playfair)] font-medium text-[var(--retro-cream)]">
                              {product.name}
                            </p>
                            <p className="font-[family-name:var(--font-dm-sans)] text-xs text-[var(--retro-paper)]/50">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/70">
                        {product.category?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-gold)]">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="rounded p-2 text-[var(--retro-paper)]/60 transition-colors hover:bg-[var(--retro-gold)]/15 hover:text-[var(--retro-gold)]"
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          {confirmDelete === product.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeactivate(product.id)}
                                disabled={isDeactivating}
                                className="rounded px-2 py-1 font-[family-name:var(--font-dm-sans)] text-xs text-red-400 hover:bg-red-500/20"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="rounded px-2 py-1 font-[family-name:var(--font-dm-sans)] text-xs text-[var(--retro-paper)]/70"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(product.id)}
                              className="rounded p-2 text-[var(--retro-paper)]/60 transition-colors hover:bg-[var(--retro-rust)]/20 hover:text-[var(--retro-rust)]"
                              aria-label="Desactivar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-[var(--retro-gold)]/25 px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/70 disabled:opacity-40 hover:bg-[var(--retro-gold)]/10"
              >
                Anterior
              </button>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-[var(--retro-gold)]/25 px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/70 disabled:opacity-40 hover:bg-[var(--retro-gold)]/10"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <ProductFormModal
          product={editingProduct}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  )
}

function Package({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  )
}
