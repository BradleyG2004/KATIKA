import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://urswssjhsxhwefbiduup.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyc3dzc2poc3hod2VmYmlkdXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMTA3MTgsImV4cCI6MjA2MDY4NjcxOH0.0uxEtueoZxbwKV-0USQBMgFUf9MYMVNx6-S_OKLum94'
)

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | any,
    loading: false
  }),
  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const { data: { user } } = await supabase.auth.getUser()
        this.user = user
      } catch (error) {
        console.error('Error fetching user:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    },
    setUser(user: any) {
      this.user = user
    },
    clearUser() {
      this.user = null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isLoading: (state) => state.loading
  }
}) 