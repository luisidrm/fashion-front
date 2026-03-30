"use client"

import { useAppSelector } from '@/store/hooks';
import { Menu, X } from 'lucide-react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const nav = [
  { href: '/shop', label: 'SHOP' },
  { href: '/cart', label: 'CART' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const user = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (href: string) => {
    setOpen(false);
    router.push(href);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const initial = user ? user.user?.name?.charAt(0).toUpperCase() : "?";

  return (
    <nav id='main-header' className="fixed top-0 left-0 right-0 z-50 bg-sepia-deep/80 backdrop-blur-md border-sepia-warm/10">
      <div className="container mx-auto px-3 md:px-12 flex items-center justify-between h-16">
        <a href="/" className="font-display text-2xl font-bold text-cream tracking-wider">
          XTS
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user.user?.isAdmin && <Link
            href={"/admin"}
            className="font-body text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-md transition-colors"
          >
            Dashboard
          </Link>}
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-body text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {pathname !== "/account" && !user.isAuthenticated && (
            <button type="button"
              onClick={() => router.push("/account")}
              className="ml-6 px-4 py-2 border border-sepia-warm/70 text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm rounded-full transition-colors"
            >
              Iniciar Sesion
            </button>
          )}
          {pathname !== "/account" && user.isAuthenticated && (
            <button type="button"
              onClick={() => router.push("/account")}
              className="ml-6 px-4 py-2 border border-[#56422D] bg-[#322417] text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm rounded-full transition-colors"
            >
              <div className="w-8 h-8 min-w-8 rounded-[50%] bg-sepia-warm/70 text-retro-gold grid place-items-center font-display font-semibold text-2xl">{initial}</div>
            </button>
          )}
        </div>

        {/* Mobile toggle + dropdown */}
        <div ref={menuRef} className="relative md:hidden items-center">
          <button
            type='button'
            className="text-cream place-self-center place-content-center"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} className='text-retro-gold' /> : <Menu size={24} className='text-retro-gold' />}
          </button>

          <button type="button"
            onClick={() => router.push("/account")}
            className="ml-6 px-4 py-2 border border-[#56422D] bg-[#322417] text-sepia-warm/70 hover:text-cream uppercase tracking-widest text-sm rounded-full transition-colors"
          >
            <div className="w-8 h-8 min-w-8 rounded-[50%] bg-sepia-warm/70 text-retro-gold grid place-items-center font-display font-semibold text-2xl">{initial}</div>
          </button>

          {open && (
            <div className="absolute right-0 top-10 bg-[#1e140a] border border-sepia-warm/20 rounded-lg shadow-lg overflow-hidden min-w-35">
              <Link
                href={"/admin"}
                className="block px-5 py-3 font-body text-sepia-warm/70 hover:text-cream hover:bg-sepia-warm/10 uppercase tracking-widest text-xs transition-colors"
              >
                Dashboard
              </Link>
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 font-body text-sepia-warm/70 hover:text-cream hover:bg-sepia-warm/10 uppercase tracking-widest text-xs transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}