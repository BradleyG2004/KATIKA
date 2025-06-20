<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p class="text-gray-600">Traitement du paiement en cours...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-500">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600">{{ error }}</p>
        <NuxtLink to="/dashboard" class="text-blue-600 hover:text-blue-800">
          Retour au dashboard
        </NuxtLink>
      </div>
      <div v-else class="space-y-4">
        <div class="text-green-500">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-gray-600">Paiement traité avec succès !</p>
        <NuxtLink to="/dashboard" class="text-blue-600 hover:text-blue-800">
          Retour au dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { $supabase } = useNuxtApp()
const config = useRuntimeConfig()
const NOTCHPAY_API_KEY = config.public.notchApiKeyPublic
const NOTCHPAY_PRIVATE_KEY = config.public.notchApiKeyPrivate
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const reference = route.query.reference

    if (!reference) {
      throw new Error('Référence de paiement manquante')
    }

    // Récupérer les informations du paiement
    const paymentResponse = await fetch(`https://api.notchpay.co/payments/${reference}`, {
      headers: {
        'Authorization': NOTCHPAY_API_KEY
      }
    })

    if (!paymentResponse.ok) {
      throw new Error('Erreur lors de la récupération des informations du paiement')
    }

    const paymentData = await paymentResponse.json()
    console.log('Données du paiement:', paymentData) // Pour le débogage

    // Vérifier si le paiement est réussi
    if (!paymentData.transaction || (paymentData.transaction.status !== 'success' && 
        paymentData.transaction.status !== 'completed' && 
        paymentData.transaction.status !== 'complete')) {
      throw new Error('Le paiement n\'a pas été validé')
    }

    // Récupérer l'utilisateur actuel
    const { data: { user } } = await $supabase.auth.getUser()

    // Créer le bénéficiaire Notch Pay
    const beneficiary = {
      name: user.user_metadata?.name || user.email.split('@')[0],
      email: user.email,
      phone: paymentData.transaction.customer?.phone || '+237652589508',
      country: "CM",
      currency: "XAF",
      type: "mobile_money",
      metadata: {
        user_id: user.id,
        payment_reference: reference,
        payment_status: paymentData.transaction.status,
        payment_id: paymentData.transaction.reference
      }
    }

    console.log('Tentative de création du bénéficiaire avec la clé PRI:', NOTCHPAY_PRIVATE_KEY) // Pour le débogage
    console.log('Tentative de création du bénéficiaire avec la clé PUB:', NOTCHPAY_API_KEY) // Pour le débogage

    try {
      const beneficiaryResponse = await $fetch('/api/beneficiaries', {
        method: 'POST',
        body: beneficiary
      })

      console.log('Bénéficiaire créé avec succès:', beneficiaryResponse)
      
      // Récupérer les détails complets du bénéficiaire
      const beneficiaryDetailsResponse = await $fetch(`/api/beneficiaries/${beneficiaryResponse.id}`, {
        method: 'GET'
      })

      if (beneficiaryDetailsResponse) {
        console.log('Détails du bénéficiaire:', beneficiaryDetailsResponse)
      }
    } catch (error) {
      console.error('Erreur lors de la création du bénéficiaire:', error)
      throw new Error(`Erreur lors de la création du bénéficiaire: ${error.message}`)
    }

    // Rediriger vers le dashboard après un court délai
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 5000)

  } catch (err) {
    console.error('Erreur lors du traitement du paiement:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script> 