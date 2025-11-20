"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import WalletConnectButton from "./wallet-connect-button"
import { NetworkSwitcher } from "./network-switcher"
import { useAccount } from "wagmi"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Dashboard", path: "/dashboard", requiresAuth: true },
  { name: "My Tickets", path: "/tickets", requiresAuth: true },
  { name: "Create Event", path: "/create-event", requiresAuth: true }
]

export default function Header() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("button[aria-label='Toggle menu']")
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])

  const mobileToggle = () => setIsMobileMenuOpen((p) => !p)

  const renderLinks = (onClick?: () => void) => (
    <>
      {isConnected &&
        navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={onClick}
            className={`px-4 py-2 transition-colors rounded-lg text-sm md:text-base ${pathname === link.path
                ? "text-purple-400 bg-purple-900/30"
                : "text-slate-300 hover:bg-slate-800/50"
              }`}
          >
            {link.name}
          </Link>
        ))}

      <Link
        href="/marketplace"
        onClick={onClick}
        className={`px-4 py-2 transition-colors rounded-lg text-sm md:text-base ${pathname === "/marketplace" || pathname === "/resale-market"
            ? "text-purple-400 bg-purple-900/30"
            : "text-slate-300 hover:bg-slate-800/50"
          }`}
      >
        Marketplace
      </Link>

      <Link
        href="https://github.com/DIFoundation/Tixora/blob/main/README.md"
        target="_blank"
        onClick={onClick}
        className="px-4 py-2 transition-colors rounded-lg text-slate-300 hover:bg-slate-800/50 text-sm md:text-base"
      >
        Docs
      </Link>

      <Link
        href="/resources"
        onClick={onClick}
        className="px-4 py-2 transition-colors rounded-lg text-slate-300 hover:bg-slate-800/50 text-sm md:text-base"
      >
        Resources
      </Link>

      <Link
        href="/#how-it-works"
        onClick={onClick}
        className="px-4 py-2 transition-colors rounded-lg text-slate-300 hover:bg-slate-800/50 text-sm md:text-base"
      >
        How It Works
      </Link>
    </>
  )

  return (
    <header className="bg-slate-900/80 border-b border-purple-500/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">


          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-12 w-12">
              <Image
                src="/tixora-logo.png"
                alt="Tixora"
                width={100}
                height={100}
                className="rounded-full h-12 w-auto"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tixora
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {renderLinks()}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <NetworkSwitcher />
          </div>

          <div ref={dropdownRef} className="relative">
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-2 z-50 flex flex-col space-y-1">
                {renderLinks(() => setIsDropdownOpen(false))}
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <WalletConnectButton />
          </div>
          <button
            aria-label="Toggle menu"
            onClick={mobileToggle}
            className="md:hidden text-slate-300 hover:text-purple-400"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        ref={mobileRef}
        className={`md:hidden bg-slate-900/95 backdrop-blur-lg overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 py-4 border-t border-slate-800" : "max-h-0 py-0"
          }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {renderLinks(() => setIsMobileMenuOpen(false))}

          <div className="pt-2 space-y-2">
            <NetworkSwitcher />
            <div className="md:hidden">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
