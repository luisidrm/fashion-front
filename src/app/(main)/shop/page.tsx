'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HomeBackground } from '../../../components/home/HomeBackground'
import { useAppDispatch } from '@/store/hooks'
import { addItem } from '../cart/_slices/cartSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ALL_PRODUCTS = [
  {
    slug: 'chaqueta-cuero',
    name: 'Chaqueta de Cuero',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=85',
    ],
    price: 120.00,
    sizes: ['S', 'M', 'L', 'XL'],
    variant: 'Negro / Vintage',
    description: 'Una chaqueta de cuero genuino con corte oversized inspirado en los años 40. Cada pieza envejece de forma única, adquiriendo carácter con el tiempo.',
    details: ['100% cuero genuino', 'Forro interior en algodón', 'Cierre YKK', 'Lavado en seco'],
    care: 'Limpieza profesional recomendada. Aplicar acondicionador de cuero cada 6 meses.',
  },
  {
    slug: 'botas-vaqueras',
    name: 'Botas Vaqueras',
    category: 'FOOTWEAR',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=85',
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=85',
    ],
    price: 120.00,
    sizes: ['38', '39', '40', '41', '42'],
    variant: 'Marrón / Washed',
    description: 'Botas de inspiración western con acabado washed a mano. Suela de cuero cosida, puntera reforzada y tacón cubano de 4 cm.',
    details: ['Cuero vacuno curtido al vegetal', 'Suela de cuero cosida', 'Tacón cubano 4cm', 'Plantilla anatómica extraíble'],
    care: 'Limpiar con paño húmedo. Nutrir con cera de abeja mensualmente.',
  },
  {
    slug: 'jersey-punto-crema',
    name: 'Jersey de Punto',
    category: 'KNITWEAR',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85',
      'https://images.unsplash.com/photo-1614093302611-8efc4ced0e12?w=800&q=85',
    ],
    price: 89.00,
    sizes: ['XS', 'S', 'M', 'L'],
    variant: 'Crema / Natural',
    description: 'Jersey de punto grueso en lana merino natural sin teñir. Tejido artesanal con agujas de 6mm para una textura visiblemente orgánica.',
    details: ['100% lana merino natural', 'Tejido a mano en talleres locales', 'Cuello redondo ribeteado', 'Edición limitada 30 unidades'],
    care: 'Lavar a mano en agua fría. Secar en plano sobre superficie limpia.',
  },
  {
    slug: 'linen-overshirt',
    name: 'Linen Overshirt 1940s',
    category: 'TOPS',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=85',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85',
    ],
    price: 89.00,
    sizes: ['S', 'M', 'L', 'XL'],
    variant: 'Tostado / Washed',
    description: 'Overshirt de lino belga con lavado vintage. Corte de trabajo inspirado en la ropa de faena americana de los años 40. Botones de nácar natural.',
    details: ['100% lino belga', 'Botones de nácar natural', 'Lavado enzimático', 'Costuras reforzadas en doble pespunte'],
    care: 'Lavar a 30°C. Planchar ligeramente húmedo para mejor resultado.',
  },
  {
    slug: 'corduroy-trouser',
    name: 'Corduroy Wide Trouser',
    category: 'BOTTOMS',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85',
      'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800&q=85',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85',
    ],
    price: 115.00,
    sizes: ['S', 'M', 'L', 'XL'],
    variant: 'Tierra / Vintage',
    description: 'Pantalón ancho en pana fina de canalé estrecho. Tiro alto, pernera wide-leg y acabado vintage pre-lavado. La pieza central de cualquier conjunto atemporal.',
    details: ['98% algodón 2% elastano', 'Pana canalé estrecho 21W', 'Tiro alto con cintura elástica trasera', 'Bolsillos laterales y traseros'],
    care: 'Lavar del revés a 30°C. No usar secadora.',
  },
  {
    slug: 'knit-vest',
    name: 'Raw Edge Knit Vest',
    category: 'KNITWEAR',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85',
    ],
    price: 67.00,
    sizes: ['XS', 'S', 'M', 'L'],
    variant: 'Crema / Natural',
    description: 'Chaleco de punto con bordes crudos intencionados. Sin rematar, sin disculpas. La imperfección como declaración de estilo.',
    details: ['80% lana 20% alpaca', 'Bordes crudos sin rematar', 'Tejido en telar manual', 'Pieza única numerada'],
    care: 'Solo lavado en seco. Guardar doblado, nunca colgado.',
  },
  {
    slug: 'trench-coat',
    name: 'Oversized Trench Coat',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=85',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85',
      'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=85',
    ],
    price: 195.00,
    sizes: ['S', 'M', 'L'],
    variant: 'Camel / Vintage',
    description: 'Trench coat de doble botonadura con corte oversize inspirado en el Londres de posguerra. Cinturón desmontable y hombreras sutiles.',
    details: ['65% algodón 35% poliéster', 'Doble botonadura latón', 'Forro en viscosa', 'Hombreras extraíbles'],
    care: 'Lavado en seco recomendado. Colgar en percha ancha.',
  },
  {
    slug: 'silk-blouse',
    name: 'Vintage Silk Blouse',
    category: 'TOPS',
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=85',
      'https://images.unsplash.com/photo-1564257577-3aa6fabb6f2d?w=800&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=85',
    ],
    price: 74.00,
    sizes: ['XS', 'S', 'M'],
    variant: 'Marfil / Seda',
    description: 'Blusa de seda natural con caída fluida y cuello lazada. Inspirada en la elegancia discreta del vestuario cinematográfico de los años 50.',
    details: ['100% seda natural Mulberry', 'Cuello lazada', 'Botones forrados en seda', 'Corte bias para mayor caída'],
    care: 'Lavado a mano en agua fría con jabón neutro. Planchar con vapor al revés.',
  },
  {
    slug: 'wide-brim-hat',
    name: 'Wide Brim Felt Hat',
    category: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&q=85',
    images: [
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&q=85',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=85',
      'https://images.unsplash.com/photo-1472746729193-e9a21067c27a?w=800&q=85',
    ],
    price: 55.00,
    sizes: ['ONE SIZE'],
    variant: 'Tabaco / Fieltro',
    description: 'Sombrero de ala ancha en fieltro de lana prensada. Banda de grosgrain en tono crema. Modelable con vapor para ajustar la forma al gusto.',
    details: ['100% fieltro de lana prensada', 'Banda grosgrain interior', 'Ala de 9cm', 'Modelable con vapor'],
    care: 'No mojar. Guardar en sombrerera. Limpiar con cepillo suave.',
  },
]

