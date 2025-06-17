<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Header avec recherche -->
    <header class="border-b border-gray-200">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-5">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <img src="/image/logo.svg" alt="KATIKA" class="h-6 w-auto" />
            </NuxtLink>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Rechercher..."
                class="w-96 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm" />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="showNewShareModal = true"
              class="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm transition-colors">
              Nouveau partage
            </button>
            <div class="relative">
              <Avatar :name="user?.email || 'Utilisateur'" :image="user?.avatar_url" class="user-avatar cursor-pointer" @click="showUserMenu = !showUserMenu" />
              <div v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 user-menu">
                <button @click="handleLogout"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Se déconnecter</span>
                </button>
                <button @click="navigateTo('/sessions')"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9l4 4m0 0l-4 4m4-4H7" />
                  </svg>
                  <span>Mes sessions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Filtres et Stats -->
      <div class="flex justify-between items-start mb-8">
        <div class="space-y-4 flex-1 max-w-[70%]">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="flex">
              <!-- Bouton "Tous" fixe -->
            <button 
                class="px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap border-r border-gray-200"
              @click="selectedApp = null"
              :class="{ 'bg-gray-900 text-white': selectedApp === null, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== null }"
            >
              Tous ({{ totalShares }})
            </button>

            <!-- Zone de défilement pour les applications -->
              <div class="overflow-x-auto scrollbar-hide">
              <div class="flex p-2 min-w-max">
                <button 
                  v-for="app in applications" 
                  :key="app.id" 
                  @click="selectedApp = app.name"
                  class="px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap mr-2 last:mr-0"
                  :class="{ 'bg-gray-900 text-white': selectedApp === app.name, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== app.name }"
                >
                  {{ app.name }} ({{ getShareCountByApp(app.name) }})
                </button>
                </div>
              </div>
            </div>
              </div>
              <!-- Indicateur de défilement -->
              <div class="flex items-center justify-end mt-2 text-xs text-gray-500">
                <svg class="w-4 h-4 mr-1 motion-safe:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span>Faites défiler pour voir plus d'applications</span>
              </div>
            </div>
        <div class="flex space-x-4">
            <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
              <div class="text-gray-600 text-sm mb-1">Dépenses estimées</div>
              <div v-if="selectedShare && !isNaN(Number(selectedShare.price))" class="text-2xl font-bold text-gray-700">{{ Number(selectedShare.price).toFixed(2) }} €</div>
              <div v-if="selectedShare && !isNaN(Number(selectedShare.price))" class="text-xs text-gray-500">≈ {{ (Number(selectedShare.price) * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA</div>
              <div v-else class="text-xs text-gray-400">Cliquez sur une session pour voir le détail</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
              <div class="text-gray-600 text-sm mb-1">Économies réalisées</div>
              <div v-if="selectedShare && !isNaN(Number(selectedShare.init_cost)) && !isNaN(Number(selectedShare.price))" class="text-2xl font-bold text-green-700">{{ (Number(selectedShare.init_cost) - Number(selectedShare.price)).toFixed(2) }} €</div>
            <div v-if="selectedShare && !isNaN(Number(selectedShare.init_cost)) && !isNaN(Number(selectedShare.price))" class="text-xs text-gray-500">≈ {{ ((Number(selectedShare.init_cost) - Number(selectedShare.price)) * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA</div>
            <div v-else class="text-xs text-gray-400">Cliquez sur une session pour voir le détail</div>
          </div>
        </div>
      </div>

      <!-- Liste des services -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="share in filteredShares" :key="share.id"
          class="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm cursor-pointer"
          @click="selectShare(share)"
          :class="{ 'ring-2 ring-gray-500': selectedShare && selectedShare.id === share.id }">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                <span class="text-lg">{{ share.application.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ share.application }}</h3>
                <p class="text-sm text-gray-600">{{ share.plan }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <div :class="share.status === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'"
                class="text-xs px-2 py-1 rounded">
                {{ share.status === 'active' ? 'Actif' : 'Inactif' }}
              </div>
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <svg v-if="share.status === 'active'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{{ share.status === 'active' ? 'Facture valide' : 'Facture expirée' }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray-600 mb-4">
            <div class="space-y-1">
              <div v-if="share.startingAt">Date de début: {{ new Date(share.startingAt).toLocaleDateString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-medium">{{ share.price }}€/mois</div>
              <div class="text-xs text-gray-500">≈ {{ (share.price * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA/mois</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal Nouveau Partage -->
  <div v-if="showNewShareModal" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop avec effet de flou -->
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      @click="showNewShareModal = false"></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all" @click.stop>
        <!-- En-tête du modal -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Nouveau partage</h2>
          <button @click="showNewShareModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleNewShare" class="space-y-6">
          <!-- Sélection de l'application -->
          <div>
            <label for="application" class="block text-sm font-medium text-gray-700 mb-2">
              Application
            </label>
            <select id="application" v-model="newShare.application"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required>
              <option value="" disabled>Sélectionnez une application</option>
              <option v-for="app in applications" :key="app.id" :value="app.name">
                {{ app.name }}
              </option>
            </select>
          </div>

          <!-- Identifiants -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Identifiant
            </label>
            <input id="username" type="text" v-model="newShare.username"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required placeholder="Email ou identifiant sur l'application" />
            <div v-if="newShare.application === 'Netflix' && newShare.pdfData?.email" class="text-xs text-gray-500 mt-1">
              Identifiant extrait du PDF : <span class="font-mono">{{ newShare.pdfData.email }}</span>
            </div>
            <div v-if="identifiantError" class="text-xs text-red-600 mt-1">{{ identifiantError }}</div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input id="password" type="password" v-model="newShare.password"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required placeholder="Mot de passe sur l'application" />
          </div>

          <!-- Champ PDF pour Netflix -->
          <div v-if="newShare.application === 'Netflix'">
            <label for="pdf" class="block text-sm font-medium text-gray-700 mb-2">
              Facture PDF
            </label>
            <input
              id="pdf"
              type="file"
              accept=".pdf"
              @change="handlePdfUpload"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              :disabled="isProcessingPdf" 
              required
            />
            <!-- Indicateurs de traitement PDF -->
            <div v-if="newShare.pdf || isVerifyingCredentials" class="mt-2 text-sm">
              <!-- Indicateur Traitement PDF -->
              <div v-if="isProcessingPdf" class="flex items-center text-gray-500"> 
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyse de votre facture Netflix en cours...
              </div>
              <div v-else-if="pdfProcessingStatus === 'success'" class="text-green-600">
                ✓ Informations de facturation extraites avec succès.
              </div>
              <div v-else-if="pdfProcessingStatus === 'error'" class="text-red-600">
                ✗ {{ pdfProcessingError }}
              </div>
              
              <!-- Indicateur Vérification Identifiants -->
              <div v-if="isVerifyingCredentials" class="flex items-center text-gray-500 mt-1"> 
                 <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification de votre facture Netflix...
              </div>
              <div v-else-if="credentialVerificationStatus === 'success'" class="text-green-600 mt-1">
                 ✓ Votre facture Netflix a été vérifiée avec succès !
              </div>
               <div v-else-if="credentialVerificationStatus === 'error'" class="text-red-600 mt-1">
                 ✗ {{ credentialVerificationError }}
              </div>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex space-x-4">
            <button type="button" @click="showNewShareModal = false"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors">
              Annuler
            </button>
            <button type="submit"
              class="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm transition-colors">
              Créer le partage
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal Souscription -->
  <div v-if="showSubscribeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300">
      <!-- Bouton de fermeture -->
      <button @click="closeSubscribeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- En-tête de la modale -->
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center">
          <span class="text-xl font-bold">{{ subscribeSession?.application?.charAt(0) }}</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ subscribeSession?.application }}</h2>
          <p class="text-sm text-gray-500">{{ subscribeSession?.plan }}</p>
        </div>
      </div>

      <!-- Détails de la session -->
      <div v-if="subscribeSession" class="space-y-4 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500 mb-1">Prix mensuel</p>
            <p class="text-xl font-bold text-gray-900">{{ subscribeSession.price }} €</p>
            <p class="text-xs text-gray-500">≈ {{ (subscribeSession.price * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500 mb-1">Économies</p>
            <p class="text-xl font-bold text-green-600">{{ (subscribeSession.init_cost - subscribeSession.price).toFixed(2) }} €</p>
            <p class="text-xs text-gray-500">≈ {{ ((subscribeSession.init_cost - subscribeSession.price) * eurToFcfa).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }} FCFA</p>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-500 mb-2">Détails du compte</p>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Utilisateurs autorisés</span>
              <span class="text-gray-900">{{ subscribeSession.actual_users }} / {{ subscribeSession.authorized_users }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Statut</span>
              <span :class="subscribeSession.status === 'active' ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{ subscribeSession.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Options de paiement -->
      <div v-if="!showPaymentOptions" class="mt-6">
        <button @click="showPaymentOptions = true" 
          class="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
          Souscrire maintenant
        </button>
      </div>
      <div v-else class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Choisissez votre mode de paiement</h3>
        <div class="space-y-3">
          <button 
            @click="handleNotchPayPayment"
            :disabled="isProcessingPayment"
            class="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isProcessingPayment" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ isProcessingPayment ? 'Traitement en cours...' : 'Payer avec Notch Pay' }}</span>
          </button>
        </div>
        <div v-if="paymentError" class="text-sm text-red-600 text-center mt-2">
          {{ paymentError }}
        </div>
        <p class="text-xs text-gray-500 text-center mt-2">
          Paiement sécurisé via Notch Pay • Aucune donnée bancaire n'est stockée
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import Avatar from '~/components/Avatar.vue'

const { $pdfjs } = useNuxtApp()

const searchQuery = ref('')
const shares = ref([])
const filteredShares = computed(() => {
  const base = selectedApp.value
    ? shares.value.filter(share => share.application === selectedApp.value)
    : shares.value
  return base.filter(share =>
    share.application.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    share.active === true &&
    share.actual_users < share.authorized_users
  )
})
const { $supabase } = useNuxtApp()
const user = ref(null)
const selectedApp = ref(null)
const showNewShareModal = ref(false)
const showUserMenu = ref(false)
const applications = ref([])
const isProcessingPdf = ref(false)
const pdfProcessingStatus = ref(null)
const pdfProcessingError = ref(null)
const isVerifyingCredentials = ref(false)
const credentialVerificationStatus = ref(null)
const credentialVerificationError = ref(null)
const eurToFcfa = ref(655.957) // Valeur par défaut, sera mise à jour dynamiquement
const selectedShare = ref(null)
const identifiantError = ref('')
const showSubscribeModal = ref(false)
const subscribeSession = ref(null)
const showPaymentOptions = ref(false)
const isProcessingPayment = ref(false)
const paymentError = ref(null)

// Configuration de NotchPay via les variables d'environnement
const config = useRuntimeConfig()
const NOTCHPAY_API_KEY = config.public.notchApiKey

// Log pour vérifier les variables d'environnement
// onMounted(() => {
//   console.log('NotchPay Config:', {
//     apiKey: NOTCHPAY_API_KEY
//   })
// })

// Fonction pour charger les sessions depuis Supabase
const loadShares = async () => {
  try {
    const { data, error } = await $supabase
      .from('Session')
      .select(`
        *,
        application:app_id (
          name
        )
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transformer les données pour correspondre au format attendu
    shares.value = data.map(session => {
      const isNetflix = session.application.name === 'Netflix'
      let plan = session.plan || ''
      let authorized_users = session.authorized_users || 0
      let displayedCost = session.init_cost
      if (isNetflix) {
        if (!plan || !authorized_users) {
          const planInfo = getNetflixPlanAndUsers(session.init_cost)
          plan = planInfo.plan
          authorized_users = planInfo.authorized_users
        }
        displayedCost = getDisplayedCost(session.init_cost, plan)
      }
      return {
        id: session.id,
        application: session.application.name,
        username: session.user_app_id,
        price: displayedCost,
        init_cost: session.init_cost,
        status: session.active ? 'active' : 'pending',
        members: [],
        plan,
        authorized_users,
        actual_users: session.actual_users || 1,
        invoiceMetadata: session.invoice_metadata,
        startingAt: session.starting_at,
        verified: session.verified,
        invoiceUrl: session.invoice_url,
        active: session.active
      }
    })
  } catch (error) {
    console.error('Erreur lors du chargement des sessions:', error)
  }
}

// Charger les applications depuis Supabase
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

// Charger les applications et les sessions au montage du composant
onMounted(async () => {
  await loadApplications()
  await loadShares()
  await fetchEurToFcfaRate()
})

// État du nouveau partage
const newShare = ref({
  application: '',
  username: '',
  password: '',
  pdf: null,
  pdfData: null
})

// Définir les métadonnées de la page et le middleware
definePageMeta({
  middleware: ['auth']
})

// Calculer le nombre total de partages
const totalShares = computed(() => shares.value.length)

// Fonction pour obtenir le nombre de partages par application
const getShareCountByApp = (appName) => {
  return shares.value.filter(share => share.application === appName).length
}

// Réinitialiser les états lorsque l'application change ou nouveau fichier
watch(() => newShare.value.application, (newApp) => {
  if (newApp !== 'Netflix') {
    newShare.value.pdf = null
    newShare.value.pdfData = null
    pdfProcessingStatus.value = null
    pdfProcessingError.value = null
    isVerifyingCredentials.value = false
    credentialVerificationStatus.value = null
    credentialVerificationError.value = null
  }
})

// Fonction pour extraire le texte d'un PDF
const extractTextFromPDF = async (file) => {
  try {
    console.log('Début de l\'extraction du PDF...')
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await $pdfjs.getDocument(arrayBuffer).promise
    const numPages = pdf.numPages
    console.log(`Nombre de pages: ${numPages}`)

    let fullText = ''
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + ' '
    }

    // Extraire les métadonnées
    const metadata = await pdf.getMetadata()
    console.log('Métadonnées du PDF:', metadata)

    // Vérifier si c'est une facture Netflix
    const isNetflixInvoice = metadata?.info?.Title?.toLowerCase().includes('netflix')
    if (!isNetflixInvoice) {
      throw new Error('Ce document ne semble pas être une facture Netflix authentique.')
    }

    // Extraire l'email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = fullText.match(emailRegex) || []
    console.log('Emails trouvés:', emails)

    // Extraire la date
    const dateRegex = /\b(\d{2})\/(\d{2})\/(\d{2})\b/g
    const dates = []
    let match
    while ((match = dateRegex.exec(fullText)) !== null) {
      dates.push(match[0])
    }
    console.log('Dates trouvées:', dates)

    // Extraire le montant total avec TVA (TTC)
    const totalRegex = /(?:^|\s)TOTAL\s*([0-9]+[,.]?[0-9]*)\s*€/gi
    let totalMatches = []
    let matchTotal
    while ((matchTotal = totalRegex.exec(fullText)) !== null) {
      totalMatches.push(matchTotal[1])
    }
    let amount = null
    if (totalMatches.length > 0) {
      amount = totalMatches[totalMatches.length - 1].replace(',', '.')
      console.log('- Montant total extrait (TTC):', amount)
    }

    // Extraire la date de début de la période de service (après "Du")
    let startingDate = null
    const periodRegex = /Du\s+(\d{2}\/\d{2}\/\d{4})/i
    const periodMatch = fullText.match(periodRegex)
    if (periodMatch && periodMatch[1]) {
      startingDate = periodMatch[1]
      console.log('- Date de début de période de service extraite:', startingDate)
    }

    // Extraire la date de fin de la période de service (après "au")
    let cancelledOn = null
    const periodEndRegex = /au\s+(\d{2}\/\d{2}\/\d{4})/i
    const periodEndMatch = fullText.match(periodEndRegex)
    if (periodEndMatch && periodEndMatch[1]) {
      // Convertir en format YYYY-MM-DD
      const [day, month, year] = periodEndMatch[1].split('/')
      cancelledOn = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      console.log('- Date de fin de période de service extraite:', cancelledOn)
    }

    // Vérifier la cohérence avec les métadonnées
    const pdfCreationDate = metadata?.info?.CreationDate
    const pdfModDate = metadata?.info?.ModDate

    const result = {
      fullText,
      email: emails.length > 0 ? emails[0] : null,
      date: startingDate,
      amount: amount,
      cancelled_on: cancelledOn,
      metadata: {
        creationDate: pdfCreationDate,
        modificationDate: pdfModDate,
        title: metadata?.info?.Title
      },
      isAuthentic: isNetflixInvoice
    }

    console.log('Résultat final de l\'extraction:', result)
    return result

  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error)
    throw error
  }
}

// Modifier la fonction handlePdfUpload pour réinitialiser l'état
const handlePdfUpload = async (event) => {
  const file = event.target.files[0]
  // Réinitialiser l'état à chaque nouvelle sélection
  isProcessingPdf.value = false
  pdfProcessingStatus.value = null
  pdfProcessingError.value = null
  isVerifyingCredentials.value = false
  credentialVerificationStatus.value = null
  credentialVerificationError.value = null
  newShare.value.pdfData = null
  
  if (file && file.type === 'application/pdf') {
    console.log('Fichier PDF sélectionné pour traitement ultérieur:', file.name)
    newShare.value.pdf = file
    
    // Commencer le traitement du PDF immédiatement
    try {
      isProcessingPdf.value = true
      const pdfData = await extractTextFromPDF(file)
      if (pdfData.email) {
        newShare.value.pdfData = pdfData
        pdfProcessingStatus.value = 'success'
      } else {
        pdfProcessingStatus.value = 'error'
        pdfProcessingError.value = "Aucune adresse email n'a été trouvée dans la facture PDF."
      }
    } catch (error) {
      console.error('Erreur lors du traitement du PDF:', error)
      pdfProcessingStatus.value = 'error'
      pdfProcessingError.value = error.message
    } finally {
      isProcessingPdf.value = false
    }
  } else {
    alert('Le fichier sélectionné n\'est pas un PDF valide. Veuillez choisir votre facture Netflix au format PDF.')
    event.target.value = null
    newShare.value.pdf = null
  }
}

// Modifier la fonction handleNewShare pour recharger les sessions après la création
const handleNewShare = async () => {
  try {
    console.log('Début de la création du partage...')
    const selectedApp = applications.value.find(app => app.name === newShare.value.application)
    if (!selectedApp) throw new Error('Application non trouvée')

    if (newShare.value.application === 'Netflix') {
      identifiantError.value = ''
      if (!newShare.value.pdfData || !newShare.value.pdfData.isAuthentic) {
        throw new Error('La facture Netflix n\'a pas pu être validée.')
      }
      if (newShare.value.username.trim().toLowerCase() !== newShare.value.pdfData.email.trim().toLowerCase()) {
        identifiantError.value = 'L\'identifiant saisi ne correspond pas à celui extrait de la facture PDF.'
        return;
      }

      // Upload du PDF vers Supabase Storage
      let pdfUrl = null
      if (newShare.value.pdf instanceof File) {
        console.log("Début de l'upload du PDF vers Supabase Storage...")
        try {
          // Générer un nom de fichier unique basé sur un UUID
          const fileName = `${crypto.randomUUID()}.pdf`

          const { data: uploadData, error: uploadError } = await $supabase.storage
            .from('invoices')
            .upload(fileName, newShare.value.pdf, {
              cacheControl: '3600',
              contentType: 'application/pdf',
              upsert: false // Empêcher l'écrasement si le fichier existe déjà
            })

          if (uploadError) throw uploadError
          if (!uploadData || !uploadData.path) throw new Error('Upload Supabase : le fichier n\'a pas été stocké correctement.')

          // Récupérer l'URL publique du fichier
          const { data: publicUrlData, error: publicUrlError } = $supabase.storage
            .from('invoices')
            .getPublicUrl(fileName)

          if (publicUrlError) throw publicUrlError
          if (!publicUrlData || !publicUrlData.publicUrl) throw new Error('Impossible de générer l\'URL publique du PDF.')

          pdfUrl = publicUrlData.publicUrl
          console.log('URL publique générée:', pdfUrl)
        } catch (uploadError) {
          console.error("Erreur lors de l'upload du PDF:", uploadError)
          throw new Error("Impossible d'uploader la facture PDF: " + uploadError.message)
        }
      }

      // Créer les données du partage
      const totalCost = parseFloat(newShare.value.pdfData.amount)
      const { plan, authorized_users } = getNetflixPlanAndUsers(totalCost)
      const shareData = {
        app_id: selectedApp.id,
        user_app_id: newShare.value.username,
        user_app_password: newShare.value.password,
        user_id: user.value.id,
        invoice_metadata: newShare.value.pdfData.metadata,
        invoice_url: pdfUrl,
        starting_at: formatDateForDB(newShare.value.pdfData.date),
        cancelled_on: newShare.value.pdfData.cancelled_on,
        init_cost: totalCost,
        active: isRecentDate(newShare.value.pdfData.date),
        verified: true,
        created_at: new Date().toISOString(),
        authorized_users,
        actual_users: 1
      }

      console.log('Données du partage Netflix à insérer:', shareData)

      const { error: insertError } = await $supabase
        .from('Session')
        .insert([shareData])

      if (insertError) throw insertError

      alert('Votre partage Netflix a été créé avec succès !')
      await loadShares() // Recharger les sessions après la création
      resetForm()
            } else {
      // Logique existante pour les autres applications
      // ... existing non-Netflix share creation code ...
    }
  } catch (error) {
    console.error('Erreur lors de la création du partage:', error)
    alert(error.message)
  }
}

// Fonction utilitaire pour formater la date pour la BD
const formatDateForDB = (dateStr) => {
  if (!dateStr) return null
  const [day, month, year] = dateStr.split('/')
  // Vérifier si l'année est déjà complète (4 chiffres)
  const fullYear = year.length === 4 ? year : `20${year}`
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

// Fonction pour vérifier si la date est récente (moins de 5 jours)
const isRecentDate = (dateStr) => {
  if (!dateStr) return false
  const [day, month, year] = dateStr.split('/')
  const invoiceDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day))
  const FiveDaysAgo = new Date()
  FiveDaysAgo.setDate(FiveDaysAgo.getDate() - 5)
  return invoiceDate >= FiveDaysAgo
}

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  newShare.value = {
    application: '',
    username: '',
    password: '',
    pdf: null,
          pdfData: null
  }
  showNewShareModal.value = false
}

// Se déconnecter
const handleLogout = async () => {
  try {
    await $supabase.auth.signOut()
    navigateTo('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Récupérer l'utilisateur au chargement de la page
onMounted(async () => {
  try {
    const { data: { user: currentUser } } = await $supabase.auth.getUser()
    user.value = currentUser
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }

  // Fermer le menu utilisateur lors d'un clic en dehors
  document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu')
    const userAvatar = document.querySelector('.user-avatar')
    if (!userMenu?.contains(e.target) && !userAvatar?.contains(e.target)) {
      showUserMenu.value = false
    }
  })
})

// Fonction pour vérifier la validité d'une facture
const isInvoiceValid = (metadata) => {
  if (!metadata) return false
  
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  
  // Vérifier si la facture a été créée dans les 30 derniers jours
  const creationDate = new Date(metadata.creationDate)
  const isRecent = creationDate >= thirtyDaysAgo
  
  // Vérifier si le producteur est bien Netflix
  const isFromNetflix = metadata.producer?.toLowerCase().includes('netflix')
  
  return isRecent && isFromNetflix
}

// Helper to determine Netflix plan and authorized users
function getNetflixPlanAndUsers(totalCost) {
  if (totalCost < 10) {
    return { plan: 'Standard with Ads', authorized_users: 2 };
  } else if (totalCost < 20) {
    return { plan: 'Standard (No Ads)', authorized_users: 2 };
  } else {
    return { plan: 'Premium', authorized_users: 4 };
  }
}

// Helper to calculate displayed cost
function getDisplayedCost(totalCost, plan) {
  if (plan === 'Premium') {
    return (totalCost / 4) + (totalCost / 8);
  } else {
    return (totalCost / 2) + (totalCost / 4);
  }
}

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

// Fonction pour sélectionner une session
function selectShare(share) {
  selectedShare.value = share
  subscribeSession.value = share
  showSubscribeModal.value = true
}

// Fonction pour fermer la modale de souscription
function closeSubscribeModal() {
  showSubscribeModal.value = false
  showPaymentOptions.value = false
  subscribeSession.value = null
}

// Fonction pour gérer le paiement Notch Pay
async function handleNotchPayPayment() {
  try {
    isProcessingPayment.value = true
    paymentError.value = null

    // Vérifier si la session a atteint sa limite d'utilisateurs
    if (subscribeSession.value.actual_users >= subscribeSession.value.authorized_users) {
      throw new Error('Cette session a atteint son nombre maximum d\'utilisateurs')
    }

    // Vérifier que la clé API est présente
    if (!NOTCHPAY_API_KEY) {
      throw new Error('Configuration NotchPay manquante. Veuillez vérifier les variables d\'environnement.')
    }

    const amountInCentimes = Math.round(subscribeSession.value.price * 100) // Convertir en centimes
    const reference = `ref_${crypto.randomUUID()}`

    const response = await fetch('https://api.notchpay.co/payments', {
      method: 'POST',
      headers: {
        'Authorization': NOTCHPAY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInCentimes,
        currency: 'XAF',
        customer: {
          name: user.value.user_metadata?.name || user.value.email.split('@')[0],
          email: user.value.email,
          phone: '+237652589508' // À remplacer par le numéro réel de l'utilisateur
        },
        description: `Abonnement ${subscribeSession.value.application} - ${subscribeSession.value.plan}`,
        callback: `${window.location.protocol}//${window.location.host}/payment-callback`,
        reference
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors de la création du paiement')
    }

    const data = await response.json()
    
    // Créer l'entité Subscription dans Supabase
    const { error: subscriptionError } = await $supabase
      .from('Subscription')
      .insert([{
        cost: subscribeSession.value.price,
        session_id: subscribeSession.value.id,
        user_id: user.value.id,
        active: true,
        reference
      }])

    if (subscriptionError) {
      console.error('Erreur lors de la création de la souscription:', subscriptionError)
      throw new Error('Erreur lors de la création de la souscription')
    }

    // Mettre à jour le nombre d'utilisateurs actuels de la session
    const { error: updateError } = await $supabase
      .from('Session')
      .update({ actual_users: subscribeSession.value.actual_users + 1 })
      .eq('id', subscribeSession.value.id)

    if (updateError) {
      console.error('Erreur lors de la mise à jour du nombre d\'utilisateurs:', updateError)
      throw new Error('Erreur lors de la mise à jour du nombre d\'utilisateurs')
    }

    // Rediriger vers la page de paiement Notch Pay
    window.location.href = data.authorization_url

  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error)
    paymentError.value = error.message || 'Une erreur est survenue lors du traitement du paiement'
  } finally {
    isProcessingPayment.value = false
  }
}
</script>

<style>
.filter brightness-0 {
  filter: brightness(0);
}

.filter invert {
  filter: invert(1);
}

/* Styles pour le défilement horizontal fluide */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Animation de défilement fluide */
.overflow-x-auto {
  scroll-behavior: smooth;
}
</style>