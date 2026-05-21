const { URLSearchParams } = require('url');

const parseBody = async (req) => {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  return new URLSearchParams(body);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('Method Not Allowed');
    return;
  }

  const data = await parseBody(req);
  const submission = {
    type: 'demo-request',
    receivedAt: new Date().toISOString(),
    locale: data.get('locale') || '',
    email: data.get('email') || '',
    telefono: data.get('telefono') || '',
    bisogno: data.get('bisogno') || '',
  };

  console.log('Demo request:', submission);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ success: true }));
};