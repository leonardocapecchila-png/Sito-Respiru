const { getSql } = require('./_lib/db');
const { createCheckoutSession } = require('./_lib/stripe');
const { sendJson, setCors } = require('./_lib/http');

const SITE_URL = process.env.SITE_URL || 'https://respiru.it';
const TERMS_VERSION = process.env.FOUNDER_TERMS_VERSION || '2026-11-v1';

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Metodo non consentito' });
    return;
  }

  try {
    const sql = getSql();
    const [config] = await sql`SELECT signup_fee_cents, monthly_price_cents FROM founder_campaign_state WHERE id = 1`;

    if (!config) {
      sendJson(res, 500, { error: 'Configurazione campagna non trovata' });
      return;
    }

    const session = await createCheckoutSession({
      mode: 'payment',
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: config.signup_fee_cents,
            product_data: {
              name: 'Respiru — Quota di adesione Founding Restaurant',
              description: `Quota una tantum di ${(config.signup_fee_cents / 100).toFixed(2)}€, interamente scalata dal primo canone mensile Founder (${(config.monthly_price_cents / 100).toFixed(2)}€/mese).`,
            },
          },
        },
      ],
      custom_fields: [
        {
          key: 'full_name',
          label: { type: 'custom', custom: 'Nome e cognome' },
          type: 'text',
          text: { minimum_length: 2, maximum_length: 120 },
        },
        {
          key: 'restaurant_name',
          label: { type: 'custom', custom: 'Nome del ristorante' },
          type: 'text',
          text: { minimum_length: 2, maximum_length: 160 },
        },
        {
          key: 'phone',
          label: { type: 'custom', custom: 'Telefono (facoltativo)' },
          type: 'text',
          optional: true,
          text: { maximum_length: 30 },
        },
      ],
      consent_collection: {
        terms_of_service: 'required',
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `Accetto i [termini della campagna Founding Restaurants](${SITE_URL}/termini-founder) e l'[informativa privacy](${SITE_URL}/termini-founder#privacy) di Respiru.`,
        },
        submit: {
          message: 'La quota di adesione viene scalata interamente dal primo canone mensile Founder.',
        },
      },
      metadata: {
        campaign: 'founding_restaurants',
        terms_version: TERMS_VERSION,
      },
      success_url: `${SITE_URL}/founder-benvenuto?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/founder-annullato`,
    });

    // Riga "pending" creata subito: diventa "paid" solo quando il webhook conferma il pagamento.
    await sql`
      INSERT INTO founder_signups (amount_cents, stripe_checkout_session_id, payment_status, test_mode, terms_version)
      VALUES (${config.signup_fee_cents}, ${session.id}, 'pending', ${!session.livemode}, ${TERMS_VERSION})
      ON CONFLICT (stripe_checkout_session_id) DO NOTHING
    `;

    sendJson(res, 200, { url: session.url });
  } catch (error) {
    console.error('create-checkout-session error:', error.message);
    sendJson(res, 500, { error: 'Impossibile avviare il checkout. Riprova tra poco.' });
  }
};
