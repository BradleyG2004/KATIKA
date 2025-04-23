import { defineNuxtPlugin } from '#app'
import * as pdfjsLib from 'pdfjs-dist'

// Importez le chemin du worker. L'URL sera résolue par le bundler.
// Essayez .mjs ou .js selon la version/bundler
import pdfWorkerPath from 'pdfjs-dist/build/pdf.worker.mjs?url' 

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Configurer le worker en utilisant le chemin importé
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerPath
  }

  return {
    provide: {
      pdfjs: pdfjsLib
    }
  }
}) 