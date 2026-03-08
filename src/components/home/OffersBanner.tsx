import Link from 'next/link'

export function OffersBanner() {
  return (
    <section className="relative z-10 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-sm border border-[var(--retro-gold)]/30 bg-[var(--retro-warm)]/80 py-6 px-6 sm:flex-row">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--retro-cream)]">
              Ofertas de temporada
            </h2>
            <p className="mt-1 text-sm text-[var(--retro-paper)]/90">
              Hasta 30% en una selección de piezas. Por tiempo limitado.
            </p>
          </div>
          <Link
            href="/shop?offer=1"
            className="shrink-0 rounded-sm border border-[var(--retro-gold)] px-5 py-2.5 text-sm font-medium text-[var(--retro-gold)] transition-colors hover:bg-[var(--retro-gold)]/10"
          >
            Ver ofertas
          </Link>
        </div>
      </div>
    </section>
  )
}
