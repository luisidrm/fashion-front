'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from 'lucide-react'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
} from './_service/categoriesApi'
import CategoryFormModal from '../../../../components/admin/CategoryFormModal'

const LIMIT = 12

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const { data, isLoading, isFetching } = useGetCategoriesQuery({ page, limit: LIMIT })
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const categories = data?.categories ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / LIMIT) || 1

  const handleSubmit = async (values: Partial<Category>) => {
    if (modal === 'edit' && editingCategory) {
      await updateCategory({ id: editingCategory.id, ...values }).unwrap()
    } else {
      await createCategory(values).unwrap()
    }
    closeModal()
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditingCategory(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap()
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
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--retro-cream)]">
            Categorías
          </h1>
          <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
            {total} categoría{total !== 1 ? 's' : ''} en catálogo
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

      {/* Table */}
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--retro-gold)]/70" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-[var(--retro-gold)]/15 bg-[var(--retro-dark)]/40 py-16 text-center">
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/60">
            No hay categorías. Crea la primera desde el botón superior.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[var(--retro-gold)]/15 bg-[var(--retro-dark)]/40">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-[var(--retro-gold)]/15">
                    <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--retro-paper)]/50">
                      Descripción
                    </th>
                    <th className="w-24 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-[var(--retro-gold)]/10 transition-colors hover:bg-[var(--retro-warm)]/20"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[var(--retro-gold)]/10 text-[var(--retro-gold)]/60">
                            <FolderOpen size={16} />
                          </div>
                          <p className="font-[family-name:var(--font-playfair)] font-medium text-[var(--retro-cream)]">
                            {category.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-[family-name:var(--font-dm-sans)] text-xs text-[var(--retro-paper)]/50">
                        {category.slug}
                      </td>
                      <td className="px-4 py-3 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-paper)]/70">
                        {category.description ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(category)}
                            className="rounded p-2 text-[var(--retro-paper)]/60 transition-colors hover:bg-[var(--retro-gold)]/15 hover:text-[var(--retro-gold)]"
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          {confirmDelete === category.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDelete(category.id)}
                                disabled={isDeleting}
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
                              onClick={() => setConfirmDelete(category.id)}
                              className="rounded p-2 text-[var(--retro-paper)]/60 transition-colors hover:bg-[var(--retro-rust)]/20 hover:text-[var(--retro-rust)]"
                              aria-label="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
        <CategoryFormModal
          category={editingCategory}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  )
}