'use client'

import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeItem, updateQuantity } from './_slices/cartSlice'
import { HomeBackground } from '../../../components/home/HomeBackground'
import { Trash } from 'lucide-react'
import Image from 'next/image'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(state => state.cart.items)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 150 ? 0 : 12
  const total = subtotal + shipping

  return (
    <div className="relative min-h-screen">
      <HomeBackground />
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16"/>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-12 border-b border-(--retro-cream)/10 pb-8">
          <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.35em] text-(--retro-accent)">
            Your Selection
          </p>
          <h1 className="mt-2 font-(family-name:--font-playfair) text-4xl font-semibold text-(--retro-cream) sm:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-2 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/50">
            {items.length === 0
              ? 'Your cart is empty'
              : `${items.reduce((s, i) => s + i.quantity, 0)} pieces curated`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 text-6xl opacity-20">◎</div>
            <p className="font-(family-name:--font-playfair) text-2xl text-(--retro-cream)/60">
              Nothing here yet
            </p>
            <p className="mt-2 font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/40">
              Explore our collection and find your piece
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center justify-center bg-(--retro-terracota) px-8 py-3.5 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-(--retro-rust)"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

            {/* Items */}
            <div className="flex flex-col gap-px">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="group flex gap-5 border-b border-(--retro-cream)/8 py-7 transition-colors hover:bg-(--retro-cream)/2 sm:gap-7"
                >
                  {/* Image */}
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden sm:h-40 sm:w-28 rounded-lg">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-center transition-transform duration-700 group-hover:scale-105 bg-transparent "
                      height={300}
                      width={300}
                    />
                    <div className="absolute inset-0 bg-(--retro-dark)/10" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-(family-name:--font-playfair) text-lg font-medium text-(--retro-cream)">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 font-(family-name:--font-dm-sans) text-xs text-(--retro-paper)/50">
                          {item.variant}
                        </p>
                        <div className="mt-2 inline-flex items-center border border-(--retro-cream)/15 px-2 py-0.5">
                          <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/60">
                            Size {item.size}
                          </span>
                        </div>
                      </div>

                      <button
                        type='button'
                        onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
                        className="mt-0.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/30 transition-colors hover:text-(--retro-rust)"
                      >
                        <Trash/>
                      </button>
                    </div>

                    {/* Qty + Price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-(--retro-cream)/15">
                        <button
                        type='button'
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 }))
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)"
                        >
                          <span className="text-sm leading-none">−</span>
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center border-x border-(--retro-cream)/15 font-(family-name:--font-dm-sans) text-xs text-(--retro-cream)">
                          {item.quantity}
                        </span>
                        <button
                        type='button'
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))
                          }
                          className="flex h-8 w-8 items-center justify-center text-(--retro-paper)/60 transition-colors hover:bg-(--retro-cream)/8 hover:text-(--retro-cream)"
                        >
                          <span className="text-sm leading-none">+</span>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-(family-name:--font-playfair) text-lg text-(--retro-cream)">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="font-(family-name:--font-dm-sans) text-[11px] text-(--retro-paper)/40">
                            €{item.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="border border-(--retro-cream)/10 bg-(--retro-dark)/40 p-8 backdrop-blur-sm">
                <p className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.3em] text-(--retro-accent)">
                  Order Summary
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60">Subtotal</span>
                    <span className="font-(family-name:--font-dm-sans) text-sm text-(--retro-cream)">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-(family-name:--font-dm-sans) text-sm text-(--retro-paper)/60">Shipping</span>
                    <span className="font-(family-name:--font-dm-sans) text-sm text-(--retro-cream)">
                      {shipping === 0
                        ? <span className="text-(--retro-gold)">Free</span>
                        : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-(family-name:--font-dm-sans) text-[11px] text-(--retro-paper)/35">
                      Free shipping on orders over €150
                    </p>
                  )}
                  <div className="my-3 border-t border-(--retro-cream)/10" />
                  <div className="flex justify-between">
                    <span className="font-(family-name:--font-playfair) text-lg text-(--retro-cream)">Total</span>
                    <span className="font-(family-name:--font-playfair) text-xl text-(--retro-cream)">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 flex w-full items-center justify-center gap-3 bg-(--retro-terracota) px-6 py-4 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.25em] text-white transition-colors hover:bg-(--retro-rust)"
                >
                  Proceed to Checkout
                  <span className="text-base leading-none opacity-70">→</span>
                </Link>

                <p className="mt-4 text-center font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.2em] text-(--retro-paper)/30">
                  Secure checkout · Free returns
                </p>

                <div className="my-6 border-t border-(--retro-cream)/8" />

                <div className="flex items-center justify-center gap-3 opacity-30">
                  {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(brand => (
                    <span key={brand} className="font-(family-name:--font-dm-sans) text-[9px] uppercase tracking-widest text-(--retro-paper)">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-l-2 border-(--retro-accent)/40 pl-4">
                <p className="font-body text-sm italic text-(--retro-paper)/40">
                  "Each piece is made in limited runs — once it's gone, it's gone."
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}