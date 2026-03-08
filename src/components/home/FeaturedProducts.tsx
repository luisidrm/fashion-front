import Image from 'next/image'
import Link from 'next/link'

// Datos de ejemplo para productos destacados (luego vendrán del backend)
const featuredProducts = [
  {
    slug: 'camisa-vintage-lino',
    name: 'Camisa vintage de lino',
    price: 49,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
  },
  {
    slug: 'vestido-midi-floral',
    name: 'Vestido midi floral',
    price: 79,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
  },
  {
    slug: 'pantalon-saco-beige',
    name: 'Pantalón de saco beige',
    price: 65,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
  },
  {
    slug: 'jersey-cachemira',
    name: 'Jersey de cachemira',
    price: 89,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  },
] as const

export function FeaturedProducts() {
  return (
    <section className="relative z-10 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-(family-name:--font-playfair) text-sm uppercase tracking-[0.2em] text-(--retro-gold)">
            Lo más vendido
          </p>
          <h2 className="mt-2 font-(family-name:--font-playfair) text-3xl font-semibold text-(--retro-cream) sm:text-4xl">
            Productos destacados
          </h2>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/shop/${product.slug}`}
                className="group block overflow-hidden rounded-sm border border-(--retro-deep)/40 bg-(--retro-warm)/60 transition hover:border-(--retro-gold)/40"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-(--retro-deep)/30">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-(family-name:--font-playfair) font-medium text-(--retro-cream) group-hover:text-(--retro-gold)">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-(--retro-gold)">
                    {product.price.toFixed(2)} €
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-sm border border-(--retro-gold) px-6 py-3 text-sm font-medium text-(--retro-gold) transition-colors hover:bg-(--retro-gold)/10"
          >
            Ver toda la tienda
          </Link>
        </div>
      </div>
    </section>
  )
}
