import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const reference = query.reference as string

  if (!reference) {
    // Redirige vers /sessions avec erreur si pas de référence
    return sendRedirect(event, '/sessions?payment=missing_reference')
  }

  const config = useRuntimeConfig()
  const NOTCHPAY_API_KEY = config.public.notchApiKey

  try {
    // Vérifier le paiement auprès de Notch Pay
    const response = await globalThis.$fetch<{ transaction: { status: string } }>('https://api.notchpay.co/payments/' + reference, {
      headers: {
        Authorization: NOTCHPAY_API_KEY
      }
    })

    // Mettre à jour la base de données (Supabase)
    // (À compléter : intégrer le client Supabase côté serveur ici si besoin)
    // if (response.transaction.status === 'complete') {
    //   await supabase.from('Subscription').update({ active: true }).eq('reference', reference)
    // }

    // Rediriger selon le statut
    if (response.transaction.status === 'complete') {
      return sendRedirect(event, '/sessions?payment=success')
    } else {
      return sendRedirect(event, '/sessions?payment=failed')
    }
  } catch (e) {
    // En cas d'erreur API ou réseau
    return sendRedirect(event, '/sessions?payment=error')
  }
}) 