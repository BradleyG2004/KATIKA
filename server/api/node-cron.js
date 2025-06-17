// /api/cron-task
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL,
  process.env.NUXT_PUBLIC_SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  
  const functionUrl = 'https://urswssjhsxhwefbiduup.supabase.co/functions/v1/desact-sessions';

  try {
    // 1. D'abord, exécuter la fonction de désactivation des sessions
    const response = await fetch(functionUrl);

    if (!response.ok) {
      console.error('Erreur lors de l\'exécution de la fonction:', await response.text());
      return res.status(500).send('Erreur lors de l\'exécution de la fonction');
    }

    // 2. Récupérer les sessions désactivées
    const { data: inactiveSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id')
      .eq('active', false);

    if (sessionsError) {
      console.error('Erreur lors de la récupération des sessions inactives:', sessionsError);
      return res.status(500).send('Erreur lors de la récupération des sessions');
    }

    // 3. Désactiver toutes les souscriptions liées aux sessions inactives
    if (inactiveSessions && inactiveSessions.length > 0) {
      const sessionIds = inactiveSessions.map(session => session.id);
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ active: false })
        .in('session_id', sessionIds);

      if (updateError) {
        console.error('Erreur lors de la désactivation des souscriptions:', updateError);
        return res.status(500).send('Erreur lors de la désactivation des souscriptions');
      }

      console.log(`${inactiveSessions.length} sessions désactivées et leurs souscriptions associées`);
    }

    res.status(200).send('Opération terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    res.status(500).send('Erreur lors de la requête');
  }
}
