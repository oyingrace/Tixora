"use client"

import { Card } from "@/components/ui/card"
import { Ticket, Shield, Zap, Globe, RefreshCw, Star } from "lucide-react"

export function WorkAndBenefits() {
  return (
    <div>
      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-15 bg-card/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to secure, verifiable event tickets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow shadow-xl shadow-purple-500/30">
                  <Ticket className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Buy NFT Tickets</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your wallet and purchase authentic NFT tickets directly from event organizers. Each ticket is
                unique and stored on the blockchain.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow animate-delay-200 shadow-xl shadow-cyan-500/30">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Store Securely</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your tickets are safely stored in your crypto wallet. No more lost tickets or worrying about screenshots
                - your ownership is cryptographically verified.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow animate-delay-400 shadow-xl shadow-purple-500/30">
                  <Globe className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Use & Trade</h3>
              <p className="text-muted-foreground leading-relaxed">
                Present your QR code at the event for instant verification. Transfer or resell your tickets anytime with
                full transparency and zero fraud risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Why Choose Tixora?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary features that make event ticketing better for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-4 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20">
              <Shield className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-pulse-glow" />
              <h3 className="text-xl font-semibold mb-4 text-white">100% Secure</h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                Blockchain-verified authenticity eliminates all counterfeiting risks
              </p>
            </Card>

            <Card className="text-center p-4 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20">
              <Zap className="h-16 w-16 text-cyan-400 mx-auto mb-6 animate-pulse-glow animate-delay-200" />
              <h3 className="text-xl font-semibold mb-4 text-white">Zero Fees</h3>
              <p className="text-sm text-cyan-200 leading-relaxed">
                No platform fees - organizers keep 100% of ticket sales revenue
              </p>
            </Card>

            <Card className="text-center p-4 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-900/40 to-cyan-900/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20">
              <RefreshCw className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-pulse-glow animate-delay-400" />
              <h3 className="text-xl font-semibold mb-4 text-white">Free Trading</h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                Transfer and resell tickets freely with transparent pricing
              </p>
            </Card>

            <Card className="text-center p-4 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-cyan-900/40 to-purple-900/20 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/20">
              <Star className="h-16 w-16 text-cyan-400 mx-auto mb-6 animate-pulse-glow animate-delay-600" />
              <h3 className="text-xl font-semibold mb-4 text-white">Own Forever</h3>
              <p className="text-sm text-cyan-200 leading-relaxed">
                Keep your tickets as collectible NFTs with permanent ownership
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}