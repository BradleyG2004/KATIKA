<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <div v-if="isLoading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Vérification du paiement en cours...</p>
      </div>
      <div v-else-if="error" class="text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur de paiement</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <div class="space-y-3">
          <button @click="retryVerification" class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full">
            Réessayer
          </button>
          <button @click="redirectToSessions" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full">
            Retour aux sessions
          </button>
        </div>
      </div>
      <div v-else class="text-center">
        <div class="text-green-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Paiement réussi !</h2>
        <p class="text-gray-600 mb-4">Votre abonnement a été activé avec succès.</p>
        <button @click="redirectToSessions" class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Voir mes sessions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3

// Fonction pour rediriger vers la page des sessions
const redirectToSessions = () => {
  router.push('/sessions')
}

// Fonction pour réessayer la vérification
const retryVerification = async () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++
    isLoading.value = true
    error.value = null
    await verifyPayment(route.query.reference)
  } else {
    error.value = 'Nombre maximum de tentatives atteint. Veuillez contacter le support.'
  }
}

// Fonction pour vérifier le statut du paiement
const verifyPayment = async (reference) => {
  try {
    const config = useRuntimeConfig()
    const NOTCHPAY_API_KEY = config.public.notchApiKey

    // Première tentative avec l'API REST
    const response = await fetch(`https://api.notchpay.co/payments/${reference}`, {
      headers: {
        'Authorization': NOTCHPAY_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du paiement')
    }

    const data = await response.json()

    if (data.transaction.status === 'complete') {
    //   // Mettre à jour le statut de la souscription dans Supabase
    //   const { error: updateError } = await $supabase
    //     .from('Subscription')
    //     .update({ active: true })
    //     .eq('reference', reference)

    //   if (updateError) {
    //     throw new Error('Erreur lors de la mise à jour de la souscription')
    //   }
    alert("Success")
    } else if (data.transaction.status === 'pending') {
      // Si le paiement est en attente, on attend un peu et on réessaie
      await new Promise(resolve => setTimeout(resolve, 2000))
      throw new Error('Paiement en cours de traitement')
    } else {
      throw new Error('Le paiement n\'a pas été complété')
    }
  } catch (err) {
    console.error('Erreur de vérification:', err)
    
    // Gestion spécifique des erreurs WebSocket
    if (err.message.includes('WebSocket') || err.message.includes('ws.notchpay.co')) {
      error.value = 'Erreur de connexion au serveur de paiement. Veuillez réessayer.'
    } else if (err.message === 'Paiement en cours de traitement') {
      error.value = 'Le paiement est en cours de traitement. Veuillez patienter...'
      // Réessayer automatiquement après 2 secondes
      setTimeout(() => retryVerification(), 2000)
    } else {
      error.value = err.message
    }
  } finally {
    isLoading.value = false
  }
}

// Vérifier le paiement au chargement de la page
onMounted(async () => {
  const reference = route.query.reference
  if (!reference) {
    error.value = 'Référence de paiement manquante'
    isLoading.value = false
    return
  }

  await verifyPayment(reference)
})

// Nettoyer les ressources lors du démontage du composant
onUnmounted(() => {
  retryCount.value = 0
})
</script> 