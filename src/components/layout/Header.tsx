"use client"

import { Menu, X } from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react';

const nav = [
  { href: '/shop', label: 'SHOP' },
  { href: '/cart', label: 'CART' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/account', label: 'ACCOUNT' },
]


export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sepia-deep/80 backdrop-blur-md border-sepia-warm/10">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <a href="/" className="font-display text-2xl font-bold text-cream tracking-wider">
          XTS
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {nav.map((item) => (
            <a
              key={item.label}
              href={`${item.href}`}
              className="font-body text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-md transition-colors"
            >
              {item.label}
            </a>
          ))}
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
