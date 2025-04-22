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
              <input 
                type="text" 
                placeholder="Rechercher..." 
                class="w-96 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="showNewShareModal = true"
              class="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Nouveau partage
            </button>
            <div class="relative">
              <div 
                @click="showUserMenu = !showUserMenu" 
                class="w-8 h-8 bg-blue-500 rounded-full border border-blue-900 cursor-pointer user-avatar"
              ></div>
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 user-menu"
              >
                <button 
                  @click="handleLogout"
                  class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Se déconnecter</span>
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
        <div class="space-y-4">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div class="flex space-x-4">
            <button 
              class="px-4 py-2 rounded-lg text-sm transition-colors"
              @click="selectedApp = null"
              :class="{ 'bg-gray-900 text-white': selectedApp === null, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== null }"
            >
              Tous ({{ totalShares }})
            </button>
            <button 
              v-for="app in applications" 
              :key="app.id"
              @click="selectedApp = app.name"
              class="px-4 py-2 rounded-lg text-sm transition-colors"
              :class="{ 'bg-gray-900 text-white': selectedApp === app.name, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== app.name }"
            >
              {{ app.name }} ({{ getShareCountByApp(app.name) }})
            </button>
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
            <div class="text-gray-600 text-sm mb-1">Dépenses estimées</div>
            <div class="text-2xl font-bold text-gray-900">{{ filteredShares.reduce((sum, share) => sum + share.price, 0).toFixed(2) }} €</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
            <div class="text-gray-600 text-sm mb-1">Économies réalisées</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ filteredShares.reduce((sum, share) => sum + (share.price - (share.price / (share.members.length + 1))), 0).toFixed(2) }} €
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des services -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="share in filteredShares" 
          :key="share.id"
          class="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
        >
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
            <div 
              :class="share.status === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'"
              class="text-xs px-2 py-1 rounded"
            >
              {{ share.status === 'active' ? 'Actif' : 'En attente' }}
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray-600 mb-4">
            <span>Partage avec {{ share.members.length }} personnes</span>
            <span>{{ (share.price / (share.members.length + 1)).toFixed(2) }}€/mois</span>
          </div>
          <div class="flex items-center space-x-2">
            <div 
              v-for="(member, index) in share.members" 
              :key="index"
              class="w-6 h-6 bg-gray-100 rounded-full border border-gray-200"
              :title="member.name"
            ></div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal Nouveau Partage -->
  <div v-if="showNewShareModal" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop avec effet de flou -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      @click="showNewShareModal = false"
    ></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div 
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all"
        @click.stop
      >
        <!-- En-tête du modal -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Nouveau partage</h2>
          <button 
            @click="showNewShareModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
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
            <select
              id="application"
              v-model="newShare.application"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required
            >
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
            <input
              id="username"
              type="text"
              v-model="newShare.username"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required
              placeholder="Identifiant sur l'application"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              v-model="newShare.password"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              required
              placeholder="Mot de passe sur l'application"
            />
          </div>

          <!-- Boutons -->
          <div class="flex space-x-4">
            <button
              type="button"
              @click="showNewShareModal = false"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm transition-colors"
            >
              Créer le partage
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const user = ref(null)
const selectedApp = ref(null)
const showNewShareModal = ref(false)
const showUserMenu = ref(false)
const applications = ref([])

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

// Charger les applications au montage du composant
onMounted(() => {
  loadApplications()
})

// Données de test pour les partages
const shares = ref([
  {
    id: 1,
    application: 'Netflix',
    plan: 'Premium',
    status: 'active',
    price: 17.99,
    members: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]
  },
  {
    id: 2,
    application: 'Spotify',
    plan: 'Famille',
    status: 'active',
    price: 15.99,
    members: [
      { id: 4, name: 'David' },
      { id: 5, name: 'Eve' },
      { id: 6, name: 'Frank' },
      { id: 7, name: 'Grace' }
    ]
  },
  {
    id: 3,
    application: 'Disney+',
    plan: 'Standard',
    status: 'pending',
    price: 8.99,
    members: [
      { id: 8, name: 'Henry' },
      { id: 9, name: 'Ivy' }
    ]
  },
  {
    id: 4,
    application: 'Apple Music',
    plan: 'Famille',
    status: 'active',
    price: 14.99,
    members: [
      { id: 10, name: 'Jack' },
      { id: 11, name: 'Kelly' },
      { id: 12, name: 'Liam' }
    ]
  },
  {
    id: 5,
    application: 'Crunchyroll',
    plan: 'Premium',
    status: 'pending',
    price: 9.99,
    members: [
      { id: 13, name: 'Mike' },
      { id: 14, name: 'Nina' }
    ]
  }
])

// État du nouveau partage
const newShare = ref({
  application: '',
  username: '',
  password: ''
})

// Définir les métadonnées de la page et le middleware
definePageMeta({
  middleware: ['auth']
})

// Calculer le nombre total de partages
const totalShares = computed(() => shares.value.length)

// Filtrer les partages selon l'application sélectionnée
const filteredShares = computed(() => {
  if (!selectedApp.value) return shares.value
  return shares.value.filter(share => share.application === selectedApp.value)
})

// Fonction pour obtenir le nombre de partages par application
const getShareCountByApp = (appName) => {
  return shares.value.filter(share => share.application === appName).length
}

// Fonction pour gérer la création d'un nouveau partage
const handleNewShare = async () => {
  try {
    // TODO: Ajouter la logique pour sauvegarder le partage
    console.log('Nouveau partage:', newShare.value)
    
    // Réinitialiser le formulaire
    newShare.value = {
      application: '',
      username: '',
      password: ''
    }
    
    // Fermer le modal
    showNewShareModal.value = false
  } catch (error) {
    console.error('Erreur lors de la création du partage:', error)
  }
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
</script>

<style>
.filter brightness-0 {
  filter: brightness(0);
}
.filter invert {
  filter: invert(1);
}
</style> 