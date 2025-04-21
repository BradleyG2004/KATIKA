export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp()

  // Si Supabase n'est pas initialisé, rediriger vers la page de connexion
  if (!$supabase) {
    console.error('Supabase n\'est pas initialisé')
    return navigateTo('/login')
  }
  
  try {
    const { data: { session } } = await $supabase.auth.getSession()
    
    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
    if (!session && to.path === '/dashboard') {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error)
    return navigateTo('/login')
  }
}) 