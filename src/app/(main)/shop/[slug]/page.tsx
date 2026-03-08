type Props = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--retro-cream)]">
        Producto: {slug}
      </h1>
      <p className="mt-2 text-[var(--retro-paper)]/90">
        Detalle con galería y temporizador de oferta (próximamente).
      </p>
    </div>
  )
}
