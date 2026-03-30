import { Product, ProductSize, Size, SizeResponse, useGetCategoriesQuery, useGetSizesQuery, useLazyGetSizesQuery } from "@/app/(main)/shop/_service/shopApi"
import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"
import MultiImagePicker from './MultiImagePicker'

// FormSubmitValues — rename the field
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

interface ProductImages {
  altText: string
  displayOrder: number
  isPrimary: boolean
  base64?: string
  url?: string
}

export default function ProductFormModal({
  product,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  product: Product | null
  onClose: () => void
  onSubmit: (values: FormSubmitValues) => Promise<void>
  isSubmitting: boolean
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(
    product != null ? String(product.price) : ''
  )
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity ?? 0)
  const [images, setImages] = useState<ProductImages[]>(product?.images ?? [])
  const [categoryId, setCategoryId] = useState(
    product?.categoryId != null ? String(product.categoryId) : ''
  )
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.sizes ?? []
  )
  const [error, setError] = useState<string | null>(null)

  const { data: allSizes } = useGetSizesQuery()
  const { data: categories } = useGetCategoriesQuery()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const numPrice = Number.parseFloat(price)
    const numCategoryId = categoryId ? Number.parseInt(categoryId, 10) : undefined
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setError('Precio no válido.')
      return
    }
    try {
      await onSubmit({
        name,
        slug,
        description,
        stock: stockQuantity,
        price: numPrice,
        categoryId: numCategoryId,
        images,
        sizes
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el producto.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
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
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--retro-paper)]/60 hover:bg-[var(--retro-gold)]/15 hover:text-[var(--retro-cream)]"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Fotos
            </label>
            <MultiImagePicker images={images} onChange={setImages} />
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              placeholder="Ej. Chaqueta de cuero"
            />
          </div>
          <div className="flex gap-2">
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
              placeholder="ej-chaqueta-cuero"
            />
          </div>
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              >
              <option value="">Seleccione una categoría</option>
              {categories?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
              </div>
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
              placeholder="Descripción del producto"
            />
          </div>
          {/* Add inside the form */}
          <div>
            <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
              Tallas y stock
              </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {allSizes?.sizes.map(size => {
                const entry = sizes.find(s => s.sizeId === size.id)
                return (
                  <div key={size.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (entry) {
                          setSizes(sizes.filter(s => s.sizeId !== size.id))
                        } else {
                          setSizes([...sizes, { id: size.id, sizeId: size.id, stock: 0, size: { id: size.id, name: size.name } }])
                        }
                      }}
                      className={`px-3 py-1 text-sm border rounded-sm ${entry ? 'border-[var(--retro-gold)] text-[var(--retro-gold)]' : 'border-[var(--retro-gold)]/25 text-[var(--retro-paper)]/50'}`}
                    >
                      {size.name}
                    </button>
                    {entry && (
                      <input
                        type="number"
                        value={entry.stock}
                        onChange={(e) => setSizes(sizes.map(s =>
                          s.id === size.id ? { ...s, stock: Number(e.target.value) } : s
                        ))}
                        className="w-14 appearance-none rounded border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-2 py-1 text-sm text-[var(--retro-cream)]"
                        placeholder="Stock"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
                Precio ($)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-paper)]/60">
                Cantidad en Stock
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number.parseInt(e.target.value, 10))}
                required
                className="w-full rounded-lg border border-[var(--retro-gold)]/25 bg-[var(--retro-deep)] px-3 py-2 font-[family-name:var(--font-dm-sans)] text-sm text-[var(--retro-cream)] placeholder:text-[var(--retro-paper)]/40 focus:border-[var(--retro-gold)]/50 focus:outline-none"
                placeholder="0"
              />
            </div>

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
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--retro-terracota)]/30 border border-[var(--retro-gold)]/40 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs uppercase tracking-wider text-[var(--retro-gold)] hover:bg-[var(--retro-terracota)]/50 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {product ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}