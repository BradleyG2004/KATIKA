<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="container mx-auto flex items-center justify-between p-6">
        <div class="flex-shrink-0">
          <a href="/" class="flex items-center space-x-2">
            <img class="h-6 w-auto" src="./image/logo.svg" alt="KATIKA" />
          </a>
        </div>
        <div class="hidden md:flex flex-1 justify-center">
          <div class="space-x-8 backdrop-blur-sm bg-white/30 rounded-full px-6 py-2">
            <a href="/features" class="text-black font-medium">Fonctionnalités</a>
            <a href="/how-it-works" class="text-gray-800 hover:text-black transition-colors font-medium">Comment ça marche</a>
            <a href="/pricing" class="text-gray-800 hover:text-black transition-colors font-medium">Tarifs</a>
          </div>
        </div>
        <div class="flex items-center space-x-4 flex-shrink-0">
          <a href="/login" class="text-gray-800 hover:text-black font-medium">Se connecter</a>
          <a href="/signup" class="bg-black/90 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium shadow-lg">
            S'inscrire
          </a>
        </div>
      </nav>
    </header>

    <main class="pt-32 pb-24">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Fonctionnalités</h1>
          <p class="text-xl text-gray-600">Découvrez comment KATIKA révolutionne le partage d'abonnements</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Recherche d'abonnements -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">🔍</div>
            <h3 class="text-2xl font-bold mb-4">Recherche Intelligente</h3>
            <p class="text-gray-600">Trouvez facilement des partenaires pour partager vos abonnements préférés</p>
          </div>

          <!-- Partage sécurisé -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-2xl font-bold mb-4">Partage Sécurisé</h3>
            <p class="text-gray-600">Transactions sécurisées et système de paiement intégré</p>
          </div>

          <!-- Gestion des abonnements -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-2xl font-bold mb-4">Gestion Simplifiée</h3>
            <p class="text-gray-600">Suivez vos abonnements et économies en temps réel</p>
          </div>

          <!-- Notifications -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">🔔</div>
            <h3 class="text-2xl font-bold mb-4">Alertes Personnalisées</h3>
            <p class="text-gray-600">Recevez des notifications pour les opportunités de partage</p>
          </div>

          <!-- Profil utilisateur -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">👤</div>
            <h3 class="text-2xl font-bold mb-4">Profil Personnalisé</h3>
            <p class="text-gray-600">Créez votre profil et partagez vos préférences</p>
          </div>

          <!-- Support -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-4xl mb-4">💬</div>
            <h3 class="text-2xl font-bold mb-4">Support Premium</h3>
            <p class="text-gray-600">Une équipe dédiée pour vous accompagner</p>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <a href="/signup" class="inline-block bg-black/90 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium text-lg shadow-xl">
            Commencer maintenant
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// No additional setup needed for this page
</script>

<style>
/* Reuse the same styles as home.vue */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

body {
  font-family: 'ClashDisplay', sans-serif;
}
</style> 