export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      finances: {
        Row: {
          id: string
          montant: number
          type: string
          description: string
          date_transaction: string
          user_id: string
          mode_paiement: string
          reference: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          montant: number
          type: string
          description: string
          date_transaction: string
          user_id: string
          mode_paiement: string
          reference: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          montant?: number
          type?: string
          description?: string
          date_transaction?: string
          user_id?: string
          mode_paiement?: string
          reference?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      patients: {
        Row: {
          id: string
          nom: string
          prenom: string
          date_naissance: string
          telephone: string
          email: string
          adresse: string
          antecedents_medicaux: string
          allergies: string
          notes: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          prenom: string
          date_naissance: string
          telephone: string
          email: string
          adresse: string
          antecedents_medicaux: string
          allergies: string
          notes: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          date_naissance?: string
          telephone?: string
          email?: string
          adresse?: string
          antecedents_medicaux?: string
          allergies?: string
          notes?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rendezvous: {
        Row: {
          id: string
          patient_id: string
          date_rdv: string
          heure: string
          duree: number
          type_consultation: string
          statut: string
          notes: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          date_rdv: string
          heure: string
          duree: number
          type_consultation: string
          statut: string
          notes: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          date_rdv?: string
          heure?: string
          duree?: number
          type_consultation?: string
          statut?: string
          notes?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rendezvous_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rendezvous_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
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
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          clinic_name: string
          role: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          clinic_name?: string
          role?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier use
export type Patient = Database['public']['Tables']['patients']['Row']
export type RendezVous = Database['public']['Tables']['rendezvous']['Row']
export type Finance = Database['public']['Tables']['finances']['Row']
export type User = Database['public']['Tables']['users']['Row']

export type InsertPatient = Database['public']['Tables']['patients']['Insert']
export type InsertRendezVous = Database['public']['Tables']['rendezvous']['Insert']
export type InsertFinance = Database['public']['Tables']['finances']['Insert']
export type InsertUser = Database['public']['Tables']['users']['Insert']
