import Link from 'next/link'

const collectionProducts = [
  {
    slug: 'chaqueta-cuero',
    name: 'Chaqueta de cuero',
    category: 'OUTWEAR',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    price: "$ 120.00",
  },
  {
    slug: 'botas-vaqueras',
    name: 'Botas vaqueras',
    category: 'FOOTWEAR',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    price: "$ 120.00",
  },
  {
    slug: 'jersey-punto-crema',
    name: 'Jersey de punto',
    category: 'KNITWEAR',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    price: "$ 120.00",
  },
] as const

export function TheCollection() {
  return (
    <section id="collection" className="relative z-10 py-24 md:py-32 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-retro-paper/60 uppercase tracking-[0.35em] text-xs mb-4">
            New Arrivals
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-retro-cream">
            The Collection
          </h2>
          {/* Vintage ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-retro-gold/50" />
            <div className="h-1.5 w-1.5 rotate-45 bg-retro-gold/70" />
            <div className="h-px w-16 bg-retro-gold/50" />
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionProducts.map((item) => (
            <div key={item.slug} className="group cursor-pointer">
              {/* Image container */}
              <div className="relative overflow-hidden mb-5 aspect-square bg-retro-deep">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 saturate-75"
                  loading="lazy"
                />
                {/* Dark sepia overlay on hover */}
                <div className="absolute inset-0 bg-retro-black/0 group-hover:bg-retro-black/40 transition-colors duration-500" />
                {/* View details slide-up */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="block bg-retro-dark/95 border border-retro-gold/60 text-retro-gold text-center px-6 py-3 font-sans uppercase tracking-[0.2em] text-xs font-medium hover:bg-retro-gold hover:text-retro-dark transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Product info */}
              <p className="font-sans text-retro-paper/50 uppercase tracking-[0.25em] text-xs mb-2">
                {item.category}
              </p>
              <h3 className="font-serif text-xl font-semibold text-retro-cream mb-1 group-hover:text-retro-gold transition-colors">
                {item.name}
              </h3>
              <p className="font-sans text-retro-gold/90 text-sm tracking-wide">
                {item.price}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-block border border-retro-gold/60 text-retro-gold px-10 py-4 font-sans uppercase tracking-[0.2em] text-xs font-medium hover:bg-retro-gold hover:text-retro-dark transition-colors duration-300"
          >
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  )
}
