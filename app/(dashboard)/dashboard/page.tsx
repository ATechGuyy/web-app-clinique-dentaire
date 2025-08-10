'use client'

import { useState, useEffect } from 'react'
import { dashboardApi, patientApi, rendezvousApi, financeApi } from '@/lib/api'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Printer,
  FileText,
  CreditCard
} from 'lucide-react'

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlyRevenue: number
  attendanceRate: number
  patientGrowth: number
  revenueGrowth: number
  appointmentGrowth: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    patientGrowth: 0,
    revenueGrowth: 0,
    appointmentGrowth: 0
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get dashboard stats
      const dashboardStats = await dashboardApi.getStats()
      setStats(dashboardStats)

      // Get upcoming appointments (next 7 days)
      const allAppointments = await rendezvousApi.getAll()
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const upcoming = allAppointments
        .filter(apt => {
          const aptDate = new Date(apt.date_rdv)
          return aptDate >= today && aptDate <= nextWeek && apt.statut !== 'annulé'
        })
        .sort((a, b) => new Date(a.date_rdv).getTime() - new Date(b.date_rdv).getTime())
        .slice(0, 5)

      setUpcomingAppointments(upcoming)

      // Get recent activities (last 5 patients, appointments, and transactions)
      const patients = await patientApi.getAll()
      const finances = await financeApi.getAll()
      
      const activities = [
        ...patients.slice(0, 3).map(p => ({
          type: 'patient',
          title: `Nouveau patient: ${p.prenom} ${p.nom}`,
          date: p.created_at,
          icon: Users
        })),
        ...finances.slice(0, 2).map(f => ({
          type: 'finance',
          title: `${f.type === 'revenue' ? 'Revenu' : 'Dépense'}: ${f.montant}€`,
          date: f.date_transaction,
          icon: DollarSign
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    // TODO: Implement receipt printing
    console.log('Impression reçu')
  }

  const handlePrintAppointmentCard = () => {
    // TODO: Implement appointment card printing
    console.log('Impression carte rendez-vous')
  }

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log('Génération rapport')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const formatGrowth = (growth: number) => {
    if (growth === 0) return '0%'
    const sign = growth > 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePrintReceipt}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Impression reçu 🧾</span>
          </button>
          <button
            onClick={handlePrintAppointmentCard}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Impression carte rendez-vous</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Rapport</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          {stats.patientGrowth !== 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {getGrowthIcon(stats.patientGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(stats.patientGrowth)}`}>
                {formatGrowth(stats.patientGrowth)} vs mois dernier
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rendez-vous Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          {stats.appointmentGrowth !== 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {getGrowthIcon(stats.appointmentGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(stats.appointmentGrowth)}`}>
                {formatGrowth(stats.appointmentGrowth)} vs mois dernier
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus du Mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue}€</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
          {stats.revenueGrowth !== 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {getGrowthIcon(stats.revenueGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(stats.revenueGrowth)}`}>
                {formatGrowth(stats.revenueGrowth)} vs mois dernier
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Présence</p>
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prochains Rendez-vous</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patient?.prenom} {appointment.patient?.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date_rdv).toLocaleDateString('fr-FR')} à {appointment.heure}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
                    appointment.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.statut}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun rendez-vous à venir</p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activités Récentes</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
          )}
        </div>
      </div>
    </div>
  )
}
