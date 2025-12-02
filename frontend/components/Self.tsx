'use client'

import { useEffect, useState } from 'react'
import { countries, SelfQRcodeWrapper } from '@selfxyz/qrcode'
import { SelfAppBuilder } from '@selfxyz/qrcode'
import { useConnection } from 'wagmi'

interface SelfVerificationProps {
  onVerificationSuccess: () => void
  onVerificationError?: (error: Error) => void
}

export default function SelfVerification({ 
  onVerificationSuccess, 
  onVerificationError 
}: SelfVerificationProps) {
  const [selfApp, setSelfApp] = useState<any>(null)
  const { address } = useConnection()

  useEffect(() => {
    if (!address) return

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
          // Customize these based on your requirements
          minimumAge: 18,
          nationality: true,
          gender: false,
          // Add any other required disclosures
        },
      }).build()

      setSelfApp(app)
    } catch (error) {
      console.error('Error initializing Self verification:', error)
      onVerificationError?.(error as Error)
    }
  }, [address, onVerificationError])

  const handleVerificationSuccess = () => {
    console.log('Identity verified successfully!')
    onVerificationSuccess()
  }

  const handleVerificationError = (error: Error) => {
    console.error('Verification error:', error)
    onVerificationError?.(error)
  }

  if (!selfApp) {
    return <div>Loading verification service...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="mb-4 text-xl font-semibold">Verify Your Identity</h2>
      <p className="mb-6 text-center text-gray-600">
        Scan the QR code with the Self app to verify your identity
      </p>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
        />
      </div>
    </div>
  )
}