'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  Edit,
  Trash2,
  Search
} from 'lucide-react'
import { financeApi, Finance } from '@/lib/api'

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'recette' | 'depense'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Finance | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRecettes: 0,
    totalDepenses: 0,
    benefice: 0,
    recetteGrowth: 0,
    depenseGrowth: 0,
    beneficeGrowth: 0
  })

  useEffect(() => {
    loadFinancesData()
  }, [selectedPeriod])

  const loadFinancesData = async () => {
    try {
      setLoading(true)
      
      // Get current period data
      const currentData = await financeApi.getAll()
      setFinances(currentData)
      
      // Calculate current period stats
      const currentRecettes = currentData
        .filter(f => f.type === 'recette')
        .reduce((sum, f) => sum + f.montant, 0)
      
      const currentDepenses = currentData
        .filter(f => f.type === 'depense')
        .reduce((sum, f) => sum + f.montant, 0)
      
      const currentBenefice = currentRecettes - currentDepenses
      
      // Get previous period data for comparison
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0]
      const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const lastMonthData = await financeApi.getByDateRange(lastMonthStart, lastMonthEnd)
      const lastMonthRecettes = lastMonthData
        .filter(f => f.type === 'recette')
        .reduce((sum, f) => sum + f.montant, 0)

      const lastMonthDepenses = lastMonthData
        .filter(f => f.type === 'depense')
        .reduce((sum, f) => sum + f.montant, 0)

      const lastMonthBenefice = lastMonthRecettes - lastMonthDepenses
      
      // Calculate growth percentages
      const recetteGrowth = lastMonthRecettes > 0 
        ? ((currentRecettes - lastMonthRecettes) / lastMonthRecettes) * 100 
        : 0
      
      const depenseGrowth = lastMonthDepenses > 0 
        ? ((currentDepenses - lastMonthDepenses) / lastMonthDepenses) * 100 
        : 0
      
      const beneficeGrowth = lastMonthBenefice !== 0 
        ? ((currentBenefice - lastMonthBenefice) / Math.abs(lastMonthBenefice)) * 100 
        : 0
      
      setStats({
        totalRecettes: currentRecettes,
        totalDepenses: currentDepenses,
        benefice: currentBenefice,
        recetteGrowth: Math.round(recetteGrowth),
        depenseGrowth: Math.round(depenseGrowth),
        beneficeGrowth: Math.round(beneficeGrowth)
      })
    } catch (error) {
      console.error('Error loading finances data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFinances = finances.filter(finance => {
    const matchesSearch = finance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finance.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || finance.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  const handleEditTransaction = (transaction: Finance) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await financeApi.delete(transactionId)
        await loadFinancesData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getFilteredFinances = () => {
    let filtered = finances

    if (filterType !== 'all') {
      filtered = filtered.filter(f => f.type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données financières...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Financière</h1>
          <p className="text-gray-600">Suivez vos recettes et dépenses</p>
        </div>
        <button
          onClick={handleAddTransaction}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recettes</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRecettes)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {stats.recetteGrowth !== 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm ${stats.recetteGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.recetteGrowth > 0 ? '+' : ''}{stats.recetteGrowth}%
              </span>
              <span className="text-xs text-gray-500">vs mois dernier</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Dépenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDepenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {stats.depenseGrowth !== 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm ${stats.depenseGrowth < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.depenseGrowth > 0 ? '+' : ''}{stats.depenseGrowth}%
              </span>
              <span className="text-xs text-gray-500">vs mois dernier</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
              <p className={`text-2xl font-bold ${stats.benefice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.benefice)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          {stats.beneficeGrowth !== 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm ${stats.beneficeGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.beneficeGrowth > 0 ? '+' : ''}{stats.beneficeGrowth}%
              </span>
              <span className="text-xs text-gray-500">vs mois dernier</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'recette' | 'depense')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="recette">Recettes</option>
              <option value="depense">Dépenses</option>
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {getFilteredFinances().map((finance) => (
                  <motion.tr
                    key={finance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(finance.date_transaction).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {finance.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        finance.type === 'recette' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {finance.type === 'recette' ? 'Recette' : 'Dépense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className={finance.type === 'recette' ? 'text-green-600' : 'text-red-600'}>
                        {finance.type === 'recette' ? '+' : '-'}{formatCurrency(finance.montant)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTransaction(finance)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(finance.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {getFilteredFinances().length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={() => setIsModalOpen(false)}
            onSave={async (transaction) => {
              try {
                if (selectedTransaction) {
                  // For updates, we only need the fields that can be updated
                  await financeApi.update(selectedTransaction.id, transaction)
                } else {
                  // For creation, we only need the required fields
                  await financeApi.create(transaction)
                }
                await loadFinancesData()
                setIsModalOpen(false)
              } catch (error) {
                console.error('Error saving transaction:', error)
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface TransactionModalProps {
  transaction: Finance | null
  onClose: () => void
  onSave: (transaction: Omit<Finance, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
}

function TransactionModal({ transaction, onClose, onSave }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    montant: transaction?.montant || 0,
    type: transaction?.type || 'recette',
    description: transaction?.description || '',
    date_transaction: transaction?.date_transaction || new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      montant: formData.montant,
      type: formData.type,
      description: formData.description,
      date_transaction: formData.date_transaction,
      mode_paiement: 'especes', // Default value
      reference: '' // Default value
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="recette">Recette</option>
              <option value="depense">Dépense</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Description de la transaction"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date_transaction}
              onChange={(e) => setFormData({ ...formData, date_transaction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {transaction ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

