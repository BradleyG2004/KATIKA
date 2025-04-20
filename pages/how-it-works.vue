<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="container mx-auto flex items-center justify-between p-6">
        <div class="flex-shrink-0">
          <NuxtLink href="/" class="flex items-center space-x-2">
            <img class="h-6 w-auto" src="./image/logo.svg" alt="KATIKA" />
          </NuxtLink>
        </div>
        <div class="hidden md:flex flex-1 justify-center">
          <div class="space-x-8 backdrop-blur-sm bg-white/30 rounded-full px-6 py-2">
            <NuxtLink href="/features" class="text-gray-800 hover:text-black transition-colors font-medium">Fonctionnalités</NuxtLink>
            <NuxtLink href="/how-it-works" class="text-black font-medium">Comment ça marche</NuxtLink>
            <NuxtLink href="/pricing" class="text-gray-800 hover:text-black transition-colors font-medium">Tarifs</NuxtLink>
          </div>
        </div>
        <div class="flex items-center space-x-4 flex-shrink-0">
          <NuxtLink href="/login" class="text-gray-800 hover:text-black font-medium">Se connecter</NuxtLink>
          <NuxtLink href="/signup" class="bg-black/90 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium shadow-lg">
            S'inscrire
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="pt-32 pb-24">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Comment ça marche</h1>
          <p class="text-xl text-gray-600">Un processus simple en 4 étapes pour commencer à économiser</p>
        </div>

        <!-- Process Steps -->
        <div class="max-w-6xl mx-auto">
          <!-- Step 1 -->
          <div class="flex flex-col md:flex-row items-center mb-16">
            <div class="w-full md:w-1/2 p-8">
              <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100">
                <div class="text-4xl mb-4">1️⃣</div>
                <h3 class="text-2xl font-bold mb-4">Créez votre profil</h3>
                <p class="text-gray-600">Inscrivez-vous gratuitement et complétez votre profil en quelques minutes</p>
              </div>
            </div>
            <div class="w-full md:w-1/2 p-8">
              <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100">
                <div class="text-4xl mb-4">2️⃣</div>
                <h3 class="text-2xl font-bold mb-4">Listez vos abonnements</h3>
                <p class="text-gray-600">Ajoutez les abonnements que vous souhaitez partager</p>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex flex-col md:flex-row items-center mb-16">
            <div class="w-full md:w-1/2 p-8">
              <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100">
                <div class="text-4xl mb-4">3️⃣</div>
                <h3 class="text-2xl font-bold mb-4">Trouvez des partenaires</h3>
                <p class="text-gray-600">Notre algorithme vous met en relation avec des utilisateurs compatibles</p>
              </div>
            </div>
            <div class="w-full md:w-1/2 p-8">
              <div class="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100">
                <div class="text-4xl mb-4">4️⃣</div>
                <h3 class="text-2xl font-bold mb-4">Commencez à économiser</h3>
                <p class="text-gray-600">Partagez vos abonnements et voyez vos économies augmenter</p>
              </div>
            </div>
          </div>

          <!-- Process Diagram -->
          <div class="relative hidden md:block">
            <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div class="w-1 h-64 bg-black/20"></div>
            </div>
            <div class="grid grid-cols-4 gap-8 relative z-10">
              <div class="text-center">
                <div class="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">1</div>
                <p class="text-sm font-medium">Inscription</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">2</div>
                <p class="text-sm font-medium">Abonnements</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">3</div>
                <p class="text-sm font-medium">Matching</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">4</div>
                <p class="text-sm font-medium">Économies</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <NuxtLink href="/signup" class="inline-block bg-black/90 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-black transition-all transform hover:scale-105 font-medium text-lg shadow-xl">
            Commencer maintenant
          </NuxtLink>
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