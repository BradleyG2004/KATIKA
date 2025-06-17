const cron = require('node-cron');
const fetch = require('node-fetch');

cron.schedule('1 0 * * *', async () => {
  // Remplacez par l'URL de votre Edge Function
  const functionUrl = 'https://urswssjhsxhwefbiduup.supabase.co/functions/v1/desact-sessions';

  const response = await fetch(functionUrl);

  if (!response.ok) {
    console.error('Erreur lors de l\'exécution de la fonction:', await response.text());
  } else {
    console.log('Fonction exécutée avec succès:', await response.text());
  }
});
