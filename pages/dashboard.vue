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
              <div @click="showUserMenu = !showUserMenu"
                class="w-8 h-8 bg-blue-500 rounded-full border border-blue-900 cursor-pointer user-avatar"></div>
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
            <button class="px-4 py-2 rounded-lg text-sm transition-colors" @click="selectedApp = null"
              :class="{ 'bg-gray-900 text-white': selectedApp === null, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== null }">
              Tous ({{ totalShares }})
            </button>
            <button v-for="app in applications" :key="app.id" @click="selectedApp = app.name"
              class="px-4 py-2 rounded-lg text-sm transition-colors"
              :class="{ 'bg-gray-900 text-white': selectedApp === app.name, 'bg-gray-100 text-gray-600 hover:bg-gray-200': selectedApp !== app.name }">
              {{ app.name }} ({{ getShareCountByApp(app.name) }})
            </button>
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
            <div class="text-gray-600 text-sm mb-1">Dépenses estimées</div>
            <div class="text-2xl font-bold text-gray-900">{{filteredShares.reduce((sum, share) => sum + share.price,
              0).toFixed(2)}} €</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 w-48 border border-gray-200">
            <div class="text-gray-600 text-sm mb-1">Économies réalisées</div>
            <div class="text-2xl font-bold text-gray-900">
              {{filteredShares.reduce((sum, share) => sum + (share.price - (share.price / (share.members.length + 1))),
                0).toFixed(2)}} €
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des services -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="share in filteredShares" :key="share.id"
          class="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
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
            <div :class="share.status === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'"
              class="text-xs px-2 py-1 rounded">
              {{ share.status === 'active' ? 'Actif' : 'En attente' }}
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray-600 mb-4">
            <span>Partage avec {{ share.members.length }} personnes</span>
            <span>{{ (share.price / (share.members.length + 1)).toFixed(2) }}€/mois</span>
          </div>
          <div class="flex items-center space-x-2">
            <div v-for="(member, index) in share.members" :key="index"
              class="w-6 h-6 bg-gray-100 rounded-full border border-gray-200" :title="member.name"></div>
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
              required placeholder="Identifiant sur l'application" />
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
                Traitement du PDF en cours...
              </div>
              <div v-else-if="pdfProcessingStatus === 'success'" class="text-green-600">
                ✓ Données PDF extraites avec succès.
              </div>
              <div v-else-if="pdfProcessingStatus === 'error'" class="text-red-600">
                ✗ Erreur PDF: {{ pdfProcessingError }}
              </div>
              
              <!-- Indicateur Vérification Identifiants -->
              <div v-if="isVerifyingCredentials" class="flex items-center text-gray-500 mt-1"> 
                 <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification des identifiants Netflix...
              </div>
              <div v-else-if="credentialVerificationStatus === 'success'" class="text-green-600 mt-1">
                 ✓ Identifiants Netflix vérifiés.
              </div>
               <div v-else-if="credentialVerificationStatus === 'error'" class="text-red-600 mt-1">
                 ✗ Erreur Identifiants: {{ credentialVerificationError }}
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
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'

const { $pdfjs } = useNuxtApp()

