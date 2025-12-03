'use client'

import { useEffect, useState } from 'react'
import { countries, SelfQRcodeWrapper } from '@selfxyz/qrcode'
import { SelfAppBuilder } from '@selfxyz/qrcode'
import { useConnection } from 'wagmi'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type VerificationStatus = 'idle' | 'initializing' | 'ready' | 'verifying' | 'success' | 'error'

interface SelfVerificationProps {
  onVerificationSuccess: () => void
  onVerificationError?: (error: Error) => void
  className?: string
}

export default function SelfVerification({ 
  onVerificationSuccess, 
  onVerificationError,
  className = ''
}: SelfVerificationProps) {
  const [selfApp, setSelfApp] = useState<any>(null)
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useConnection()

  // Initialize Self App when wallet is connected
  useEffect(() => {
    if (!isConnected || !address) {
      setStatus('idle')
      return
    }

    const initializeSelf = async () => {
      try {
        setStatus('initializing')
        setError(null)
        
        const app = new SelfAppBuilder({
          version: 2,
          appName: process.env.NEXT_PUBLIC_APP_NAME || 'Tixora',
          scope: process.env.NEXT_PUBLIC_SELF_SCOPE || 'tixora',
          endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || '',
          logoBase64: '/tixora-logo.png',
          userId: address,
          endpointType: process.env.NODE_ENV === 'production' ? 'production' : 'staging',
          userIdType: 'hex',
          disclosures: {
            minimumAge: 18,
            nationality: true,
            gender: false,
          },
        }).build()

        setSelfApp(app)
        setStatus('ready')
      } catch (err) {
        console.error('Error initializing Self verification:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize verification service'
        setError(errorMessage)
        setStatus('error')
        onVerificationError?.(err as Error)
      }
    }

    initializeSelf()
  }, [address, isConnected, onVerificationError])

  const handleVerificationSuccess = () => {
    console.log('Identity verified successfully!')
    setStatus('success')
    onVerificationSuccess()
  }

  const handleVerificationError = (error: Error) => {
    console.error('Verification error:', error)
    setError(error.message || 'Verification failed. Please try again.')
    setStatus('error')
    onVerificationError?.(error)
  }

  const resetVerification = () => {
    setStatus('ready')
    setError(null)
  }

  if (!isConnected) {
    return (
      <div className={`text-center p-6 bg-gray-50 rounded-lg ${className}`}>
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
        <h3 className="text-lg font-medium mb-2">Wallet Not Connected</h3>
        <p className="text-gray-600 mb-4">Please connect your wallet to start the verification process.</p>
      </div>
    )
  }

  if (status === 'initializing') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Initializing verification service...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={`text-center p-6 bg-green-50 rounded-lg ${className}`}>
        <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-green-500" />
        <h3 className="text-lg font-medium mb-2">Verification Complete!</h3>
        <p className="text-gray-700">Your identity has been successfully verified.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 rounded-lg ${className}`}>
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Verification Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <Button 
              onClick={resetVerification}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Verify Your Identity</h2>
        <p className="mt-2 text-sm text-gray-600">
          Scan the QR code with the Self app to verify your identity
        </p>
      </div>
      
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        {status === 'ready' && selfApp ? (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded border border-gray-200">
              <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
                onLoad={() => setStatus('verifying')}
              />
            </div>
            <p className="text-xs text-center text-gray-500">
              Don&apos;t have the Self app? Download it from your app store.
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 space-y-2">
        <p>• We use Self Protocol to verify your identity securely.</p>
        <p>• Your personal information is encrypted and never stored on our servers.</p>
        <p>• This process helps us prevent fraud and ensure a safe community.</p>
      </div>
    </div>
  )
}