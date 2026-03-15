"use client"

import { useAppSelector } from '@/store/hooks';
import { Menu, X } from 'lucide-react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const nav = [
  { href: '/shop', label: 'SHOP' },
  { href: '/cart', label: 'CART' },
  { href: '/contact', label: 'CONTACT' },
]


export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const user = useAppSelector((state) => state.auth) || null;

  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setOpen(false);
    router.push(href);
  }

  const initial = user ? user.user?.name?.charAt(0).toUpperCase() : "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sepia-deep/80 backdrop-blur-md border-sepia-warm/10">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <a href="/" className="font-display text-2xl font-bold text-cream tracking-wider">
          XTS
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={`${item.href}`}
              className="font-body text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {pathname !== "/account" ? (
            <button type="button"
              onClick={() => router.push("/account")}
              className="ml-6 px-4 py-2 border border-sepia-warm/30 text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm transition-colors"
            >
              Iniciar Sesion
            </button>
          ) : (
            <button type="button"
              onClick={() => router.push("/account")}
              className="ml-6 px-4 py-2 border border-sepia-warm/30 text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm transition-colors"
            >
              <div className="w-9 h-9 min-w-9 rounded-[50%] bg-sepia-warm/70 text-white grid place-items-center font-semibold text-[0.82rem]">{initial}</div>
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type='button'
          className="md:hidden text-cream"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-sepia-deep border-t border-sepia-warm/10 py-6">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={`${item.label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 font-body text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
