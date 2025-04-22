<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- Logo -->
      <div>
        <NuxtLink to="/" class="inline-block">
          <img class="h-12 w-auto" src="/image/logo.svg" alt="KATIKA" />
        </NuxtLink>
      </div>

      <!-- Content -->
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
        <p class="text-gray-600 mb-6">
          Nous avons envoyé un lien de vérification à votre adresse email. Veuillez cliquer sur le lien pour activer votre compte.
        </p>

        <div class="space-y-4">
          <button
            @click="resendVerification"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            :disabled="loading"
          >
            {{ loading ? 'Envoi en cours...' : 'Renvoyer l\'email' }}
          </button>

          <button
            @click="checkVerification"
            class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            :disabled="loading"
          >
            Vérifier maintenant
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const error = ref('')

const client = useSupabaseClient()

const resendVerification = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: resendError } = await client.auth.resend({
      type: 'signup',
      email: client.auth.user()?.email
    })

    if (resendError) throw resendError
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const checkVerification = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data: { user }, error: checkError } = await client.auth.getUser()

    if (checkError) throw checkError

    if (user?.email_confirmed_at) {
      navigateTo('/dashboard')
    } else {
      error.value = 'Email non encore vérifié'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script> 