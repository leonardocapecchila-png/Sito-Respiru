const crypto = require('crypto');

const STRIPE_API = 'https://api.stripe.com/v1';

const encodeParams = (obj, prefix = '') => {
  const parts = [];
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${fullKey}[${index}]`;
        if (typeof item === 'object' && item !== null) {
          parts.push(encodeParams(item, arrayKey));
        } else {
          parts.push(`${encodeURIComponent(arrayKey)}=${encodeURIComponent(item)}`);
        }
      });
    } else if (typeof value === 'object') {
      parts.push(encodeParams(value, fullKey));
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
    }
  });
  return parts.join('&');
};

const stripeRequest = async (method, path, params) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY non configurata');
  }

  const options = {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-06-20',
    },
  };

  if (params && method !== 'GET') {
    options.body = encodeParams(params);
  }

  const response = await fetch(`${STRIPE_API}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    const message = (data && data.error && data.error.message) || `Stripe API error (${response.status})`;
    const err = new Error(message);
    err.stripeError = data.error;
    throw err;
  }

  return data;
};

const createCheckoutSession = (params) => stripeRequest('POST', '/checkout/sessions', params);

const retrieveCheckoutSession = (id) => stripeRequest('GET', `/checkout/sessions/${id}`);

/**
 * Verifica la firma di un webhook Stripe senza dipendere dall'SDK ufficiale.
 * Vedi https://stripe.com/docs/webhooks/signatures
 */
const verifyWebhookSignature = (rawBody, signatureHeader, webhookSecret, toleranceSeconds = 300) => {
  if (!signatureHeader) {
    throw new Error('Header Stripe-Signature mancante');
  }
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET non configurata');
  }

  const parts = signatureHeader.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    if (key === 't') acc.timestamp = value;
    if (key === 'v1') acc.signatures = (acc.signatures || []).concat(value);
    return acc;
  }, {});

  if (!parts.timestamp || !parts.signatures || parts.signatures.length === 0) {
    throw new Error('Formato della firma non valido');
  }

  const signedPayload = `${parts.timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const isValid = parts.signatures.some((sig) => {
    const sigBuffer = Buffer.from(sig, 'utf8');
    return sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  });

  if (!isValid) {
    throw new Error('Firma non valida');
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(parts.timestamp));
  if (ageSeconds > toleranceSeconds) {
    throw new Error('Timestamp della firma fuori tolleranza (possibile replay)');
  }

  return JSON.parse(rawBody);
};

module.exports = { createCheckoutSession, retrieveCheckoutSession, verifyWebhookSignature };
