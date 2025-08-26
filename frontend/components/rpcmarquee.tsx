"use client";
import React, { useState, useEffect } from 'react';
import { X, Wifi, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const RPCMarquee = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const rpcRecommendations = [
    {
      network: "Celo Sepolia Testnet",
      rpc: "https://rpc.ankr.com/celo_sepolia",
      status: "recommended",
      description: "Stable RPC - Use for smooth interaction"
    },
    {
      network: "Celo Sepolia Testnet (Alternative)",
      rpc: "https://forno.celo-sepolia.celo-testnet.org",
      status: "alternative",
      description: "Unstable RPC - Not reliable"
    },
    {
      network: "Custom RPC",
      rpc: "Configure your own endpoint",
      status: "advanced",
      description: "For advanced users with private nodes"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rpcRecommendations.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentRPC = rpcRecommendations[currentIndex];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recommended':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'alternative':
        return <Wifi className="w-4 h-4 text-yellow-400" />;
      case 'advanced':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'border-green-500/30 bg-green-900/20';
      case 'alternative':
        return 'border-yellow-500/30 bg-yellow-900/20';
      case 'advanced':
        return 'border-blue-500/30 bg-blue-900/20';
      default:
        return 'border-gray-500/30 bg-gray-900/20';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse" />
        
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* RPC Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {getStatusIcon(currentRPC.status)}
                <span className="text-sm font-medium text-white">
                  RPC Recommendation
                </span>
              </div>

              <div className="flex items-center space-x-2 min-w-0">
                <div className={`px-3 py-1.5 rounded-full border ${getStatusColor(currentRPC.status)} backdrop-blur-sm`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-white">
                      {currentRPC.network}
                    </span>
                    <span className="text-xs text-gray-300 truncate max-w-xs">
                      {currentRPC.rpc}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block text-sm text-gray-400 truncate">
                  {currentRPC.description}
                </div>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {rpcRecommendations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* External link */}
              <button
                onClick={() => window.open(`https://chainlist.org/?search=celo&testnets=true`, '_blank')}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Learn more about Celo RPC endpoints"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ease-linear"
            style={{ width: `${((currentIndex + 1) / rpcRecommendations.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Pulsing border animation */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
    </div>
  );
};

export default RPCMarquee;