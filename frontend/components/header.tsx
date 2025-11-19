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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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

        <nav className="hidden text-base md:flex items-center space-x-8">
          {isConnected && (
            <>
              <Link 
                href="/dashboard" 
                className={`text-slate-300 hover:text-purple-400 transition-colors font-medium ${
                  pathname === '/dashboard' ? 'text-purple-400' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/tickets" 
                className={`text-slate-300 hover:text-purple-400 transition-colors font-medium ${
                  pathname === '/tickets' ? 'text-purple-400' : ''
                }`}
              >
                My Tickets
              </Link>
              <Link 
                href="/create-event" 
                className={`text-slate-300 hover:text-purple-400 transition-colors font-medium ${
                  pathname === '/create-event' ? 'text-purple-400' : ''
                }`}
              >
                Create Event
              </Link>
            </>
          )}
          <Link 
            href="/marketplace" 
            className={`text-slate-300 hover:text-purple-400 transition-colors font-medium ${
              isMarketActive ? 'text-purple-400' : ''
            }`}
          >
            Marketplace
          </Link>
          <Link 
            href="https://github.com/DIFoundation/Tixora/blob/main/README.md" 
            target="_blank" 
            className="text-slate-300 hover:text-purple-400 transition-colors font-medium"
          >
            Docs
          </Link>
          <Link 
            href="/resources" 
            className="text-slate-300 hover:text-purple-400 transition-colors font-medium"
          >
            Resources
          </Link>
          <Link 
            href="/#how-it-works" 
            className="text-slate-300 hover:text-purple-400 transition-colors font-medium"
          >
            How It Works
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <NetworkSwitcher />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-slate-300 hover:text-purple-400 transition-colors"
            >
              <span className="hidden md:inline">Menu</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                isDropdownOpen ? 'transform rotate-180' : ''
              }`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50">
                {isConnected && (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      onClick={handleDropdownLinkClick}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tickets"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      onClick={handleDropdownLinkClick}
                    >
                      My Tickets
                    </Link>
                    <Link
                      href="/create-event"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      onClick={handleDropdownLinkClick}
                    >
                      Create Event
                    </Link>
                  </>
                )}
                <Link
                  href="/marketplace"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  onClick={handleDropdownLinkClick}
                >
                  Marketplace
                </Link>
                <Link
                  href="https://github.com/DIFoundation/Tixora/blob/main/README.md"
                  target="_blank"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  onClick={handleDropdownLinkClick}
                >
                  Docs
                </Link>
                <Link
                  href="/resources"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  onClick={handleDropdownLinkClick}
                >
                  Resources
                </Link>
                <Link
                  href="/#how-it-works"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                  onClick={handleDropdownLinkClick}
                >
                  How It Works
                </Link>
              </div>
            )}
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header