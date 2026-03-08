import Link from 'next/link'

const shopLinks = [
  { href: '/shop', label: 'New Arrivals' },
  { href: '/shop?cat=outerwear', label: 'Outerwear' },
  { href: '/shop?cat=knitwear', label: 'Knitwear' },
  { href: '/shop?cat=footwear', label: 'Footwear' },
] as const

const companyLinks = [
  { href: '/#story', label: 'Our Story' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/careers', label: 'Careers' },
  { href: '/press', label: 'Press' },
] as const

const helpLinks = [
  { href: '/size-guide', label: 'Size Guide' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/returns', label: 'Returns' },
  { href: '/#contact', label: 'Contact' },
] as const

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-(--retro-deep)/60 bg-(--retro-dark)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-serif text-xl font-semibold uppercase tracking-wide text-(--retro-cream)">
              XTS
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-(--retro-paper)/90">
              Vintage-inspired clothing for the modern soul. Crafted with care since 1974.
            </p>
          </div>
          {/* Shop */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-(--retro-cream)">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map(({ href, label }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-(--retro-paper)/90 transition-colors hover:text-(--retro-cream)"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-(--retro-cream)">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map(({ href, label }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-(--retro-paper)/90 transition-colors hover:text-(--retro-cream)"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Help */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-(--retro-cream)">
              Help
            </h3>
            <ul className="mt-4 space-y-3">
              {helpLinks.map(({ href, label }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-(--retro-paper)/90 transition-colors hover:text-(--retro-cream)"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-(--retro-deep)/50 pt-8 text-center">
          <p className="font-sans text-xs text-(--retro-paper)/70">
            © {new Date().getFullYear()} HERITAGE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
