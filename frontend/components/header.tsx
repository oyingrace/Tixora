"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { WalletConnectButton } from './wallet-connect-button'
import { useAccount } from 'wagmi'

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
  { name: 'Marketplace', path: '/marketplace', requiresAuth: true },
  { name: 'My Tickets', path: '/tickets', requiresAuth: true },
  { name: 'Create Event', path: '/create-event', requiresAuth: true }
]

function Header() {
  const pathname = usePathname()
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/tixora-logo.png" 
              alt="Tixora" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tixora
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="https://github.com/DIFoundation/Tixora/blob/main/README.md" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Docs
            </Link>
            <Link href="/resources" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Resources
            </Link>
            <Link href="#how-it-works" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
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

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/tixora-logo.png" 
            alt="Tixora" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tixora
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {filteredNavLinks.map((link) => {
            const isActive = pathname === link.path || 
                           (link.path !== '/' && pathname.startsWith(link.path))
            
            return (
              <Link 
                key={link.path}
                href={link.path}
                className={`${
                  isActive 
                    ? 'text-purple-400 font-medium' 
                    : 'text-slate-300 hover:text-purple-400 transition-colors font-medium'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header