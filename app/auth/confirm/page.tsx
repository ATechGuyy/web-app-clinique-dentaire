'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Stethoscope, CheckCircle, XCircle } from 'lucide-react'

export default function EmailConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        
        // Get the tokens from URL parameters
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const type = searchParams.get('type')
        
        if (!accessToken || !refreshToken) {
          setStatus('error')
          setMessage('Lien de confirmation invalide')
          setTimeout(() => router.push('/sign-in'), 3000)
          return
        }

        if (type === 'signup') {
          // Set the session with the tokens from email confirmation
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (error) {
            console.error('Session error:', error)
            setStatus('error')
            setMessage('Erreur lors de la confirmation de l\'email')
            setTimeout(() => router.push('/sign-in'), 3000)
          } else if (data.session) {
            setStatus('success')
            setMessage('Email confirmé avec succès ! Redirection vers le tableau de bord...')
            setTimeout(() => router.push('/dashboard'), 2000)
          } else {
            setStatus('error')
            setMessage('Impossible de créer la session')
            setTimeout(() => router.push('/sign-in'), 3000)
          }
        } else if (type === 'recovery') {
          // Handle password recovery
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (error) {
            setStatus('error')
            setMessage('Erreur lors de la récupération du mot de passe')
            setTimeout(() => router.push('/sign-in'), 3000)
          } else if (data.session) {
            setStatus('success')
            setMessage('Mot de passe récupéré ! Redirection...')
            setTimeout(() => router.push('/dashboard'), 2000)
          } else {
            setStatus('error')
            setMessage('Impossible de créer la session')
            setTimeout(() => router.push('/sign-in'), 3000)
          }
        } else {
          setStatus('error')
          setMessage('Type de confirmation non reconnu')
          setTimeout(() => router.push('/sign-in'), 3000)
        }
      } catch (err) {
        console.error('Email confirmation error:', err)
        setStatus('error')
        setMessage('Une erreur est survenue lors de la confirmation')
        setTimeout(() => router.push('/sign-in'), 3000)
      }
    }

    handleEmailConfirmation()
  }, [router, searchParams])

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
          {status === 'loading' && 'Confirmation en cours...'}
          {status === 'success' && 'Email confirmé !'}
          {status === 'error' && 'Erreur de confirmation'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {status === 'loading' && (
          <div className="text-sm text-gray-500">
            Veuillez patienter pendant que nous confirmons votre email...
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
