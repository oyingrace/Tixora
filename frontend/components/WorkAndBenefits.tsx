"use client"

import { Card } from "@/components/ui/card"
import { Ticket, Shield, Zap, Globe, RefreshCw, Star, ArrowRight, Wallet, QrCode } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

export function WorkAndBenefits() {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-white" />,
      title: "Connect Your Wallet",
      description: "Link your preferred Web3 wallet to get started with Tixora. We support all major wallets like MetaMask, Coinbase Wallet, and more.",
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/30"
    },
    {
      icon: <Ticket className="h-10 w-10 text-white" />,
      title: "Browse & Purchase Tickets",
      description: "Explore upcoming events and purchase NFT tickets directly on the blockchain. Each ticket is a unique digital asset that you truly own.",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-cyan-500/30"
    },
    {
      icon: <QrCode className="h-10 w-10 text-white" />,
      title: "Attend Events",
      description: "Present your NFT ticket's QR code at the event for seamless entry. No more paper tickets or screenshots needed!",
      gradient: "from-cyan-500 to-emerald-500",
      shadow: "shadow-emerald-500/30"
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-white" />,
      title: "Trade or Resell",
      description: "Freely transfer or resell your tickets on our marketplace. Set your price or let the market decide with our auction feature.",
      gradient: "from-emerald-500 to-purple-500",
      shadow: "shadow-purple-500/30"
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl -z-10" />
      
      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-400 mb-4">
                How It Works
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get Started in Minutes
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience the future of event ticketing with our simple, secure, and transparent platform
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 bg-gradient-to-br from-slate-800/50 to-slate-800/20 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${step.gradient} ${step.shadow} shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                  <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 -mr-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-300"></div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20"
              onClick={() => document.getElementById('featured-events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Upcoming Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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