'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Stethoscope, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage('Erreur lors de l\'authentification')
          setTimeout(() => router.push('/sign-in'), 3000)
        } else if (data.session) {
          setStatus('success')
          setMessage('Connexion réussie ! Redirection...')
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('error')
          setMessage('Aucune session trouvée')
          setTimeout(() => router.push('/sign-in'), 3000)
        }
      } catch (err) {
        setStatus('error')
        setMessage('Une erreur est survenue')
        setTimeout(() => router.push('/sign-in'), 3000)
      }
    }

    handleCallback()
  }, [router])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />
      default:
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-primary-600'
    }
  }

  return (
    <div className="min-h-screen bg-dental-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6">
          <Stethoscope className="h-8 w-8 text-primary-600" />
        </div>
        
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Authentification en cours...'}
          {status === 'success' && 'Connexion réussie !'}
          {status === 'error' && 'Erreur d\'authentification'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {status === 'loading' && (
          <div className="text-sm text-gray-500">
            Veuillez patienter pendant que nous finalisons votre connexion...
          </div>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour à la connexion
          </button>
        )}
      </motion.div>
    </div>
  )
}
