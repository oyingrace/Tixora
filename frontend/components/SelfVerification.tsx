// components/SelfVerification.tsx
'use client'

import { useEffect, useState } from 'react'
import { SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode'
import { useConnection } from 'wagmi'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type VerificationStatus = 'idle' | 'initializing' | 'ready' | 'verifying' | 'success' | 'error'

interface SelfVerificationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerificationSuccess: () => void
  onVerificationError?: (error: Error) => void
}

export default function SelfVerification({ 
  open,
  onOpenChange,
  onVerificationSuccess, 
  onVerificationError,
}: SelfVerificationProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selfApp, setSelfApp] = useState<any>(null)
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useConnection()

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (open) {
      setStatus('initializing')
      setError(null)
    } else {
      setStatus('idle')
    }
  }, [open])

  // Initialize Self App when modal is opened
  useEffect(() => {
    if (!open || !isConnected || !address) return

    const initializeSelf = async () => {
      try {
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
  }, [open, address, isConnected, onVerificationError])

  const handleVerificationSuccess = () => {
    console.log('Identity verified successfully!')
    setStatus('success')
    // Wait a moment to show success state before closing
    setTimeout(() => {
      onVerificationSuccess()
      onOpenChange(false)
    }, 1500)
  }

  const handleVerificationError = (error: Error) => {
    console.error('Verification error:', error)
    setError(error.message || 'Verification failed. Please try again.')
    setStatus('error')
    onVerificationError?.(error)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {status === 'initializing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p>Initializing verification service...</p>
            </div>
          )}

          {status === 'ready' && selfApp && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-4">
                <p>Scan the QR code with the Self app to verify your identity</p>
              </div>
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
          )}

          {status === 'verifying' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p>Waiting for verification...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">Verification Complete!</h3>
              <p className="text-gray-700">Your identity has been successfully verified.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Verification Error</h3>
                  <p className="text-red-700 mt-1">{error || 'An unknown error occurred'}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => {
                    setStatus('initializing')
                    setError(null)
                  }}
                  variant="outline" 
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}