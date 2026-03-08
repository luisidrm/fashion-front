import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--retro-deep)]">
      <header className="border-b border-[var(--retro-gold)]/20 bg-[var(--retro-dark)] px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-playfair)] font-semibold text-[var(--retro-cream)]"
          >
            Panel admin
          </Link>
          <nav className="flex gap-4 text-sm text-[var(--retro-paper)]">
            <Link href="/admin" className="hover:text-[var(--retro-gold)]">
              Inicio
            </Link>
            <Link href="/" className="hover:text-[var(--retro-gold)]">
              Volver a tienda
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
