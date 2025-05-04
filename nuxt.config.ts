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
      cinetpayApiKey: process.env.CINETPAY_API_KEY,
      cinetpaySiteId: process.env.CINETPAY_SITE_ID
    }
  },
  app: {
    head: {
      script: [
        { src: "https://cdn.cinetpay.com/seamless/main.js" }
      ],
      meta: [
        { 'http-equiv': 'Cross-Origin-Opener-Policy', content: 'same-origin' },
        { 'http-equiv': 'Cross-Origin-Embedder-Policy', content: 'require-corp' }
      ]
    }
  }
});