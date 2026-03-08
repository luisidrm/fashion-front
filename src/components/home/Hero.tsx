import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative z-10 min-h-[85vh] overflow-hidden">
      {/* Radial accent — the page background provides the gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_50%,rgba(139,90,60,0.2)_0%,transparent_50%)]" />
      <div className="relative z-10 flex min-h-[85vh] flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-(family-name:--font-playfair) text-4xl font-semibold leading-tight text-(--retro-cream) sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block uppercase">Wear the</span>
            <span className="text-(--retro-terracota)">Past.</span>
            <span className="block uppercase">Own the Future.</span>
          </h1>
          <p className="mt-6 max-w-xl font-(family-name:--font-dm-sans) text-base text-(--retro-paper)/95 sm:text-lg">
            Piezas curadas inspiradas en lo vintage, creadas para el alma moderna. Cada hilo cuenta una historia.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-(--retro-terracota) px-8 py-3.5 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-(--retro-rust)"
            >
              Shop collection
            </Link>
            <Link
              href="/#story"
              className="inline-flex items-center justify-center border border-(--retro-cream)/70 bg-transparent px-8 py-3.5 font-(family-name:--font-dm-sans) text-xs font-medium uppercase tracking-[0.2em] text-(--retro-cream) transition-colors hover:bg-(--retro-cream)/10"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.3em] text-(--retro-paper)/70">
          Scroll
        </span>
        <div className="mx-auto mt-1 h-6 w-px bg-(--retro-paper)/50" />
      </div>
    </section>
  )
}
