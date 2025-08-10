'use client'

import { useState, useEffect } from 'react'
import { rendezvousApi, patientApi, Patient, RendezVous } from '@/lib/api'
import { Plus, Calendar, Clock, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface AppointmentModalProps {
  appointment?: RendezVous | null
  patients: Patient[]
  onClose: () => void
  onSave: (appointment: Omit<RendezVous, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
}

function AppointmentModal({ appointment, patients, onClose, onSave }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patient_id: appointment?.patient_id || '',
    date_rdv: appointment?.date_rdv || '',
    heure: appointment?.heure || '',
    duree: appointment?.duree || 30,
    type_consultation: appointment?.type_consultation || '',
    statut: appointment?.statut || 'en attente',
    notes: appointment?.notes || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              required
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.prenom} {patient.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date_rdv}
                onChange={(e) => setFormData({ ...formData, date_rdv: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure *
              </label>
              <input
                type="time"
                required
                value={formData.heure}
                onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (minutes) *
              </label>
              <select
                required
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={90}>1h30</option>
                <option value={120}>2 heures</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select
                required
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en attente">En attente</option>
                <option value="confirmé">Confirmé</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
                <option value="reporté">Reporté</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de consultation *
            </label>
            <select
              required
              value={formData.type_consultation}
              onChange={(e) => setFormData({ ...formData, type_consultation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="consultation">Consultation</option>
              <option value="nettoyage">Nettoyage</option>
              <option value="détartrage">Détartrage</option>
              <option value="cavité">Cavité</option>
              <option value="extraction">Extraction</option>
              <option value="couronne">Couronne</option>
              <option value="implant">Implant</option>
              <option value="urgence">Urgence</option>
              <option value="contrôle">Contrôle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Informations supplémentaires sur le rendez-vous..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RendezVousPage() {
  const [appointments, setAppointments] = useState<(RendezVous & { patient: Patient })[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<RendezVous | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [appointmentsData, patientsData] = await Promise.all([
        rendezvousApi.getAll(),
        patientApi.getAll()
      ])
      
      // Enrich appointments with patient data
      const enrichedAppointments = appointmentsData.map(appointment => {
        const patient = patientsData.find(p => p.id === appointment.patient_id)
        return { ...appointment, patient: patient || {} as Patient }
      })
      
      setAppointments(enrichedAppointments)
      setPatients(patientsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAppointment = async (appointmentData: Omit<RendezVous, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAppointment = await rendezvousApi.create(appointmentData)
      if (newAppointment) {
        await loadData()
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const handleUpdateAppointment = async (appointmentData: Omit<RendezVous, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!selectedAppointment) return
    try {
      const updatedAppointment = await rendezvousApi.update(selectedAppointment.id, appointmentData)
      if (updatedAppointment) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        const success = await rendezvousApi.delete(appointmentId)
        if (success) {
          await loadData()
        }
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const success = await rendezvousApi.update(appointmentId, { statut: newStatus })
      if (success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const openEditModal = (appointment: RendezVous) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const openCreateModal = () => {
    setSelectedAppointment(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAppointment(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmé': return 'bg-green-100 text-green-800'
      case 'en attente': return 'bg-yellow-100 text-yellow-800'
      case 'terminé': return 'bg-blue-100 text-blue-800'
      case 'annulé': return 'bg-red-100 text-red-800'
      case 'reporté': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmé': return <CheckCircle className="w-4 h-4" />
      case 'annulé': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredAppointments = appointments.filter(appointment => 
    appointment.date_rdv === selectedDate
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments
                  .sort((a, b) => a.heure.localeCompare(b.heure))
                  .map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.heure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient?.prenom} {appointment.patient?.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.patient?.telephone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.type_consultation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.duree} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.statut)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.statut)}`}>
                            {appointment.statut}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {appointment.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(appointment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Aucun rendez-vous pour cette date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Status Updates */}
      {filteredAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mise à jour rapide des statuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">
                    {appointment.heure} - {appointment.patient?.prenom} {appointment.patient?.nom}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.statut)}`}>
                    {appointment.statut}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {['en attente', 'confirmé', 'terminé', 'annulé'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(appointment.id, status)}
                      disabled={appointment.statut === status}
                      className={`px-2 py-1 text-xs rounded ${
                        appointment.statut === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          patients={patients}
          onClose={closeModal}
          onSave={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
        />
      )}
    </div>
  )
}
