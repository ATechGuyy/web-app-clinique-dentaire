'use client'

import Link from 'next/link'
import { Stethoscope, Users, Calendar, CreditCard, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dental-gradient">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            DentalCare Pro
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Application professionnelle de gestion pour cliniques dentaires. 
            Gérez vos patients, rendez-vous et finances en toute simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-up"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion des Patients</h3>
            <p className="text-white/80">
              Stockez et gérez les informations de vos patients de manière sécurisée
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rendez-vous</h3>
            <p className="text-white/80">
              Planifiez et organisez vos rendez-vous avec un calendrier intuitif
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Finances</h3>
            <p className="text-white/80">
              Suivez vos recettes et dépenses pour une gestion financière optimale
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prêt à moderniser votre clinique ?
            </h2>
            <p className="text-white/80 mb-6">
              Rejoignez les professionnels qui font confiance à DentalCare Pro pour gérer leur pratique dentaire.
            </p>
            <Link
              href="/sign-up"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
