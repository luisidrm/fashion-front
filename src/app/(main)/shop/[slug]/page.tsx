'use client'

import { notFound, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { addItem } from '../../cart/_slices/cartSlice'
import { HomeBackground } from '../../../../components/home/HomeBackground'
import Image from 'next/image'

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

export default function ProductPage() {
  const pathname = usePathname()
  const slug = pathname.split("/").pop() || ""

  const product = ALL_PRODUCTS.find(p => p.slug === slug)
  if (!product) notFound()

  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'care'>('details')
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    dispatch(addItem({
      id: product.slug,
      name: product.name,
      variant: product.variant,
      size: selectedSize,
      price: product.price,
      quantity,
      images: product.images,
    }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="relative min-h-screen">
      <HomeBackground />
      <div className="retro-grain" />

      {/* Back nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <Link
          href="/shop"
          className="font-(family-name:--font-dm-sans) text-[11px] uppercase tracking-[0.25em] text-(--retro-paper)/60 transition-colors hover:text-(--retro-cream)"
        >
          ← Back to shop
        </Link>
        <Link
          href="/cart"
          className="font-(family-name:--font-dm-sans) text-[11px] uppercase tracking-[0.25em] text-(--retro-paper)/60 transition-colors hover:text-(--retro-cream)"
        >
          Cart
        </Link>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_480px] lg:gap-16 xl:gap-24">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-4 h-[85%]">
            {/* Main image */}
            <div className="relative aspect-3/4 overflow-hidden bg-(--retro-deep) rounded-lg ">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover brightness-90 saturate-75 transition-all duration-700"
                width={600}
                height={800}
              />
              <div className="absolute inset-0 bg-(--retro-dark)/10" />
              {/* Category badge */}
              <div className="absolute left-4 top-4 border border-(--retro-gold)/40 bg-(--retro-dark)/70 px-3 py-1 backdrop-blur-sm">
                <span className="font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-[0.3em] text-(--retro-gold)">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-16 overflow-hidden transition-all duration-200 ${
                    activeImage === i
                      ? 'ring-1 ring-(--retro-gold) ring-offset-1 ring-offset-(--retro-warm)'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover brightness-90 saturate-75"
                    width={200}
                    height={200}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col lg:pt-2">

            {/* Header */}
            <div className="border-b border-(--retro-cream)/10 pb-7">
              <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.35em] text-(--retro-accent)">
                {product.variant}
              </p>
              <h1 className="mt-3 font-(family-name:--font-playfair) text-4xl font-semibold leading-tight text-(--retro-cream) sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 font-(family-name:--font-playfair) text-3xl text-(--retro-gold)">
                €{product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <p className="mt-7 font-body text-base leading-7 text-(--retro-paper)/75">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className={`font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  sizeError ? 'text-(--retro-rust)' : 'text-(--retro-paper)/60'
                }`}>
                  {sizeError ? '— Select a size to continue' : 'Size'}
                </span>
                {selectedSize && (
                  <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-gold)">
                    {selectedSize} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    className={`min-w-12 border px-4 py-2.5 font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.15em] transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-(--retro-terracota) bg-(--retro-terracota) text-white'
                        : sizeError
                        ? 'border-(--retro-rust)/50 text-(--retro-paper)/40 hover:border-(--retro-rust) hover:text-(--retro-cream)'
                        : 'border-(--retro-cream)/20 text-(--retro-paper)/50 hover:border-(--retro-cream)/60 hover:text-(--retro-cream)'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-7">
              <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] text-(--retro-paper)/60">
                Quantity
              </span>
              <div className="mt-3 flex items-center border border-(--retro-cream)/15 w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)"
                >
                  <span className="text-base leading-none">−</span>
                </button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-(--retro-cream)/15 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream)">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)"
                >
                  <span className="text-base leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-3 px-8 py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 ${
                  added
                    ? 'bg-(--retro-gold) text-(--retro-dark)'
                    : 'bg-(--retro-terracota) text-white hover:bg-(--retro-rust)'
                }`}
              >
                {added ? '✓ Added to cart' : 'Add to cart'}
              </button>
              <Link
                href="/cart"
                className="flex items-center justify-center border border-(--retro-cream)/25 px-6 py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-(--retro-paper)/60 transition-colors hover:border-(--retro-cream)/50 hover:text-(--retro-cream)"
              >
                View cart
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-4 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/25 text-center sm:text-left">
              Free shipping over €150 · Free returns
            </p>

            {/* Details / Care tabs */}
            <div className="mt-10 border-t border-(--retro-cream)/10 pt-8">
              <div className="flex gap-6 border-b border-(--retro-cream)/10 pb-px">
                {(['details', 'care'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors border-b ${
                      activeTab === tab
                        ? 'border-(--retro-gold) text-(--retro-gold) -mb-px'
                        : 'border-transparent text-(--retro-paper)/40 hover:text-(--retro-paper)/70'
                    }`}
                  >
                    {tab === 'details' ? 'Product details' : 'Care guide'}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                {activeTab === 'details' ? (
                  <ul className="flex flex-col gap-2">
                    {product.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/65">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-(--retro-gold)/60" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-sm leading-7 text-(--retro-paper)/65">
                    {product.care}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}