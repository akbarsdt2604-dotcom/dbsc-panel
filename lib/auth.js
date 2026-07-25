// Peran ditentukan SEPENUHNYA oleh password mana yang cocok, di server.
// Frontend tidak bisa mengaku-ngaku jadi admin — server yang memutuskan.
function resolveRole(password) {
  if (!password) return null;
  if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) return 'admin';
  if (process.env.CUSTOMER_PASSWORD && password === process.env.CUSTOMER_PASSWORD) return 'customer';
  return null;
}

module.exports = { resolveRole };
