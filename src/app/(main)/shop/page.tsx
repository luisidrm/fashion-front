'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HomeBackground } from '../../../components/home/HomeBackground'
import { useAppDispatch } from '@/store/hooks'
import { addItem } from '../cart/_slices/cartSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Category, Product, useGetCategoriesQuery, useGetProductsQuery } from './_service/shopApi'
import { ProductImages } from '@/components/admin/MultiImagePicker'
import { Package } from 'lucide-react'

const CATEGORIES = ['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'KNITWEAR', 'FOOTWEAR', 'ACCESSORIES']
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low']

type QuickAddState = {
  slug: string
  size: string
  price: number
  images: ProductImages[]  // not string[]
  name: string
  category: string
  quantity: 1
} | null

export default function ShopPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [sortBy, setSortBy] = useState('Featured')
  const [quickAdd, setQuickAdd] = useState<QuickAddState>(null)
  const [addedSlug, setAddedSlug] = useState<string | null>(null)


  const { data: products } = useGetProductsQuery({
    page: 1,
    limit: 12,
  })

  const { data: categories } = useGetCategoriesQuery()


  const filtered = products?.products ?? []

  const handleAddToCart = (product: Product, size: string) => {
    dispatch(addItem({
      id: product.slug,
      name: product.name,
      size,
      price: product.price,
      quantity: 1,
      images: product.images,  // already ProductImage[]
    }))
  }

  return (
    <div className="relative min-h-screen">
      <HomeBackground />
      <div className="retro-grain" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-28 md:px-12">

        {/* Page header */}
        <div className="mb-16 text-center">
          <p className="font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.35em] text-(--retro-accent)">
            Curated for you
          </p>
          <h1 className="mt-3 font-(family-name:--font-playfair) text-5xl font-semibold text-(--retro-cream) md:text-6xl">
            The Collection
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16 bg-(--retro-gold)/50" />
            <div className="h-1.5 w-1.5 rotate-45 bg-(--retro-gold)/70" />
            <div className="h-px w-16 bg-(--retro-gold)/50" />
          </div>
          <p className="mt-5 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/50">
            {filtered.length} pieces
          </p>
        </div>

        {/* Filters + Sort */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories?.categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors ${activeCategory === cat
                  ? 'bg-(--retro-terracota) text-white'
                  : 'border border-(--retro-cream)/20 text-(--retro-paper)/50 hover:border-(--retro-cream)/50 hover:text-(--retro-cream)'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/40">
              Sort
            </span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSortBy(opt)}
                  className={`px-3 py-1.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.15em] transition-colors ${sortBy === opt
                    ? 'text-(--retro-gold)'
                    : 'text-(--retro-paper)/35 hover:text-(--retro-paper)/70'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <div key={product.slug} role='button' onClick={() => router.push(`/shop/${product.slug}?params=${product.slug}`)} className="group cursor-pointer">

              {/* Image */}
              <div className="relative mb-5 aspect-square overflow-hidden bg-(--retro-deep) rounded-lg">
                {product.images[0]?.url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[0].url}`}
                  alt={product.name}
                  className="h-full w-full object-cover brightness-90 saturate-75 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="h-full w-full bg-(--retro-deep) flex items-center justify-center text-(--retro-paper)/30">
                    <Package size={20} />
                  </div>
                )}

                <div className="absolute inset-0 bg-(--retro-black)/0 transition-colors duration-500 group-hover:bg-(--retro-black)/40" />

                {/* Added confirmation */}
                {addedSlug === product.slug && (
                  <div className="absolute inset-0 flex items-center justify-center bg-(--retro-dark)/80">
                    <p className="font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.25em] text-(--retro-gold)">
                      ✓ Added to cart
                    </p>
                  </div>
                )}

                {/* Hover actions */}
                {addedSlug !== product.slug && (
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
                    {quickAdd?.slug === product.slug ? (
                      /* Size selector */
                      <div className="bg-(--retro-dark)/95 border border-(--retro-gold)/40 p-3">
                        <p className="mb-2 font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-[0.25em] text-(--retro-paper)/50">
                          Select size
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map(({ size, stock }) => (
                            <button
                              key={size.id}
                              disabled={stock === 0}
                              onClick={() => handleAddToCart(product, size.name)}
                              className="... disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuickAdd(null)}
                          className="mt-2 font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-[0.2em] text-(--retro-paper)/30 hover:text-(--retro-paper)/60"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      /* Action buttons */
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickAdd({ slug: product.slug, size: '', category: product.category?.name ?? '', price: product.price, images: product.images, name: product.name, quantity: 1 })}
                          className="flex-1 bg-(--retro-dark)/95 border border-(--retro-gold)/60 px-3 py-3 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-gold) transition-colors hover:bg-(--retro-gold) hover:text-(--retro-dark)"
                        >
                          Quick Add
                        </button>
                        <button
                          type='button'
                          onClick={() => router.push(`/shop/${product.slug}?params=${product.slug}`)}
                          className="border border-(--retro-cream)/20 bg-(--retro-dark)/95 px-3 py-3 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/60 transition-colors hover:text-(--retro-cream)"
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/50 mb-1.5">
                {product.category?.name ?? '—'}
              </p>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-(family-name:--font-playfair) text-xl font-semibold text-(--retro-cream) transition-colors group-hover:text-(--retro-gold)">
                  {product.name}
                </h3>
                <p className="font-(family-name:--font-dm-sans) text-sm text-(--retro-gold)/90 tracking-wide shrink-0">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 text-5xl opacity-20">◎</div>
            <p className="font-(family-name:--font-playfair) text-2xl text-(--retro-cream)/50">
              No pieces in this category
            </p>
          </div>
        )}

      </main>
    </div>
  )
}