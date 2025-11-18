"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { WalletConnectButton } from './wallet-connect-button'
import { NetworkSwitcher } from './network-switcher'
import { useAccount } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
  { name: 'My Tickets', path: '/tickets', requiresAuth: true },
  { name: 'Create Event', path: '/create-event', requiresAuth: true }
]

function Header() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Close dropdown when navigating to a new page
  useEffect(() => {
    setIsDropdownOpen(false)
  }, [pathname])

  if (!isConnected) {
    return (
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/tixora-logo.png"
              alt="Tixora"
              width={100}
              height={100}
              className="rounded-full h-12 w-auto"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tixora
            </span>
          </Link>

          <nav className="hidden text-base md:flex items-center space-x-8">
            <Link href="https://github.com/DIFoundation/Tixora/blob/main/README.md" target='_blank' className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Docs
            </Link>
            <Link href="/resources" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Resources
            </Link>
            <Link href="/#how-it-works" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              How It Works
            </Link>
          </nav>

          <WalletConnectButton />
        </div>
      </header>
    )
  }

  // Filter navigation links based on auth status
  const filteredNavLinks = navLinks.filter(link => isConnected || !link.requiresAuth)

  // Check if any market page is active
  const isMarketActive = pathname === '/marketplace' || pathname === '/resale-market'

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  const handleDropdownLinkClick = () => {
    setIsDropdownOpen(false)
  }

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-12 w-12">
            <Image
              src="/tixora-logo.png"
              alt="Tixora"
              fill
              className="rounded-full object-contain"
              sizes="48px"
              priority
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tixora
          </span>
        </Link>

        <nav className="hidden text-base md:flex items-center space-x-8">
          {filteredNavLinks.map((link) => {
            const isActive = pathname === link.path ||
              (link.path !== '/' && pathname.startsWith(link.path))

            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${isActive
                    ? 'text-purple-400 font-medium'
                    : 'text-slate-300 hover:text-purple-400 transition-colors font-medium'
                  }`}
              >
                {link.name}
              </Link>
            )
          })}
          
          {/* Explore Market Dropdown */}
          <div 
            ref={dropdownRef}
            className="relative"
          >
            <button
              onClick={toggleDropdown}
              className={`flex items-center space-x-1 ${
                isMarketActive
                  ? 'text-purple-400 font-medium'
                  : 'text-slate-300 hover:text-purple-400 transition-colors font-medium'
              }`}
            >
              <span>Explore Market</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-purple-500/20 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/marketplace"
                  onClick={handleDropdownLinkClick}
                  className={`block px-4 py-3 ${
                    pathname === '/marketplace'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-slate-300 hover:bg-purple-500/10 hover:text-purple-400'
                  } transition-colors`}
                >
                  Ticket Market
                </Link>
                <Link
                  href="/resale-market"
                  onClick={handleDropdownLinkClick}
                  className={`block px-4 py-3 ${
                    pathname === '/resale-market'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-slate-300 hover:bg-purple-500/10 hover:text-purple-400'
                  } transition-colors`}
                >
                  Resale Market
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center space-x-3">
          <NetworkSwitcher />
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header