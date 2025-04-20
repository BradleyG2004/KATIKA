<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
    <!-- Background Blur Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <!-- Decorative Stickers -->
    <div class="absolute top-20 right-10 w-24 h-24 animate-float">
      <div class="w-full h-full bg-black/5 rounded-full border-2 border-black/10 transform rotate-12"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold text-lg">💸</div>
    </div>

    <div class="absolute bottom-40 left-10 w-20 h-20 animate-float-delay">
      <div class="w-full h-full bg-black/5 rounded-full border-2 border-black/10 transform -rotate-12"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold text-lg">🎯</div>
    </div>

    <div class="absolute top-1/3 left-1/4 w-16 h-16 animate-float-delay-2">
      <div class="w-full h-full bg-black/5 rounded-full border-2 border-black/10 transform rotate-45"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold text-lg">✨</div>
    </div>

    <div class="absolute bottom-20 right-1/4 w-28 h-28 animate-float-delay-3">
      <div class="w-full h-full bg-black/5 rounded-full border-2 border-black/10 transform -rotate-45"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold text-lg">🚀</div>
    </div>

    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="container mx-auto flex items-center justify-between p-6">
        <div class="flex-shrink-0">
          <a href="/" class="flex items-center space-x-2">
            <img class="h-6 w-auto" src="./image/logo.svg" alt="KATIKA" />
          </a>
        </div>
        <div class="hidden md:flex flex-1 justify-center">
          <div class="space-x-8 backdrop-blur-sm bg-white/30 rounded-full px-6 py-2">
            <a href="/features" class="text-gray-800 hover:text-black transition-colors font-medium">Fonctionnalités</a>
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

    <main class="relative">
      <!-- Hero Section -->
      <div class="container mx-auto px-6 pt-40 pb-24">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
            Parta<span class="text-black">gez</span>, économi<span class="text-black">sez</span>,<br/> 
            profi<span class="text-black">tez</span> ensemble
          </h1>
          <p class="text-xl text-gray-700 mb-12 animate-fade-in-delay">
            Rejoignez la communauté qui révolutionne le partage d'abonnements.<br/>
            Des économies garanties sur vos services préférés.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
            <a href="/signup" class="bg-black/90 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium text-lg shadow-xl">
              Commencer maintenant
            </a>
            <a href="#how-it-works" class="bg-white/80 backdrop-blur-sm text-black px-8 py-4 rounded-full hover:bg-white transition-all transform hover:scale-105 font-medium text-lg border-2 border-black shadow-lg">
              Comment ça marche ?
            </a>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24">
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-black text-4xl font-bold mb-2">50%</div>
            <div class="text-gray-700">D'économies en moyenne</div>
          </div>
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-black text-4xl font-bold mb-2">10K+</div>
            <div class="text-gray-700">Utilisateurs satisfaits</div>
          </div>
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all border border-gray-100">
            <div class="text-black text-4xl font-bold mb-2">100%</div>
            <div class="text-gray-700">Sécurisé</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

/* Ensure smooth transitions */
.transition-all {
  transition-duration: 300ms;
}

/* Custom font */
body {
  font-family: 'ClashDisplay', sans-serif;
}

/* Enhanced shadows */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Sticker animations */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-10px) rotate(12deg); }
}

@keyframes float-delay {
  0%, 100% { transform: translateY(0) rotate(-12deg); }
  50% { transform: translateY(-10px) rotate(-12deg); }
}

@keyframes float-delay-2 {
  0%, 100% { transform: translateY(0) rotate(45deg); }
  50% { transform: translateY(-10px) rotate(45deg); }
}

@keyframes float-delay-3 {
  0%, 100% { transform: translateY(0) rotate(-45deg); }
  50% { transform: translateY(-10px) rotate(-45deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-float-delay-2 {
  animation: float-delay-2 3s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-delay-3 {
  animation: float-delay-3 3s ease-in-out infinite;
  animation-delay: 1.5s;
}
</style>