const { getNumbers, saveNumbers } = require('../lib/github');
const { resolveRole } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, number } = req.body || {};
  const role = resolveRole(password);
  if (!role) return res.status(401).json({ error: 'Password salah.' });

  const num = (number || '').replace(/[^0-9]/g, '');
  if (!num) return res.status(400).json({ error: 'Nomor tidak valid.' });

  try {
    const state = await getNumbers();
    if (state.numbers.includes(num)) {
      return res.status(409).json({ error: `Nomor ${num} sudah ada di database.` });
    }

    state.numbers.push(num);
    await saveNumbers(state, `[web:${role}] tambah nomor ${num}`);

    return res.status(200).json({ ok: true, role, number: num, total: state.numbers.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
