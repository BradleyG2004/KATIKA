import { defineEventHandler, readBody } from 'h3'
import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    return { verified: false, error: 'Email ou mot de passe manquant.' }
  }

  let browser = null
  try {
    console.log('Lancement de Puppeteer pour vérification Netflix...')
    browser = await puppeteer.launch({
      headless: true, // 'new' ou true pour headless, false pour voir le navigateur
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Nécessaire dans certains environnements (Docker, CI)
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Voir https://crbug.com/750442
        '--disable-gpu'
      ] 
    })
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36') // User agent commun
    await page.setViewport({ width: 1280, height: 800 })

    console.log('Navigation vers la page de login Netflix...')
    await page.goto('https://www.netflix.com/fr/login', { waitUntil: 'networkidle2' })

    console.log('Saisie des identifiants...')
    // Attendre que les champs soient présents
    await page.waitForSelector('input[data-uia="field-userLoginId"]', { visible: true })
    await page.type('input[data-uia="field-userLoginId"]', email, { delay: 100 })
    
    await page.waitForSelector('input[data-uia="field-password"]', { visible: true })
    await page.type('input[data-uia="field-password"]', password, { delay: 100 })

    console.log('Clic sur le bouton de connexion...')
    await page.waitForSelector('button[data-uia="sign-in-button"]', { visible: true })
    await page.click('button[data-uia="sign-in-button"]')

    console.log('Attente de la navigation ou de l\'erreur...')
    // Attendre soit la navigation vers la page des profils, soit l'affichage d'un message d'erreur
    try {
        await page.waitForSelector('.list-profiles', { timeout: 15000 }) // Attendre la div des profils
        console.log('Page des profils détectée. Connexion réussie.')
        await browser.close()
        return { verified: true }
    } catch (profileError) {
        // Si la div des profils n'apparaît pas, vérifier les erreurs courantes
        const loginError = await page.$('[data-uia="text-login-error"]')
        const incorrectPassword = await page.$('[data-uia="text-incorrect-password"]')
        
        let errorMessage = 'Impossible de vérifier les identifiants (page des profils non trouvée).'
        if (loginError) {
           errorMessage = 'Erreur de connexion détectée par Netflix.'
           console.log(errorMessage)
        } else if (incorrectPassword) {
            errorMessage = 'Mot de passe incorrect détecté par Netflix.'
            console.log(errorMessage)
        } else {
            console.log("Aucun message d'erreur spécifique trouvé, timeout sur .list-profiles.")
        }
        
        await browser.close()
        return { verified: false, error: errorMessage }
    }

  } catch (error) {
    console.error('Erreur Puppeteer:', error)
    if (browser) {
      await browser.close()
    }
    // Renvoyer une erreur générique au client
    return { verified: false, error: 'Erreur technique lors de la vérification des identifiants.' }
  } finally {
     if (browser) {
       // S'assurer que le navigateur est fermé même en cas d'erreur inattendue
       // await browser.close() // Déjà fait dans try/catch, mais double sécurité si besoin
     }
  }
}) 