const searchQuery = ref('')
const filteredShares = computed(() => {
  const base = selectedApp.value
    ? shares.value.filter(share => share.application === selectedApp.value)
    : shares.value
  return base.filter(share =>
    share.application.toLowerCase().includes(searchQuery.value.toLowerCase())
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
    const pdf = await $pdfjs.getDocument({ data: arrayBuffer }).promise

    console.log(`PDF chargé avec succès. Nombre de pages: ${pdf.numPages}`)

    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Extraction du texte de la page ${i}...`)
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(" ")
      fullText += pageText + "\n"
    }

    console.log('Texte complet extrait:', fullText)

    // Extraire les informations spécifiques avec des regex adaptées aux factures Netflix
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    const dateRegex = /(\d{2}\/\d{2}\/\d{2,4})/g
    const totalRegex = /TOTAL\s+(\d+[.,]\d{2})\s*€/i
    const totalMatch = totalRegex.exec(fullText)

    let amount = null
    if (totalMatch && totalMatch[1]) {
      amount = totalMatch[1].replace(',', '.')
      console.log('- Montant extrait (TOTAL):', amount)
    }

    // Récupérer toutes les correspondances
    const emails = fullText.match(emailRegex) || []
    const dates = fullText.match(dateRegex) || []
    const totalMatches = totalRegex.exec(fullText)

    console.log('Correspondances trouvées:')
    console.log('- Emails:', emails)
    console.log('- Dates:', dates)
    console.log('- Total match:', totalMatches)

    const result = {
      fullText,
      email: emails.length > 0 ? emails[0] : null,
      date: dates.length > 0 ? dates[0] : null,
      amount: amount
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
  } else {
    alert('Veuillez sélectionner un fichier PDF valide')
    event.target.value = null
    newShare.value.pdf = null
  }
}

// Modifier la fonction handleNewShare pour gérer les états
const handleNewShare = async () => {
  let pdfProcessedSuccessfully = true 
  let credentialsVerifiedSuccessfully = true // Flag pour la vérification
  try {
    console.log('Début de la création du partage...')
    const selectedApp = applications.value.find(app => app.name === newShare.value.application)
    if (!selectedApp) throw new Error('Application non trouvée')

    const shareData = {
      app_id: selectedApp.id,
      user_app_id: newShare.value.username,
      password: newShare.value.password,
      user_id: user.value.id,
      invoice_url: null,
      starting_at: null,
      init_cost: null,
      active: false,
      verified: false,
      pdf_data: null,
      created_at: new Date().toISOString()
    }

    // Traitement du PDF pour Netflix
    if (newShare.value.application === 'Netflix' && newShare.value.pdf instanceof File) {
      isProcessingPdf.value = true
      pdfProcessedSuccessfully = false
      let pdfData = null // Déclarer pdfData ici
      
      try {
        console.log('Traitement du PDF pour Netflix...')
        const pdfFile = newShare.value.pdf
        pdfData = await extractTextFromPDF(pdfFile) // Assigner à pdfData
        shareData.pdf_data = pdfData 
        
        // Vérification de la correspondance de l'email
        console.log('Vérification de la correspondance email');
        if (!pdfData.email || pdfData.email.toLowerCase() !== newShare.value.username.toLowerCase()) {
          console.error("Email non concordant");
          pdfProcessingStatus.value = 'error';
          pdfProcessingError.value = "L'email extrait du PDF ne correspond pas à l'identifiant saisi.";
          throw new Error(pdfProcessingError.value);
        }
        console.log('Emails correspondent');
        pdfProcessingStatus.value = 'success';
        pdfProcessedSuccessfully = true;
        
        // --- 3. Vérification des identifiants Netflix via API --- 
        console.log('Début de la vérification des identifiants Netflix via API...');
        isVerifyingCredentials.value = true;
        credentialVerificationStatus.value = null;
        credentialVerificationError.value = null;
        credentialsVerifiedSuccessfully = false; // Assume failure

        try {
          const verifyResponse = await fetch('/api/verify-netflix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: newShare.value.username, 
              password: newShare.value.password 
            })
          });

          if (!verifyResponse.ok) {
            throw new Error(`Erreur API (${verifyResponse.status}): Impossible de contacter le service de vérification.`);
          }

          const verifyResult = await verifyResponse.json();

          if (verifyResult.verified) {
            console.log('Vérification des identifiants réussie.');
            credentialVerificationStatus.value = 'success';
            shareData.verified = true;
            credentialsVerifiedSuccessfully = true;
          } else {
            console.error('Échec de la vérification des identifiants:', verifyResult.error);
            credentialVerificationStatus.value = 'error';
            credentialVerificationError.value = verifyResult.error || 'Identifiants Netflix invalides ou problème de vérification.';
            throw new Error(credentialVerificationError.value);
          }
        } catch (verifyError) {
          console.error('Erreur lors de la vérification des identifiants:', verifyError);
          credentialVerificationStatus.value = 'error';
          credentialVerificationError.value = verifyError.message;
          throw verifyError;
        } finally {
          isVerifyingCredentials.value = false;
        }

        // --- 4. Upload PDF et récupération URL ---
        console.log("Début de l'upload du PDF...");
        let pdfUrl = '';

        if (newShare.value.pdf instanceof File) {
          try {
            isProcessingPdf.value = true;
            const formData = new FormData();
            formData.append('file', newShare.value.pdf);

            const uploadResponse = await fetch('/api/upload-pdf', {
              method: 'POST',
              body: formData
            });

            if (!uploadResponse.ok) {
              throw new Error(`Erreur serveur (${uploadResponse.status}) lors de l'upload du PDF.`);
            }

            const uploadResult = await uploadResponse.json();
            pdfUrl = uploadResult.url;
            shareData.invoice_url = pdfUrl;
            console.log('PDF uploadé avec succès. URL:', pdfUrl);
          } catch (uploadError) {
            console.error("Erreur lors de l'upload du PDF:", uploadError);
            pdfProcessingStatus.value = 'error';
            pdfProcessingError.value = uploadError.message;
            throw uploadError;
          } finally {
            isProcessingPdf.value = false;
          }
        }

        // --- 5. Mettre à jour shareData avec dates/montants extraits ---
        if (pdfData.date) {
          const dateParts = pdfData.date.split('/');
          if (dateParts.length === 3) {
            const year = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]) - 1; // Mois est 0-indexé
            const day = parseInt(dateParts[0]);
            shareData.starting_at = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          }
        }
        if (pdfData.amount) {
          const amountString = String(pdfData.amount).replace(',', '.').trim();
          const numericAmount = parseFloat(amountString);
          if (!isNaN(numericAmount)) { 
            shareData.init_cost = numericAmount; 
          }
        }
        
        // Vérifier si la date extraite est dans les 30 derniers jours
        if (shareData.starting_at) { 
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Reconstruire la date correctement à partir de la chaîne YYYY-MM-DD
          const datePartsForComparison = shareData.starting_at.split('-');
          const shareDate = new Date(
            parseInt(datePartsForComparison[0]), 
            parseInt(datePartsForComparison[1]) - 1, 
            parseInt(datePartsForComparison[2])
          );
          shareDate.setHours(0, 0, 0, 0);
          
          if (!isNaN(shareDate.getTime())) {
            const diffTime = today.getTime() - shareDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            console.log(`Comparaison des dates : Aujourd'hui=${today.toISOString()}, Facture=${shareDate.toISOString()}, Diff Jours=${diffDays}`);
            
            if (diffTime >= 0 && diffDays < 30) {
              console.log('La facture date de moins de 30 jours, passage à actif.');
              shareData.active = true;
            } else {
              console.log('La facture date de plus de 30 jours ou est dans le futur, reste inactif.');
              shareData.active = false;
            }
          } else {
            console.warn('Date extraite invalide pour la comparaison:', shareData.starting_at);
            shareData.active = false;
          }
        } else {
          shareData.active = false;
        }

        pdfProcessingStatus.value = 'success'
        pdfProcessedSuccessfully = true
        
      } catch (processError) {
        console.error('Erreur pendant le traitement PDF ou la vérification:', processError)
        // S'assurer que l'erreur est affichée si ce n'est pas déjà fait
        if (!pdfProcessingStatus.value && !credentialVerificationStatus.value) {
           pdfProcessingStatus.value = 'error'
           pdfProcessingError.value = processError.message
        }
        // S'assurer que les flags sont corrects
        pdfProcessedSuccessfully = pdfProcessingStatus.value === 'success'
        credentialsVerifiedSuccessfully = credentialVerificationStatus.value === 'success'
        // On re-throw pour que le catch externe gère l'alerte finale si nécessaire
        throw processError;
      } finally {
        isProcessingPdf.value = false // Fin du traitement PDF global
        isVerifyingCredentials.value = false // Assurer que cet indicateur est éteint
      }
    }
    
    // Insertion en base de données uniquement si tout est OK
    if (pdfProcessedSuccessfully && credentialsVerifiedSuccessfully) {
        console.log('Données finales avant insertion (shareData):', shareData)
        const { error } = await $supabase
          .from('Session')
          .insert([shareData])

        if (error) {
            console.error('Erreur Supabase lors de l\'insertion:', error)
            throw error
        }

        alert('Partage créé avec succès!') // Utiliser un toast/snackbar ici idéalement
        
        newShare.value = {
          application: '',
          username: '',
          password: '',
          pdf: null,
          pdfData: null
        }
        showNewShareModal.value = false
        // TODO: Rafraîchir les données
    } else {
        // Si on arrive ici sans succès, c'est qu'une erreur a été attrapée et gérée visuellement
        console.log('Processus interrompu avant insertion BD.')
    }

  } catch (error) {
    console.error('Erreur globale interceptée dans handleNewShare:', error)
    // N'afficher une alerte que si l'erreur n'a pas déjà été affichée visuellement
    if (pdfProcessingStatus.value !== 'error' && credentialVerificationStatus.value !== 'error') {
        alert(error.message || 'Une erreur générale est survenue.')
    }
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