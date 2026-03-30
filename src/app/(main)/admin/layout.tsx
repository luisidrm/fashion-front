'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ArrowLeft, Folder, ChevronLeft, LogOut, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import LogoutModal from '@/components/LogOutModal'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '../account/_slice/authSlice'
import { useLogoutMutation } from '../account/_service/authApi'
import { clearAuthCookiesClient } from '@/lib/auth-cookies-client'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Categorías', icon: Folder },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/offers', label: 'Ofertas', icon: Tag },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [logoutRequest] = useLogoutMutation()

  const [collapsed, setCollapsed] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="min-h-[100vh] flex pt-[4rem]">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-16' : 'w-56'} shrink-0 border-r border-[var(--retro-gold)]/20 bg-[var(--retro-dark)] py-8 px-3 relative transition-[width] duration-300 ease-in-out overflow-hidden`}
      >
        {/* Header */}
        <div className={`flex items-center mb-6 px-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--retro-paper)]/50 whitespace-nowrap">
              Panel Admin
            </p>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1.5 text-[var(--retro-paper)]/50 hover:bg-[var(--retro-gold)]/10 hover:text-[var(--retro-gold)] transition-colors"
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-lg font-[family-name:var(--font-dm-sans)] text-sm uppercase tracking-[0.12em] transition-colors ${collapsed ? 'justify-center' : ''
                  } ${isActive
                    ? 'bg-[var(--retro-terracota)]/30 text-[var(--retro-gold)] border border-[var(--retro-gold)]/30'
                    : 'text-[var(--retro-paper)]/70 hover:text-[var(--retro-cream)] hover:bg-[var(--retro-warm)]/50'
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Back to store */}
        <div className={`bottom-4 absolute border-t border-[var(--retro-gold)]/15 pt-4 left-3 right-3`}>
          <Link
            href="/shop"
            title={collapsed ? 'Volver a tienda' : undefined}
            className={`flex items-center gap-3 px-2 py-2.5 text-[var(--retro-paper)]/70 hover:text-[var(--retro-gold)] font-[family-name:var(--font-dm-sans)] text-sm uppercase tracking-[0.12em] transition-colors rounded-lg hover:bg-[var(--retro-warm)]/50 ${collapsed ? 'justify-center' : ''
              }`}
          >
            <ArrowLeft size={18} className="shrink-0" />
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden">Volver a tienda</span>
            )}
          </Link>
          <button type="button" aria-label="Cerrar Sesión" onClick={() => setShowLogout(true)} className="flex items-center gap-3 px-2 py-2.5 text-[var(--retro-paper)]/70 hover:text-[var(--retro-gold)] font-[family-name:var(--font-dm-sans)] text-sm uppercase tracking-[0.12em] transition-colors rounded-lg hover:bg-[var(--retro-warm)]/50 ${
            collapsed ? 'justify-center' : ''
          }">
            <LogOut size={18} color='red' className="shrink-0" />
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-red-500">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 bg-[var(--retro-deep)]">
        {children}
      </div>
      {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
          onConfirm={async() => {
            await logoutRequest().unwrap().then(() => {
              clearAuthCookiesClient()
              dispatch(logout())
              setShowLogout(false)
              router.push('/')
            })
          }}
        />
      )}
    </div>
  )
}