// plugins/init-user.ts
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  await userStore.fetchUser()
})
  