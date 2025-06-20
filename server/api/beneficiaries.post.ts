import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    if (!config.public.notchApiKeyPublic || !config.public.notchApiKeyPrivate) {
      throw createError({
        statusCode: 500,
        message: 'Configuration Notch Pay manquante'
      })
    }

    const response = await fetch('https://api.notchpay.co/beneficiaries', {
      method: 'POST',
      headers: {
        'Authorization': config.public.notchApiKeyPublic,
        'X-Grant': config.public.notchApiKeyPrivate,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: JSON.stringify(data)
      })
    }

    return data
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du bénéficiaire'
    })
  }
}) 