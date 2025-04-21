<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="container mx-auto flex items-center justify-between p-6">
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img class="h-6 w-auto" src="../public/image/logo.svg" alt="KATIKA" />
          </NuxtLink>
        </div>
        <div class="hidden md:flex flex-1 justify-center">
          <div class="space-x-8 backdrop-blur-sm bg-white/30 rounded-full px-6 py-2">
            <NuxtLink to="/features" class="text-gray-800 hover:text-black transition-colors font-medium">Fonctionnalités</NuxtLink>
            <NuxtLink to="/how-it-works" class="text-gray-800 hover:text-black transition-colors font-medium">Comment ça marche</NuxtLink>
            <NuxtLink to="/pricing" class="text-black font-medium">Tarifs</NuxtLink>
          </div>
        </div>
        <div class="flex items-center space-x-4 flex-shrink-0">
          <NuxtLink to="/login" class="text-gray-800 hover:text-black font-medium">Se connecter</NuxtLink>
          <NuxtLink to="/signup" class="bg-black/90 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium shadow-lg">
            S'inscrire
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="pt-32 pb-24">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Tarifs</h1>
          <p class="text-xl text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
        </div>

        <!-- Pricing Plans -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <!-- Free Plan -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-all">
            <h3 class="text-2xl font-bold mb-4">Gratuit</h3>
            <div class="text-4xl font-bold mb-6">0€<span class="text-lg text-gray-600">/mois</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>1 abonnement partagé</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Recherche basique</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Support communautaire</span>
              </li>
            </ul>
            <NuxtLink to="/signup" class="block w-full bg-gray-100 text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-all text-center">
              Commencer
            </NuxtLink>
          </div>

          <!-- Premium Plan -->
          <div class="bg-black text-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all relative">
            <div class="absolute top-0 right-0 bg-white text-black px-4 py-1 rounded-tl-xl rounded-br-xl text-sm font-bold">
              Populaire
            </div>
            <h3 class="text-2xl font-bold mb-4">Premium</h3>
            <div class="text-4xl font-bold mb-6">4.99€<span class="text-lg text-gray-300">/mois</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Abonnements illimités</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Recherche avancée</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Support prioritaire</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Statistiques détaillées</span>
              </li>
            </ul>
            <NuxtLink to="/signup" class="block w-full bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all text-center">
              Choisir Premium
            </NuxtLink>
          </div>

          <!-- Business Plan -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-all">
            <h3 class="text-2xl font-bold mb-4">Business</h3>
            <div class="text-4xl font-bold mb-6">9.99€<span class="text-lg text-gray-600">/mois</span></div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Tout ce qui est inclus dans Premium</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Gestion d'équipe</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>API personnalisée</span>
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span>Support dédié</span>
              </li>
            </ul>
            <NuxtLink to="/signup" class="block w-full bg-black/90 text-white px-6 py-3 rounded-full hover:bg-black transition-all text-center">
              Choisir Business
            </NuxtLink>
          </div>
        </div>

        <!-- Savings Calculator -->
        <div class="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100 mb-16">
          <h3 class="text-2xl font-bold mb-6 text-center">Calculateur d'économies</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-lg font-semibold mb-4">Vos abonnements actuels</h4>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span>Netflix</span>
                  <span class="font-medium">15.99€/mois</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Spotify</span>
                  <span class="font-medium">9.99€/mois</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Disney+</span>
                  <span class="font-medium">8.99€/mois</span>
                </div>
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>34.97€/mois</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-4">Avec KATIKA</h4>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span>Netflix (partagé)</span>
                  <span class="font-medium">5.33€/mois</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Spotify (partagé)</span>
                  <span class="font-medium">3.33€/mois</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Disney+ (partagé)</span>
                  <span class="font-medium">3.00€/mois</span>
                </div>
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span class="text-green-600">11.66€/mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 text-center">
            <div class="text-2xl font-bold text-green-600">
              Économies mensuelles : 23.31€
            </div>
            <div class="text-gray-600 mt-2">
              Soit 279.72€ par an
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="max-w-4xl mx-auto">
          <h3 class="text-2xl font-bold mb-6 text-center">Questions fréquentes</h3>
          <div class="space-y-4">
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <h4 class="font-bold mb-2">Comment fonctionne le partage d'abonnements ?</h4>
              <p class="text-gray-600">Nous mettons en relation des utilisateurs souhaitant partager leurs abonnements. Chaque utilisateur paie sa part proportionnelle.</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <h4 class="font-bold mb-2">Est-ce que c'est légal ?</h4>
              <p class="text-gray-600">Oui, le partage d'abonnements est légal tant que les conditions d'utilisation des services sont respectées.</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <h4 class="font-bold mb-2">Comment sont gérés les paiements ?</h4>
              <p class="text-gray-600">Les paiements sont sécurisés et gérés directement sur notre plateforme. Nous utilisons des méthodes de paiement cryptées.</p>
            </div>
          </div>
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