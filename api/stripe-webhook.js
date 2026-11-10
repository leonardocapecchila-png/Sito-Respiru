const { getSql } = require('./_lib/db');
const { verifyWebhookSignature } = require('./_lib/stripe');
const { readRawBody, sendJson } = require('./_lib/http');

const getCustomField = (customFields, key) => {
  if (!Array.isArray(customFields)) return null;
  const field = customFields.find((f) => f.key === key);
  if (!field) return null;
  const typeValue = field[field.type];
  return (typeValue && typeValue.value) || null;
};

const upsertFromSession = async (sql, session, paymentStatus, event) => {
  const fullName = getCustomField(session.custom_fields, 'full_name');
  const restaurantName = getCustomField(session.custom_fields, 'restaurant_name');
  const phone = getCustomField(session.custom_fields, 'phone');
  const email = (session.customer_details && session.customer_details.email) || null;
  const termsAccepted = Boolean(session.consent && session.consent.terms_of_service === 'accepted');
  const termsVersion = (session.metadata && session.metadata.terms_version) || null;

  await sql`
    INSERT INTO founder_signups (
      full_name, restaurant_name, email, phone,
      amount_cents, currency, payment_status,
      stripe_checkout_session_id, stripe_payment_intent_id,
      terms_accepted, terms_version, test_mode, raw_event
    ) VALUES (
      ${fullName}, ${restaurantName}, ${email}, ${phone},
      ${session.amount_total}, ${session.currency}, ${paymentStatus},
      ${session.id}, ${session.payment_intent || null},
      ${termsAccepted}, ${termsVersion}, ${!event.livemode}, ${JSON.stringify(event)}
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET
      full_name = COALESCE(EXCLUDED.full_name, founder_signups.full_name),
      restaurant_name = COALESCE(EXCLUDED.restaurant_name, founder_signups.restaurant_name),
      email = COALESCE(EXCLUDED.email, founder_signups.email),
      phone = COALESCE(EXCLUDED.phone, founder_signups.phone),
      payment_status = EXCLUDED.payment_status,
      stripe_payment_intent_id = COALESCE(EXCLUDED.stripe_payment_intent_id, founder_signups.stripe_payment_intent_id),
      terms_accepted = EXCLUDED.terms_accepted OR founder_signups.terms_accepted,
      terms_version = COALESCE(EXCLUDED.terms_version, founder_signups.terms_version),
      raw_event = EXCLUDED.raw_event
    WHERE founder_signups.payment_status IS DISTINCT FROM 'paid' OR EXCLUDED.payment_status = 'paid'
  `;
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Metodo non consentito' });
    return;
  }

  const rawBody = await readRawBody(req);
  const signatureHeader = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = verifyWebhookSignature(rawBody, signatureHeader, webhookSecret);
  } catch (error) {
    console.error('Firma webhook non valida:', error.message);
    sendJson(res, 400, { error: 'Firma non valida' });
    return;
  }

  try {
    const sql = getSql();
    const session = event.data && event.data.object;

    switch (event.type) {
      case 'checkout.session.completed': {
        const status = session.payment_status === 'paid' ? 'paid' : 'pending';
        await upsertFromSession(sql, session, status, event);
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        await upsertFromSession(sql, session, 'paid', event);
        break;
      }
      case 'checkout.session.async_payment_failed': {
        await upsertFromSession(sql, session, 'failed', event);
        break;
      }
      case 'checkout.session.expired': {
        await sql`
          UPDATE founder_signups
          SET payment_status = 'canceled'
          WHERE stripe_checkout_session_id = ${session.id}
            AND payment_status = 'pending'
        `;
        break;
      }
      default:
        // Evento non rilevante per la campagna: ricevuto ma ignorato.
        break;
    }

    sendJson(res, 200, { received: true });
  } catch (error) {
    console.error('Errore elaborazione webhook:', error.message);
    // 200 verso Stripe per evitare retry infiniti su un errore nostro non transitorio;
    // l'evento resta comunque ispezionabile nei log e nella Stripe Dashboard.
    sendJson(res, 200, { received: true, warning: 'logged_error' });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
