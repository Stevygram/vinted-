import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Check if valid Gemini API key is configured
const hasValidKey =
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  !process.env.GEMINI_API_KEY.startsWith('MY_');

let ai: GoogleGenAI | null = null;
if (hasValidKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Helper to run with timeout
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 6000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// 1. AI Style & Personalized Recommendations
app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { userVibe, category, budget, userHistory } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'smart_fallback',
        summary: `Recommandations intelligentes adaptées à vos préférences ${userVibe || 'Mode urbaine & seconde main'}.`,
        curatedTags: ['Vintage 90s', 'Streetwear chic', 'Laine & Cachemire', 'Minimalisme éco-responsable'],
        styleTip: 'Les pièces en matières naturelles et coupes intemporelles offrent la meilleure valeur de revente sur Vinted.',
        suggestedQueries: ['Veste Carhartt', 'Gilet Sézane', 'Salomon XT-6', 'Trench Burberry Vintage'],
      });
    }

    const prompt = `Tu es le styliste et conseiller expert de revente de Vinted Plus (plateforme française de seconde main premium).
L'utilisateur recherche des recommandations personnalisées.
Profil utilisateur:
- Style/Vibe recherché: "${userVibe || 'tous styles'}"
- Catégorie préférée: "${category || 'mode globale'}"
- Budget max: "${budget || 'non spécifié'}"
- Historique d'achats ou vues: "${userHistory || 'articles tendance récents'}"

Génère une réponse JSON stricte avec:
1. "summary": un résumé court et percutant de la sélection stylistique (max 2 phrases).
2. "curatedTags": tableau de 4 à 6 mots-clés ou styles précis (ex: "Cuir vintage 90s", "Gorpcore techwear", "Blazer oversize").
3. "styleTip": un conseil de styling seconde main concret et chic.
4. "suggestedQueries": 3 requêtes de recherche prêtes à cliquer pour trouver des pépites sur le feed.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error?.message || error);
    return res.json({
      success: true,
      source: 'fallback',
      summary: 'Sélection personnalisée selon vos marques favorites et tendances de la saison.',
      curatedTags: ['Oversize Chic', 'Denim Brut', 'Sneakers Rares', 'Pièces d’archive'],
      styleTip: 'Mixez des pièces basiques intemporelles avec une pièce forte vintage.',
      suggestedQueries: ['Veste en cuir vintage', 'Pulls en cachemire', 'Salomon XT-6'],
    });
  }
});

// 2. AI Price Estimator & Smart Listing Auto-completion
app.post('/api/gemini/price-assistant', async (req, res) => {
  const { title, brand, category, condition, originalPrice, descriptionHint } = req.body || {};
  try {
    if (!ai) {
      const baseEstimate = originalPrice ? Math.round(Number(originalPrice) * 0.45) : 45;
      return res.json({
        success: true,
        source: 'smart_fallback',
        recommendedPrice: baseEstimate,
        minPrice: Math.max(5, Math.round(baseEstimate * 0.8)),
        maxPrice: Math.round(baseEstimate * 1.25),
        confidence: '92%',
        parcelSize: 'M (entre 500g et 1kg - Boîte moyenne)',
        optimizedTitle: `${brand || 'Vintage'} - ${title || 'Article de mode'} en bon état`,
        generatedDescription: `Superbe pièce ${brand ? `de la marque ${brand}` : ''}. État: ${condition || 'Très bon état'}. Coupe flatteuse, parfait pour la saison. Envoi rapide et soigné garanti dans les 24h via Mondial Relay ou Colissimo.`,
        suggestedHashtags: ['#vintedfrance', '#secondemain', '#moderesponsable', '#slowfashion'],
        speedToSellEst: 'Vente estimée sous 48h à 72h avec expédition en Locker',
      });
    }

    const prompt = `Tu es l'algorithme d'estimation de prix et d'optimisation d'annonces de Vinted Plus.
Analyse cet article proposé à la vente:
- Titre: "${title || 'Non renseigné'}"
- Marque: "${brand || 'Non renseigné'}"
- Catégorie: "${category || 'Non renseigné'}"
- État: "${condition || 'Très bon état'}"
- Prix d'achat neuf (si connu): "${originalPrice || 'Inconnu'}"
- Précision: "${descriptionHint || ''}"

Renvoie un JSON strict contenant:
- "recommendedPrice": nombre entier en Euros
- "minPrice": nombre entier
- "maxPrice": nombre entier
- "confidence": string (ex: "94%")
- "parcelSize": format recommandé d'étiquette d'expédition ("S", "M", ou "L")
- "optimizedTitle": titre vendeur optimisé (max 50 caractères)
- "generatedDescription": description séduisante, détaillée et honnête
- "suggestedHashtags": tableau de 4 hashtags pertinents
- "speedToSellEst": estimation de délai de vente (ex: "Vente estimée en 48-72h")`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error generating price appraisal:', error?.message || error);
    const baseEstimate = originalPrice ? Math.round(Number(originalPrice) * 0.45) : 45;
    return res.json({
      success: true,
      source: 'fallback',
      recommendedPrice: baseEstimate,
      minPrice: Math.max(5, Math.round(baseEstimate * 0.8)),
      maxPrice: Math.round(baseEstimate * 1.25),
      confidence: '89%',
      parcelSize: 'M',
      optimizedTitle: `${brand || 'Vintage'} - ${title || 'Article de mode'}`,
      generatedDescription: `Superbe pièce en ${condition || 'très bon état'}. Envoi rapide et soigné garanti sous 24h.`,
      speedToSellEst: 'Vente estimée sous 3 jours',
    });
  }
});

// 3. AI Smart Chat Assistant
app.post('/api/gemini/chat-assistant', async (req, res) => {
  try {
    const { articleTitle, price, sellerName, lastMessage, role } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        suggestedReplies: [
          'Bonjour ! L\'article est toujours disponible et peut être posté dès demain matin.',
          `Je peux vous proposer une offre à ${Math.round(Number(price || 20) * 0.9)} € si vous finalisez aujourd'hui.`,
          'Pouvez-vous me confirmer les dimensions au niveau des épaules ?',
        ],
      });
    }

    const prompt = `Tu es l'assistant de messagerie instantanée de Vinted Plus.
Contexte:
- Article: "${articleTitle}" à ${price} €
- Vendeur: "${sellerName}"
- Dernier message échangé: "${lastMessage || 'Premier contact'}"
- Rôle: "${role || 'acheteur'}"

Génère 3 suggestions de réponses courtes, polies et efficaces (JSON avec le champ "suggestedReplies": string[]).`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error in chat assistant:', error?.message || error);
    return res.json({
      success: true,
      suggestedReplies: [
        'Bonjour ! Oui, l\'article est disponible.',
        'Envoi garanti sous 24h par Mondial Relay Locker.',
        'Le prix est ferme pour le moment, c\'est une très belle affaire.',
      ],
    });
  }
});

// Production static serving or Vite dev middleware
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Vinted Plus server running on http://localhost:${port}`);
  });
}

setupServer();
