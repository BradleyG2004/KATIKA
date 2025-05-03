<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-5">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <img src="/image/logo.svg" alt="KATIKA" class="h-6 w-auto" />
            </NuxtLink>
            <h1 class="text-xl font-bold">Mes Sessions</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
              Retour au dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Filtres avancés alignés -->
      <div class="mb-8">
        <form class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <select v-model="selectedStatus" class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm">
            <option value="">Tous les états</option>
            <option value="active">Actif</option>
            <option value="pending">Inactif</option>
          </select>
          <select v-model="selectedApp" class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm">
            <option value="">Toutes les applications</option>
            <option v-for="app in applications" :key="app.id" :value="app.name">
              {{ app.name }}
            </option>
          </select>
          <div class="flex flex-col">
            <label for="filterCreatedAt" class="text-xs text-gray-500 mb-1">Date de création</label>
            <input id="filterCreatedAt" type="date" v-model="filterCreatedAt" class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" />
          </div>
          <div class="flex flex-col">
            <label for="filterStartingAt" class="text-xs text-gray-500 mb-1">Date de début</label>
            <input id="filterStartingAt" type="date" v-model="filterStartingAt" class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" />
          </div>
          <div class="flex flex-col">
            <label for="filterPrice" class="text-xs text-gray-500 mb-1">Prix exact (€)</label>
            <input id="filterPrice" type="number" v-model.number="filterPrice" class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" min="0" step="0.01" />
          </div>
        </form>
      </div>

      <!-- Liste des sessions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="session in filteredSessions" :key="session.id"
          class="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                <span class="text-lg">{{ session.application.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ session.application }}</h3>
                <p class="text-sm text-gray-600">{{ session.plan }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <div :class="session.status === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'"
                class="text-xs px-2 py-1 rounded">
                {{ session.status === 'active' ? 'Actif' : 'Inactif ' }}
              </div>
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <svg v-if="session.status === 'active'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{{ session.status === 'active' ? 'Facture valide' : 'Facture expirée' }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="space-y-2">
              <div class="text-sm text-gray-600">
                <span class="font-medium">Date de création :</span>
                {{ new Date(session.created_at).toLocaleDateString() }}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Date de début :</span>
                {{ session.startingAt ? new Date(session.startingAt).toLocaleDateString() : 'Non définie' }}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Prix :</span>
                {{ session.price }}€/mois
                <div class="text-xs text-gray-500">≈ {{ (session.price * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA/mois</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="text-sm text-gray-600">
                <span class="font-medium">ID de session :</span>
                {{ session.id }}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Vérifié :</span>
                {{ session.verified ? 'Oui' : 'Non' }}
              </div>
              <div v-if="session.invoiceUrl" class="text-sm">
                <button @click="downloadInvoice(session)" 
                  class="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Télécharger la facture</span>
                </button>
              </div>
              <button @click="deleteSession(session.id)" class="text-red-600 hover:text-red-800 text-xs border border-red-200 rounded px-2 py-1 mt-2">Supprimer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune session -->
      <div v-if="filteredSessions.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucune session trouvée</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const user = ref(null)
const sessions = ref([])
const applications = ref([])
const selectedStatus = ref('')
const selectedApp = ref('')

const eurToFcfa = ref(655.957) // Valeur par défaut, sera mise à jour dynamiquement

// Fonction pour récupérer le taux de change EUR/FCFA
async function fetchEurToFcfaRate() {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=XOF')
    const data = await response.json()
    if (data && data.rates && data.rates.XOF) {
      eurToFcfa.value = data.rates.XOF
    }
  } catch (e) {
    console.error('Erreur lors de la récupération du taux EUR/FCFA:', e)
  }
}

// Charger les sessions de l'utilisateur
const loadSessions = async () => {
  try {
    const { data, error } = await $supabase
      .from('Session')
      .select(`
        *,
        application:app_id (
          name
        )
      `)
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    sessions.value = data.map(session => ({
      id: session.id,
      application: session.application.name,
      price: session.init_cost,
      status: session.active ? 'active' : 'pending',
      plan: 'Standard',
      invoiceMetadata: session.invoice_metadata,
      startingAt: session.starting_at,
      verified: session.verified,
      invoiceUrl: session.invoice_url,
      created_at: session.created_at,
      deleted: session.deleted || false
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des sessions:', error)
  }
}

// Charger les applications
const loadApplications = async () => {
  try {
    const { data, error } = await $supabase
      .from('application')
      .select('*')
      .order('name')

    if (error) throw error
    applications.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des applications:', error)
  }
}

// Filtrer les sessions
const filterCreatedAt = ref('')
const filterStartingAt = ref('')
const filterPrice = ref('')
const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    const statusMatch = !selectedStatus.value || session.status === selectedStatus.value
    const appMatch = !selectedApp.value || session.application === selectedApp.value
    const deletedMatch = session.deleted === false
    const createdAtMatch = !filterCreatedAt.value || (session.created_at && new Date(session.created_at).toISOString().slice(0,10) === filterCreatedAt.value)
    const startingAtMatch = !filterStartingAt.value || (session.startingAt && new Date(session.startingAt).toISOString().slice(0,10) === filterStartingAt.value)
    const priceMatch = !filterPrice.value || (session.price && Number(session.price) === Number(filterPrice.value))
    return statusMatch && appMatch && deletedMatch && createdAtMatch && startingAtMatch && priceMatch
  })
})

// Télécharger la facture
const downloadInvoice = async (session) => {
  if (!session.invoiceUrl) return
  
  try {
    const response = await fetch(session.invoiceUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facture-${session.application}-${session.id}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Erreur lors du téléchargement de la facture:', error)
    alert('Erreur lors du téléchargement de la facture')
  }
}

// Fonction pour pseudo-supprimer une session
const deleteSession = async (sessionId) => {
  try {
    const { error } = await $supabase
      .from('Session')
      .update({ deleted: true })
      .eq('id', sessionId)
    if (error) throw error
    await loadSessions()
  } catch (error) {
    alert('Erreur lors de la suppression : ' + error.message)
  }
}

// Charger les données au montage du composant
onMounted(async () => {
  try {
    const { data: { user: currentUser } } = await $supabase.auth.getUser()
    user.value = currentUser
    await loadApplications()
    await loadSessions()
    await fetchEurToFcfaRate()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

// Définir les métadonnées de la page
definePageMeta({
  middleware: ['auth']
})
</script> 