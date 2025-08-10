'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Clock,
  LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Get user profile from our users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUserProfile(profile)
          setProfileData({
            nom: profile.first_name || '',
            prenom: profile.last_name || '',
            email: session.user.email || '',
            telephone: profile.phone || '',
            specialite: profile.role || 'Dentiste généraliste',
            bio: profile.clinic_name || 'Clinique dentaire'
          })
        }
      }
    }

    getUser()
  }, [])

  // Profile settings
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: 'Dentiste généraliste',
    bio: 'Clinique dentaire'
  })

  // Clinic settings
  const [clinicData, setClinicData] = useState({
    nom_clinique: 'Clinique Dentaire Pro',
    adresse: '123 Rue de la Santé, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@cliniquedentairepro.fr',
    horaires_ouverture: '08:00',
    horaires_fermeture: '18:00',
    jours_ouverture: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_rdv: true,
    email_rappels: true,
    email_paiements: true,
    sms_rdv: false,
    sms_rappels: true,
    notifications_push: true
  })

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'clinic', name: 'Clinique', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'appearance', name: 'Apparence', icon: Palette }
  ]

  const handleSave = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Update user profile in our users table
      const { error } = await supabase
        .from('users')
        .update({
          first_name: profileData.nom,
          last_name: profileData.prenom,
          phone: profileData.telephone,
          role: profileData.specialite,
          clinic_name: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Show success message
      alert('Paramètres sauvegardés avec succès!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {profileData.prenom[0]}{profileData.nom[0]}
                  </span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Photo de profil</h3>
                <p className="text-sm text-gray-600">Cliquez sur l'icône pour changer votre photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profileData.prenom}
                  onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={profileData.nom}
                  onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  className="input-field"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'email est géré par votre compte Supabase
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <select
                value={profileData.specialite}
                onChange={(e) => setProfileData({ ...profileData, specialite: e.target.value })}
                className="input-field"
              >
                <option>Dentiste généraliste</option>
                <option>Orthodontiste</option>
                <option>Parodontiste</option>
                <option>Endodontiste</option>
                <option>Chirurgien oral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie
              </label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="input-field resize-none"
                placeholder="Décrivez votre expérience et vos spécialités..."
              />
            </div>
          </div>
        )

      case 'clinic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la clinique
              </label>
              <input
                type="text"
                value={clinicData.nom_clinique}
                onChange={(e) => setClinicData({ ...clinicData, nom_clinique: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  rows={2}
                  value={clinicData.adresse}
                  onChange={(e) => setClinicData({ ...clinicData, adresse: e.target.value })}
                  className="input-field pl-10 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={clinicData.telephone}
                    onChange={(e) => setClinicData({ ...clinicData, telephone: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure d'ouverture
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={clinicData.horaires_ouverture}
                    onChange={(e) => setClinicData({ ...clinicData, horaires_ouverture: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fermeture
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={clinicData.horaires_fermeture}
                    onChange={(e) => setClinicData({ ...clinicData, horaires_fermeture: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jours d'ouverture
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map(jour => (
                  <label key={jour} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={clinicData.jours_ouverture.includes(jour)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setClinicData({
                            ...clinicData,
                            jours_ouverture: [...clinicData.jours_ouverture, jour]
                          })
                        } else {
                          setClinicData({
                            ...clinicData,
                            jours_ouverture: clinicData.jours_ouverture.filter(j => j !== jour)
                          })
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{jour}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications Email</h3>
              <div className="space-y-4">
                {[
                  { key: 'email_rdv', label: 'Nouveaux rendez-vous', desc: 'Recevoir un email lors de la création d\'un nouveau rendez-vous' },
                  { key: 'email_rappels', label: 'Rappels de rendez-vous', desc: 'Recevoir des rappels par email avant les rendez-vous' },
                  { key: 'email_paiements', label: 'Notifications de paiement', desc: 'Recevoir un email lors des paiements reçus' }
                ].map(item => (
                  <div key={item.key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: e.target.checked
                      })}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications SMS</h3>
              <div className="space-y-4">
                {[
                  { key: 'sms_rdv', label: 'Nouveaux rendez-vous', desc: 'Recevoir un SMS lors de la création d\'un nouveau rendez-vous' },
                  { key: 'sms_rappels', label: 'Rappels de rendez-vous', desc: 'Recevoir des rappels par SMS avant les rendez-vous' }
                ].map(item => (
                  <div key={item.key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: e.target.checked
                      })}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications Push</h3>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifications_push}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    notifications_push: e.target.checked
                  })}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Notifications dans le navigateur</p>
                  <p className="text-sm text-gray-600">Recevoir des notifications push dans votre navigateur</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Sécurité du compte</h3>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                La sécurité de votre compte est gérée par Supabase. Vous pouvez modifier votre mot de passe depuis votre profil Supabase.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Mot de passe</h4>
                  <p className="text-sm text-gray-600">Géré par Supabase Auth</p>
                </div>
                <button className="btn-secondary" disabled>
                  Modifier
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sessions actives</h4>
                  <p className="text-sm text-gray-600">Gérez vos sessions de connexion</p>
                </div>
                <button className="btn-secondary" disabled>
                  Voir les sessions
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Se déconnecter</h4>
                  <p className="text-sm text-red-700">Fermer votre session actuelle</p>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'light', name: 'Clair', preview: 'bg-white border-2' },
                  { id: 'dark', name: 'Sombre', preview: 'bg-gray-900 border-2' },
                  { id: 'auto', name: 'Automatique', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' }
                ].map(theme => (
                  <div key={theme.id} className="relative">
                    <input
                      type="radio"
                      id={theme.id}
                      name="theme"
                      defaultChecked={theme.id === 'light'}
                      className="sr-only"
                    />
                    <label
                      htmlFor={theme.id}
                      className="block cursor-pointer rounded-lg border-2 border-gray-200 p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className={`w-full h-20 rounded-md ${theme.preview} mb-3`}></div>
                      <p className="font-medium text-gray-900">{theme.name}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Couleur d'accent</h3>
              <div className="grid grid-cols-6 gap-3">
                {[
                  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
                  'bg-red-500', 'bg-yellow-500', 'bg-pink-500'
                ].map((color, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-lg ${color} hover:scale-110 transition-transform ${
                      index === 0 ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Langue</h3>
              <select className="input-field w-auto">
                <option>Français</option>
                <option>English</option>
                <option>Español</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            {renderTabContent()}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
