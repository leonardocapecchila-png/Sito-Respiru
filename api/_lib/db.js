const { neon } = require('@neondatabase/serverless');

let client;

const getSql = () => {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL non configurata');
    }
    client = neon(connectionString);
  }
  return client;
};

module.exports = { getSql };
