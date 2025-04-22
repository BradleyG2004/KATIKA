<template>
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
        <h2 class="text-3xl font-bold text-gray-900">Connexion à votre compte</h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou
          <NuxtLink to="/register" class="font-medium text-gray-900 hover:underline">
            créer un nouveau compte
          </NuxtLink>
        </p>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Boutons de connexion sociale -->
      <div class="space-y-3">
        <!-- Google Sign-In Button -->
        <div 
          id="g_id_onload"
          :data-client_id="runtimeConfig.public.googleClientId"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          :data-nonce="hashedNonce"
          data-auto_prompt="false"
          data-itp_support="true"
        ></div>
        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-width="400"
          data-logo_alignment="left"
        ></div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>
      </div>

      <!-- Formulaire de connexion -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Adresse email</label>
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
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-gray-900 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            :disabled="loading"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref(null)
const nonce = ref('')
const hashedNonce = ref('')

// Fonction de connexion avec email/mot de passe
const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: signInError } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) throw signInError

    if (data?.user) {
      await router.push('/dashboard')
    } else {
      error.value = "Échec de la connexion. Veuillez réessayer."
    }
  } catch (e) {
    error.value = e.message || "Une erreur est survenue lors de la connexion"
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
  script.onerror = (error) => {
    console.error('Erreur de chargement du script Google:', error)
    error.value = "Erreur lors du chargement de l'authentification Google"
  }

  document.head.appendChild(script)

  // Générer le nonce
  const rawNonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  nonce.value = rawNonce
  
  // Hasher le nonce pour Google
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(rawNonce)
  crypto.subtle.digest('SHA-256', encodedNonce).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    hashedNonce.value = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  })

  // Définir la fonction de callback globale pour Google avec plus de logs
  window.handleSignInWithGoogle = async (response) => {
  try {
    loading.value = true
    error.value = null

    console.log('Google Sign-In Response received')

    if (!response?.credential) {
      throw new Error('Aucun jeton d\'authentification reçu de Google')
    }

    const { data, error: signInError } = await $supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential
      // nonce: nonce.value ❌ Supprime cette ligne
    })

    if (signInError) {
      console.error('Erreur Supabase:', signInError)
      throw signInError
    }

    if (data?.user) {
      console.log('Authentification réussie')
      await router.push('/dashboard')
    } else {
      throw new Error('Aucune donnée utilisateur reçue')
    }
  } catch (e) {
    console.error('Erreur détaillée:', e)
    error.value = e.message || "Une erreur est survenue lors de la connexion avec Google"
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
.g_id_signin > div {
  max-width: 400px !important;
  width: 100% !important;
}
</style> 