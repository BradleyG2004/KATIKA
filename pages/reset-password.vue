<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <NuxtLink to="/" class="flex items-center justify-center mb-8">
          <img class="h-6 w-auto" src="../public/image/logo.svg" alt="KATIKA" />
        </NuxtLink>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choisir un nouveau mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Retour à la connexion
          </NuxtLink>
        </p>
      </div>

      <!-- Message de succès -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              {{ success }}
            </p>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erreur
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="password" class="sr-only">Nouveau mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              name="confirm-password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const { $supabase } = useNuxtApp()

const handleResetPassword = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    if (password.value !== confirmPassword.value) {
      throw new Error('Les mots de passe ne correspondent pas')
    }

    const { error: resetError } = await $supabase.auth.updateUser({
      password: password.value
    })

    if (resetError) throw resetError

    success.value = 'Votre mot de passe a été réinitialisé avec succès.'
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script> 