const { getNumbers } = require('../lib/github');
const { resolveRole } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, query } = req.body || {};
  const role = resolveRole(password);
  if (!role) return res.status(401).json({ error: 'Password salah.' });

  try {
    const { numbers } = await getNumbers();
    const q = (query || '').replace(/[^0-9]/g, '');
    const filtered = q ? numbers.filter((n) => n.includes(q)) : numbers;

    return res.status(200).json({
      role,
      total: numbers.length,
      count: filtered.length,
      numbers: filtered,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
