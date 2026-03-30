'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { addItem } from '../../cart/_slices/cartSlice'
import { HomeBackground } from '../../../../components/home/HomeBackground'
import { Product, useLazyGetProductBySlugQuery } from '../_service/shopApi'
import { Loader2 } from 'lucide-react'

export default function ProductPage() {
  const pathname = usePathname()
  const slug = pathname.split("/").pop() || ""

  const [product, setProduct] = useState<Product | null>(null)
  const [getProductBySlug, { isLoading }] = useLazyGetProductBySlugQuery()

  useEffect(() => {
    getProductBySlug(slug).unwrap()
      .then((res) => setProduct(res.product))
      .catch(console.error)
  }, [slug])

  const dispatch = useAppDispatch()
  const [selectedSize, setSelectedSize] = useState<string>()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'details' | 'care'>('details')
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  // --- Sticky CTA logic ---
  const cartButtonRef = useRef<HTMLDivElement>(null)
  const [showStickyBtn, setShowStickyBtn] = useState(true)

  useEffect(() => {
    const header = document.getElementById('main-header')
    if (!header) return
    header.style.display = 'none'
    return () => { header.style.display = '' }
  }, [])

  useEffect(() => {
    const el = cartButtonRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [product]) // re-run once product is loaded and ref is mounted

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    dispatch(addItem({
      id: product?.slug || "",
      name: product?.name || "",
      size: selectedSize,
      price: product?.price || 0,
      quantity,
      images: product?.images || [],
    }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  // --- Loading / empty states ---
  if (isLoading || !product) {
    return (
      <div className="relative min-h-screen">
        <HomeBackground />
        <div className="retro-grain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin text-(--retro-gold)" size={32} />
        </div>
      </div>
    )
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
          <div className="flex flex-col gap-4 lg:h-[85%]">

            {/* Main image — desktop only */}
            <div className="relative hidden aspect-3/4 overflow-hidden bg-(--retro-deep) rounded-lg lg:block">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[activeImage]?.url}`}
                alt={product.name}
                className="h-full w-full object-cover brightness-90 saturate-75 transition-all duration-700"
                width={600}
                height={800}
              />
              <div className="absolute inset-0 bg-(--retro-dark)/10" />
              <div className="absolute left-4 top-4 border border-(--retro-gold)/40 bg-(--retro-dark)/70 px-3 py-1 backdrop-blur-sm">
                <span className="font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-[0.3em] text-(--retro-gold)">
                  {product.category?.name || ""}
                </span>
              </div>
            </div>

            {/* Mobile swipe carousel */}
            <div className="relative lg:hidden">
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-0">
                {product.images.map((img, i) => (
                  <div
                    key={`${img.url}-${i}`}
                    className="relative shrink-0 w-screen aspect-square snap-center snap-always overflow-hidden bg-(--retro-deep)"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.url}`}
                      alt={img.altText || product.name}
                      className="h-full w-full object-cover brightness-90 saturate-75"
                      width={600}
                      height={800}
                    />
                    <div className="absolute inset-0 bg-(--retro-dark)/10" />
                    {i === 0 && (
                      <div className="absolute left-4 top-4 border border-(--retro-gold)/40 bg-(--retro-dark)/70 px-3 py-1 backdrop-blur-sm">
                        <span className="font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-[0.3em] text-(--retro-gold)">
                          {product.category?.name || ""}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Dot indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className="block h-1 w-1 rounded-full bg-brown-500"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails — desktop only */}
            <div className="hidden lg:flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-16 overflow-hidden transition-all duration-200 ${activeImage === i
                      ? 'ring-1 ring-(--retro-gold) ring-offset-1 ring-offset-(--retro-warm)'
                      : 'opacity-50 hover:opacity-80'
                    }`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.url}`}
                    alt={img.altText}
                    className="h-full w-full object-cover brightness-90 saturate-75"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col lg:pt-2">

            <div className="border-b border-(--retro-cream)/10 pb-7">
              <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.35em] text-(--retro-accent)">
                {product.category?.name || ""}
              </p>
              <h1 className="mt-3 font-(family-name:--font-playfair) text-4xl font-semibold leading-tight text-(--retro-cream) sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 font-(family-name:--font-playfair) text-3xl text-(--retro-gold)">
                ${product.price}
              </p>
            </div>

            <p className="mt-7 font-body text-base leading-7 text-(--retro-paper)/75">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className={`font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors ${sizeError ? 'text-(--retro-rust)' : 'text-(--retro-paper)/60'
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
                    key={size.id}
                    type="button"
                    onClick={() => { setSelectedSize(size.size.name); setSizeError(false) }}
                    className={`min-w-12 border px-4 py-2.5 font-(family-name:--font-dm-sans) text-xs uppercase tracking-[0.15em] transition-all duration-200 ${selectedSize === size.size.name
                        ? 'border-(--retro-terracota) bg-(--retro-terracota) text-white'
                        : sizeError
                          ? 'border-(--retro-rust)/50 text-(--retro-paper)/40 hover:border-(--retro-rust) hover:text-(--retro-cream)'
                          : 'border-(--retro-cream)/20 text-(--retro-paper)/50 hover:border-(--retro-cream)/60 hover:text-(--retro-cream)'
                      }`}
                  >
                    {size.size.name}
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
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)">
                  <span className="text-base leading-none">−</span>
                </button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-(--retro-cream)/15 font-(family-name:--font-dm-sans) text-sm text-(--retro-cream)">
                  {quantity}
                </span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} className="flex h-11 w-11 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)">
                  <span className="text-base leading-none">+</span>
                </button>
              </div>
            </div>

            {/* Add to cart — the real one, observed by IntersectionObserver */}
            <div ref={cartButtonRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-3 px-8 py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 ${added
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
                    className={`pb-3 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.25em] transition-colors border-b ${activeTab === tab
                        ? 'border-(--retro-gold) text-(--retro-gold) -mb-px'
                        : 'border-transparent text-(--retro-paper)/40 hover:text-(--retro-paper)/70'
                      }`}
                  >
                    {tab === 'details' ? 'Product details' : 'Care guide'}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                {activeTab === 'details' && product.description && (
                  <ul className="flex flex-col gap-2">
                    {product.description.split("\n").map((detail, index) => (
                      <li key={index} className="flex items-start gap-3 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/65">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-(--retro-gold)/60" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent backdrop-blur-sm sm:hidden transition-transform duration-300 ${showStickyBtn ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 ${added
              ? 'bg-(--retro-gold) text-(--retro-dark)'
              : 'bg-(--retro-terracota) text-white hover:bg-(--retro-rust)'
            }`}
        >
          {added ? '✓ Added to cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}