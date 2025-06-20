// https://nuxt.com/docs/api/configuration/nuxt-config
// import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt"
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      encryptionKey: process.env.NUXT_PUBLIC_ENCRYPTION_KEY,
      notchApiKeyPrivate: process.env.NUXT_PRIVATE_NOTCH_API_KEY,
      notchApiKeyPublic: process.env.NUXT_PUBLIC_NOTCH_API_KEY,
      cronSecret: process.env.CRON_SECRET
    }
  },
  app: {
    head: {
      script: [],
      meta: []
    }
  }
});