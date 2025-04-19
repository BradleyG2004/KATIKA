<template>
  <div>
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img class="h-8 w-auto" src="./image/logo.svg" alt="KATIKA" />
          </a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/login" class="text-sm/6 font-semibold text-green-900">Log in <span aria-hidden="true">&rarr;</span></a>
        </div>
      </nav>
    </header>

    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#151515] to-[#373738] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>
      <br>
      <div class="mx-auto py-32 sm:py-48 lg:py-30 relative"
        style="border-width:10px;border-color:green;border-radius: 10px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
        <div class="text-center">
          <h1 class="text-balance text-1xl font-semibold tracking-tight text-gray-900 sm:text-8xl">
            Parta<span style="color: green;"><u>gez, économi</u></span>sez, profi<span
              style="color: green;"><u>tez</u></span>
          </h1>
          <p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Des abonnements à prix réduits et des économies garanties
          </p>
          <br>
        </div>
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
          <div
            class="relative rounded-full px-3 py-1 text-sm/6 text-green-900 ring-2 ring-gray-700 hover:ring-gray-900">
            On y gagne tous quelque chose.
            <a href="#" class="font-semibold text-green-600">
              <span class="absolute inset-0" aria-hidden="true"></span>
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <img class="absolute bottom-0 right-0 h-60 w-auto" src="./image/arrow.svg" alt="arrow" />
        <img class="absolute top-0 left-0 h-60 w-auto" src="./image/eyes.svg" alt="arrow" />
      </div>

      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true">
        <div
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#151515] to-[#373738] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)
</script>
<style>
div {
  font-family: 'Boxing', sans-serif;
}
</style>