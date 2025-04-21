export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp()
  const { data: { session } } = await $supabase.auth.getSession()

  if (session) {
    return navigateTo('/dashboard')
  }
}) 