import { defineEventHandler, readBody } from 'h3'
import { chromium } from 'playwright'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { invoiceUrl, email, pdfData } = body

  console.log('Début de la vérification de facture avec:', {
    invoiceUrl: invoiceUrl,
    email: email,
    pdfData: {
      email: pdfData?.email,
      date: pdfData?.date,
      amount: pdfData?.amount
    }
  })

  if (!invoiceUrl || !email || !pdfData) {
    console.error('Données manquantes:', { invoiceUrl: !!invoiceUrl, email: !!email, pdfData: !!pdfData })
    return { 
      verified: false, 
      error: 'Certains éléments sont manquants. Veuillez vous assurer que le PDF contient toutes les informations nécessaires.' 
    }
  }

  let browser;
  try {
    console.log('Lancement du navigateur...')
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    })

    console.log('Création du contexte...')
    const context = await browser.newContext({
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
      geolocation: { longitude: 2.3522, latitude: 48.8566 },
      permissions: ['geolocation'],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    console.log('Création de la page...')
    const page = await context.newPage()

    try {
      console.log('Tentative d\'accès à l\'URL:', invoiceUrl)
      await page.goto(invoiceUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000
      })

      console.log('Page chargée, vérification du contenu...')
      const pageContent = await page.content()
      if (pageContent.includes('Page Not Found') || pageContent.includes('Error')) {
        throw new Error('La facture Netflix est introuvable ou inaccessible.')
      }

      console.log('Extraction des données de la page...')
      
      // Extraire les informations de la facture
      console.log('Recherche de l\'email...')
      const extractedEmail = await page.$eval('div[data-uia="invoice-email"]', (el) => {
        const content = el.textContent?.trim() || null;
        console.log('Email trouvé dans la page:', content);
        return content;
      }).catch((err) => {
        console.error('Erreur lors de l\'extraction de l\'email:', err);
        return null;
      });

      console.log('Recherche de la date...')
      const extractedDate = await page.$eval('td[data-uia="invoice-date-0"]', (el) => {
        const content = el.textContent?.trim() || null;
        console.log('Date trouvée dans la page:', content);
        return content;
      }).catch((err) => {
        console.error('Erreur lors de l\'extraction de la date:', err);
        return null;
      });

      console.log('Recherche du montant...')
      const extractedAmount = await page.$eval('td.rowValue', (el) => {
        const text = el.textContent?.trim() || '';
        const amount = text.replace('€', '').replace('&nbsp;', '').replace(',', '.').trim();
        console.log('Montant trouvé dans la page:', text, '-> normalisé:', amount);
        return amount;
      }).catch((err) => {
        console.error('Erreur lors de l\'extraction du montant:', err);
        return null;
      });

      console.log('Données extraites:', {
        email: extractedEmail,
        date: extractedDate,
        amount: extractedAmount
      })

      await browser.close()
      console.log('Navigateur fermé')

      // Vérification des données extraites
      if (!extractedEmail || !extractedDate || !extractedAmount) {
        console.error('Données manquantes après extraction:', {
          email: !!extractedEmail,
          date: !!extractedDate,
          amount: !!extractedAmount
        })
        const missingFields = []
        if (!extractedEmail) missingFields.push('email')
        if (!extractedDate) missingFields.push('date')
        if (!extractedAmount) missingFields.push('montant')
        
        return {
          verified: false,
          error: `Impossible de trouver les informations suivantes sur la facture : ${missingFields.join(', ')}`
        }
      }

      // Vérification des correspondances
      const isEmailMatch = extractedEmail.toLowerCase() === email.toLowerCase()
      const isDateMatch = extractedDate === pdfData.date
      const normalizedExtractedAmount = extractedAmount.replace(',', '.')
      const normalizedPdfAmount = String(pdfData.amount).replace(',', '.')
      const isAmountMatch = normalizedExtractedAmount === normalizedPdfAmount

      console.log('Résultats des comparaisons:', {
        emailMatch: {
          extracted: extractedEmail,
          provided: email,
          matches: isEmailMatch
        },
        dateMatch: {
          extracted: extractedDate,
          provided: pdfData.date,
          matches: isDateMatch
        },
        amountMatch: {
          extracted: normalizedExtractedAmount,
          provided: normalizedPdfAmount,
          matches: isAmountMatch
        }
      })

      if (!isEmailMatch) {
        return { 
          verified: false, 
          error: `L'adresse email de la facture (${extractedEmail}) ne correspond pas à celle fournie (${email}).` 
        }
      }

      if (!isDateMatch) {
        return { 
          verified: false, 
          error: `La date de la facture (${extractedDate}) ne correspond pas à celle du PDF (${pdfData.date}).` 
        }
      }

      if (!isAmountMatch) {
        return { 
          verified: false, 
          error: `Le montant de la facture (${normalizedExtractedAmount}€) ne correspond pas à celui du PDF (${normalizedPdfAmount}€).` 
        }
      }

      return { 
        verified: true,
        message: "Félicitations ! Votre facture Netflix a été vérifiée avec succès.",
        data: {
          email: extractedEmail,
          date: extractedDate,
          amount: extractedAmount
        }
      }

    } catch (error: any) {
      console.error('Erreur pendant le traitement de la page:', error)
      throw error
    } finally {
      if (page) {
        console.log('Fermeture de la page...')
        await page.close().catch(console.error)
      }
    }
  } catch (error: any) {
    console.error('Erreur principale:', error)
    
    try {
      if (browser) {
        console.log('Fermeture du navigateur après erreur...')
        await browser.close()
      }
    } catch (closeError) {
      console.error('Erreur lors de la fermeture du navigateur:', closeError)
    }

    if (error.message.includes('net::ERR_CONNECTION_TIMED_OUT')) {
      return {
        verified: false,
        error: 'La connexion à Netflix a pris trop de temps. Veuillez vérifier votre connexion internet et réessayer.'
      }
    }

    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      return {
        verified: false,
        error: "L'URL de la facture semble invalide. Veuillez vérifier que vous utilisez une facture Netflix récente."
      }
    }

    if (error.message.includes('Navigation failed')) {
      return {
        verified: false,
        error: "Nous n'avons pas pu accéder à votre facture Netflix. L'URL fournie pourrait être invalide ou expirée."
      }
    }

    return {
      verified: false,
      error: `Erreur lors de la vérification : ${error.message}`
    }
  }
}) 