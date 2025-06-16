<template>
  <div>
    <div class="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Logo -->
        <div class="flex justify-center">
          <NuxtLink to="/">
            <img src="/image/logo.svg" alt="KATIKA" class="h-12 w-auto" />
          </NuxtLink>
        </div>

        <!-- Titre -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Créer un nouveau compte</h2>
          <p class="mt-2 text-sm text-gray-600">
            Ou
            <NuxtLink to="/login" class="font-medium text-gray-900 hover:underline">
              connectez-vous à votre compte
            </NuxtLink>
          </p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erreur d'inscription
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons de connexion sociale -->
        <div class="space-y-3">
          <!-- Google Sign-In Button -->
          <div id="g_id_onload" :data-client_id="runtimeConfig.public.googleClientId" data-context="signup"
            data-ux_mode="popup" data-callback="handleSignUpWithGoogle" data-auto_prompt="false"
            data-itp_support="true"></div>
          <div class="g_id_signin" data-type="standard" data-shape="rectangular" data-theme="outline"
            data-text="signup_with" data-size="large" data-width="400" data-logo_alignment="left"></div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input
              id="email"
              name="email"
              type="email"
              required
              v-model="email"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
            </div>
            <div>
              <label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
              <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              v-model="confirmPassword"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Confirm password"
            />
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const { $supabase } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

// Fonction d'inscription avec email/mot de passe
const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    if (password.value !== confirmPassword.value) {
      throw new Error('Les mots de passe ne correspondent pas')
    }

    const { data, error: signUpError } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (signUpError) throw signUpError

    // Redirection après inscription réussie
    navigateTo('/login?registered=true')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Générer le nonce et configurer Google Sign-In
onMounted(() => {
  // Logs détaillés pour le débogage
  console.log('=== Informations de débogage Google Sign-In ===');
  console.log('Origin complet:', window.location.origin);
  console.log('Hostname:', window.location.hostname);
  console.log('Protocol:', window.location.protocol);
  console.log('Port:', window.location.port);
  console.log('Pathname:', window.location.pathname);
  console.log('Google Client ID:', runtimeConfig.public.googleClientId);

  // Charger le script Google avec gestion d'erreur
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onerror = () => {
    console.error('Erreur de chargement du script Google')
    error.value = "Erreur lors du chargement de l'authentification Google"
  }

  document.head.appendChild(script)

    // Définir la fonction de callback globale pour Google avec plus de logs
    ; (window as any).handleSignUpWithGoogle = async (response: { credential: string }) => {
      try {
        loading.value = true
        error.value = ''

        console.log('Google Sign-Up Response received')

        if (!response?.credential) {
          throw new Error('Aucun jeton d\'authentification reçu de Google')
        }

        // Utiliser directement le token ID sans nonce
        const { data, error: signUpError } = await $supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential
        })

        if (signUpError) {
          console.error('Erreur Supabase:', signUpError)
          throw signUpError
        }

        if (data?.user) {
          console.log('Inscription réussie')
          await navigateTo('/dashboard')
        } else {
          throw new Error('Aucune donnée utilisateur reçue')
        }
      } catch (e: unknown) {
        console.error('Erreur détaillée:', e)
        error.value = e instanceof Error ? e.message : "Une erreur est survenue lors de l'inscription avec Google"
      } finally {
        loading.value = false
      }
    }
})
</script>

<style>
/* Styles pour le bouton Google */
.g_id_signin {
  width: 100% !important;
  display: flex;
  justify-content: center;
}

/* Style du conteneur du bouton pour assurer une largeur maximale appropriée */
.g_id_signin>div {
  max-width: 400px !important;
  width: 100% !important;
}
</style>