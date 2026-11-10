const { retrieveCheckoutSession } = require('./_lib/stripe');
const { sendJson, setCors } = require('./_lib/http');

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

  const sessionId = (req.query && req.query.session_id) || new URL(req.url, 'http://x').searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('cs_')) {
    sendJson(res, 400, { error: 'session_id mancante o non valido' });
    return;
  }

  try {
    const session = await retrieveCheckoutSession(sessionId);

    let status = 'unknown';
    if (session.payment_status === 'paid') status = 'paid';
    else if (session.status === 'open') status = 'pending';
    else if (session.status === 'expired') status = 'expired';
    else if (session.payment_status === 'unpaid') status = 'processing';

    sendJson(res, 200, {
      status,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('checkout-session-status error:', error.message);
    sendJson(res, 404, { status: 'unknown', error: 'Sessione non trovata' });
  }
};
