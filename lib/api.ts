import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

// Types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  clinic_name: string
  role: string
  phone: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  user_id: string
  nom: string
  prenom: string
  date_naissance: string
  telephone: string
  email: string
  adresse: string
  antecedents_medicaux: string
  allergies: string
  notes: string
  created_at: string
  updated_at: string
}

export interface RendezVous {
  id: string
  user_id: string
  patient_id: string
  date_rdv: string
  heure: string
  duree: number
  type_consultation: string
  statut: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Finance {
  id: string
  user_id: string
  type: string
  montant: number
  description: string
  date_transaction: string
  mode_paiement: string
  reference: string
  created_at: string
  updated_at: string
}

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return session.user.id
}

// User API
export const userApi = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }
}

// Patient API
export const patientApi = {
  async getAll(): Promise<Patient[]> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting patients:', error)
      return []
    }
  },

  async getById(id: string): Promise<Patient | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting patient:', error)
      return null
    }
  },

  async create(patient: Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Patient | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patient, user_id: userId }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating patient:', error)
      return null
    }
  },

  async update(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating patient:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId()
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting patient:', error)
      return false
    }
  }
}

// Rendez-vous API
export const rendezvousApi = {
  async getAll(): Promise<RendezVous[]> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('rendezvous')
        .select('*')
        .eq('user_id', userId)
        .order('date_rdv', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting appointments:', error)
      return []
    }
  },

  async getById(id: string): Promise<RendezVous | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('rendezvous')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting appointment:', error)
      return null
    }
  },

  async create(rendezvous: Omit<RendezVous, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<RendezVous | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('rendezvous')
        .insert([{ ...rendezvous, user_id: userId }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating appointment:', error)
      return null
    }
  },

  async update(id: string, updates: Partial<RendezVous>): Promise<RendezVous | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('rendezvous')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating appointment:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId()
      const { error } = await supabase
        .from('rendezvous')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting appointment:', error)
      return false
    }
  }
}

// Finance API
export const financeApi = {
  async getAll(): Promise<Finance[]> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('user_id', userId)
        .order('date_transaction', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting finances:', error)
      return []
    }
  },

  async getById(id: string): Promise<Finance | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting finance:', error)
      return null
    }
  },

  async create(finance: Omit<Finance, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Finance | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('finances')
        .insert([{ ...finance, user_id: userId }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating finance:', error)
      return null
    }
  },

  async update(id: string, updates: Partial<Finance>): Promise<Finance | null> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('finances')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating finance:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId()
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting finance:', error)
      return false
    }
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Finance[]> {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('user_id', userId)
        .gte('date_transaction', startDate)
        .lte('date_transaction', endDate)
        .order('date_transaction', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting finances by date range:', error)
      return []
    }
  }
}

// Dashboard API
export const dashboardApi = {
  async getStats(): Promise<{
    totalPatients: number
    todayAppointments: number
    monthlyRevenue: number
    attendanceRate: number
    patientGrowth: number
    revenueGrowth: number
    appointmentGrowth: number
  }> {
    try {
      const userId = await getCurrentUserId()
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

      // Get current month stats
      const { data: currentPatients, error: patientsError } = await supabase
        .from('patients')
        .select('id, created_at')
        .eq('user_id', userId)
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`)

      const { data: currentAppointments, error: appointmentsError } = await supabase
        .from('rendezvous')
        .select('id, date_rdv, statut')
        .eq('user_id', userId)
        .gte('date_rdv', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('date_rdv', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`)

      const { data: currentFinances, error: financesError } = await supabase
        .from('finances')
        .select('montant, type')
        .eq('user_id', userId)
        .eq('type', 'revenue')
        .gte('date_transaction', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('date_transaction', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`)

      // Get previous month stats
      const { data: previousPatients, error: prevPatientsError } = await supabase
        .from('patients')
        .select('id, created_at')
        .eq('user_id', userId)
        .gte('created_at', `${previousYear}-${String(previousMonth + 1).padStart(2, '0')}-01`)
        .lt('created_at', `${previousYear}-${String(previousMonth + 2).padStart(2, '0')}-01`)

      const { data: previousAppointments, error: prevAppointmentsError } = await supabase
        .from('rendezvous')
        .select('id, date_rdv, statut')
        .eq('user_id', userId)
        .gte('date_rdv', `${previousYear}-${String(previousMonth + 1).padStart(2, '0')}-01`)
        .lt('date_rdv', `${previousYear}-${String(previousMonth + 2).padStart(2, '0')}-01`)

      const { data: previousFinances, error: prevFinancesError } = await supabase
        .from('finances')
        .select('montant, type')
        .eq('user_id', userId)
        .eq('type', 'revenue')
        .gte('date_transaction', `${previousYear}-${String(previousMonth + 1).padStart(2, '0')}-01`)
        .lt('date_transaction', `${previousYear}-${String(previousMonth + 2).padStart(2, '0')}-01`)

      if (patientsError || appointmentsError || financesError || 
          prevPatientsError || prevAppointmentsError || prevFinancesError) {
        throw new Error('Error fetching dashboard data')
      }

      // Calculate current stats
      const totalPatients = currentPatients?.length || 0
      const todayAppointments = currentAppointments?.filter(apt => 
        apt.date_rdv === now.toISOString().split('T')[0]
      ).length || 0
      const monthlyRevenue = currentFinances?.reduce((sum, f) => sum + f.montant, 0) || 0
      const completedAppointments = currentAppointments?.filter(apt => apt.statut === 'terminé').length || 0
      const totalAppointments = currentAppointments?.length || 0
      const attendanceRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0

      // Calculate growth percentages
      const previousMonthPatients = previousPatients?.length || 0
      const previousMonthRevenue = previousFinances?.reduce((sum, f) => sum + f.montant, 0) || 0
      const previousMonthAppointments = previousAppointments?.length || 0

      const patientGrowth = previousMonthPatients > 0 
        ? ((totalPatients - previousMonthPatients) / previousMonthPatients) * 100 
        : 0
      const revenueGrowth = previousMonthRevenue > 0 
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0
      const appointmentGrowth = previousMonthAppointments > 0 
        ? ((totalAppointments - previousMonthAppointments) / previousMonthAppointments) * 100 
        : 0

      return {
        totalPatients,
        todayAppointments,
        monthlyRevenue,
        attendanceRate,
        patientGrowth,
        revenueGrowth,
        appointmentGrowth
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return {
        totalPatients: 0,
        todayAppointments: 0,
        monthlyRevenue: 0,
        attendanceRate: 0,
        patientGrowth: 0,
        revenueGrowth: 0,
        appointmentGrowth: 0
      }
    }
  }
}