const CATEGORIES = ['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'KNITWEAR', 'FOOTWEAR', 'ACCESSORIES']
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low']

type QuickAddState = { 
  slug: string; 
  size: string, 
  price: number, 
  images: string[], 
  name: string, 
  category: string 
  quantity: 1
} | null

export default function ShopPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [activeCategory, setActiveCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('Featured')
  const [quickAdd, setQuickAdd] = useState<QuickAddState>(null)
  const [addedSlug, setAddedSlug] = useState<string | null>(null)

  const filtered = ALL_PRODUCTS
    .filter(p => activeCategory === 'ALL' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price
      if (sortBy === 'Price: High to Low') return b.price - a.price
      return 0
    })

  const handleAddToCart = (product: typeof ALL_PRODUCTS[0], size: string) => {
    dispatch(addItem({
      id: product.slug,
      name: product.name,
      variant: product.variant,
      size,
      price: product.price,
      quantity: 1,
      images: product.images.map(img => { return img }),
    }))
    setQuickAdd(null)
    setAddedSlug(product.slug)
    setTimeout(() => setAddedSlug(null), 1800)
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
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors ${activeCategory === cat
                    ? 'bg-(--retro-terracota) text-white'
                    : 'border border-(--retro-cream)/20 text-(--retro-paper)/50 hover:border-(--retro-cream)/50 hover:text-(--retro-cream)'
                  }`}
              >
                {cat}
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <div key={product.slug} className="group cursor-pointer">

              {/* Image */}
              <div className="relative mb-5 aspect-square overflow-hidden bg-(--retro-deep)">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover brightness-90 saturate-75 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={300}
                  height={300}
                />
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
                          {product.sizes.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleAddToCart(product, size)}
                              className="border border-(--retro-gold)/40 px-2.5 py-1 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.15em] text-(--retro-gold) transition-colors hover:bg-(--retro-gold) hover:text-(--retro-dark)"
                            >
                              {size}
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
                          onClick={() => setQuickAdd({ slug: product.slug, size: '',category:product.category, price: product.price, images: product.images, name: product.name, quantity: 1 })}
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
                {product.category}
              </p>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-(family-name:--font-playfair) text-xl font-semibold text-(--retro-cream) transition-colors group-hover:text-(--retro-gold)">
                  {product.name}
                </h3>
                <p className="font-(family-name:--font-dm-sans) text-sm text-(--retro-gold)/90 tracking-wide shrink-0">
                  €{product.price.toFixed(2)}
                </p>
              </div>
              <p className="mt-0.5 font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/35">
                {product.variant}
              </p>
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