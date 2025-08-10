'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Database, Key, Globe } from 'lucide-react'

interface ConfigStatus {
  supabase: {
    url: boolean
    anonKey: boolean
    serviceKey: boolean
  }
}

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigStatus>({
    supabase: {
      url: false,
      anonKey: false,
      serviceKey: false
    }
  })
  const [dbConnection, setDbConnection] = useState<'checking' | 'success' | 'error'>('checking')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEnvironmentVariables()
    checkDatabaseConnection()
  }, [])

  const checkEnvironmentVariables = () => {
    const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    setConfig({
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        serviceKey: supabaseServiceKey
      }
    })
    setLoading(false)
  }

  const checkDatabaseConnection = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) throw error
      setDbConnection('success')
    } catch (error) {
      console.error('Database connection failed:', error)
      setDbConnection('error')
    }
  }

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getDbStatusIcon = () => {
    switch (dbConnection) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'checking':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getDbStatusText = () => {
    switch (dbConnection) {
      case 'success':
        return 'Connecté'
      case 'error':
        return 'Erreur de connexion'
      case 'checking':
        return 'Vérification...'
      default:
        return 'Inconnu'
    }
  }

  const getDbStatusColor = () => {
    switch (dbConnection) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'checking':
        return 'text-yellow-600'
      default:
        return 'text-yellow-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuration de l'Application
          </h1>
          <p className="text-lg text-gray-600">
            Vérifiez la configuration de votre environnement et de votre base de données
          </p>
        </div>

        <div className="grid gap-6">
          {/* Supabase Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Configuration Supabase</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">URL Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.supabase.url)}
                  <span className={config.supabase.url ? 'text-green-600' : 'text-red-600'}>
                    {config.supabase.url ? 'Configuré' : 'Non configuré'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Clé anonyme</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.supabase.anonKey)}
                  <span className={config.supabase.anonKey ? 'text-green-600' : 'text-red-600'}>
                    {config.supabase.anonKey ? 'Configuré' : 'Non configuré'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Clé de service</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.supabase.serviceKey)}
                  <span className={config.supabase.serviceKey ? 'text-green-600' : 'text-red-600'}>
                    {config.supabase.serviceKey ? 'Configuré' : 'Non configuré'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Connection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Connexion Base de Données</h2>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Statut de connexion</span>
              </div>
              <div className="flex items-center gap-2">
                {getDbStatusIcon()}
                <span className={getDbStatusColor()}>
                  {getDbStatusText()}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Instructions de Configuration
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>1. Assurez-vous que toutes les variables d'environnement Supabase sont configurées</p>
              <p>2. Vérifiez que votre base de données Supabase est accessible</p>
              <p>3. Exécutez le script de schéma SQL dans votre base de données</p>
              <p>4. Redémarrez votre application après avoir modifié les variables d'environnement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

