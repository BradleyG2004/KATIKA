import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const { $supabase } = useNuxtApp()

  if ($supabase) {
    // Écouter les changements d'état d'authentification
    $supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT') {
        // Rediriger vers la page de connexion si l'utilisateur se déconnecte
        navigateTo('/login')
      } else if (event === 'SIGNED_IN') {
        // Rediriger vers le dashboard si l'utilisateur se connecte
        navigateTo('/dashboard')
      }
    })
  }
}) 