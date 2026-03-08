'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: connect to API or Server Action
    console.log('Subscribe:', email)
  }

  return (
    <section
      className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center py-20 border-t border-retro-gold/20"
      id="contact"
    >
      {/* Decorative background ornament */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
        <div className="h-96 w-96 rounded-full border-2 border-retro-gold" />
        <div className="absolute h-64 w-64 rounded-full border border-retro-gold" />
      </div>

      <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-retro-paper/60">
          Stay connected
        </p>
        <h2 className="mt-4 font-serif text-4xl font-semibold text-retro-cream sm:text-5xl">
          Join the Archive
        </h2>
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px w-10 bg-retro-gold/40" />
          <div className="h-1 w-1 rotate-45 bg-retro-gold/60" />
          <div className="h-px w-10 bg-retro-gold/40" />
        </div>
        <p className="mt-6 font-sans text-sm text-retro-paper/80 leading-relaxed">
          Sé el primero en conocer nuevas piezas, hallazgos vintage y ofertas exclusivas.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="min-w-0 flex-1 border border-retro-paper/30 bg-retro-black/40 px-4 py-3.5 font-sans text-sm text-retro-cream placeholder:text-retro-paper/40 focus:border-retro-gold focus:outline-none focus:ring-1 focus:ring-retro-gold"
          />
          <button
            type="submit"
            className="shrink-0 bg-retro-terracota px-8 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-retro-rust"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
