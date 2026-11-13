const { getSql } = require('./_lib/db');
const { sendJson, setCors } = require('./_lib/http');

const PHASE_ORDER = ['raccolta', 'confermato', 'lancio_preparazione', 'pronto'];

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Metodo non consentito' });
    return;
  }

  try {
    const sql = getSql();
    const [config] = await sql`
      SELECT phase, threshold, monthly_price_cents, signup_fee_cents
      FROM founder_campaign_state WHERE id = 1
    `;
    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM founder_signups
      WHERE payment_status = 'paid' AND test_mode = false
    `;

    const thresholdReached = count >= config.threshold;
    // Lo stato passa automaticamente a "confermato" al raggiungimento della soglia,
    // ma non retrocede mai e rispetta un avanzamento manuale successivo (fasi 3/4).
    let phase = config.phase;
    if (thresholdReached && PHASE_ORDER.indexOf(phase) < PHASE_ORDER.indexOf('confermato')) {
      phase = 'confermato';
    }
    if (!thresholdReached) {
      phase = 'raccolta';
    }

    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    sendJson(res, 200, {
      count,
      threshold: config.threshold,
      thresholdReached,
      phase,
      monthlyPriceCents: config.monthly_price_cents,
      signupFeeCents: config.signup_fee_cents,
    });
  } catch (error) {
    console.error('founders-count error:', error.message);
    sendJson(res, 500, { error: 'Impossibile leggere il contatore' });
  }
};
