const OWNER = process.env.GITHUB_OWNER || 'akbarsdt2604-dotcom';
const REPO = process.env.GITHUB_REPO || 'dbsc';
const PATH = process.env.GITHUB_PATH || 'db.json';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

function headers() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
  };
}

function b64EncodeUnicode(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}
function b64DecodeUnicode(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Ambil daftar nomor saat ini + sha (dibutuhkan untuk update)
async function getNumbers() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}?ref=${encodeURIComponent(BRANCH)}`;
  const res = await fetch(url, { headers: headers() });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`GitHub GET gagal (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = b64DecodeUnicode(data.content.replace(/\n/g, ''));
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    return { sha: data.sha, numbers: parsed.map(String), shape: 'array', objectMeta: {} };
  }
  if (parsed && typeof parsed === 'object') {
    return { sha: data.sha, numbers: Object.keys(parsed), shape: 'object', objectMeta: parsed };
  }
  throw new Error('Format db.json tidak dikenali.');
}

// Simpan daftar nomor baru ke GitHub (commit baru)
async function saveNumbers({ numbers, sha, shape, objectMeta }, commitMessage) {
  let content;
  if (shape === 'object') {
    const obj = {};
    numbers.forEach((n) => {
      obj[n] = Object.prototype.hasOwnProperty.call(objectMeta, n) ? objectMeta[n] : true;
    });
    content = JSON.stringify(obj, null, 2);
  } else {
    content = JSON.stringify(numbers, null, 2);
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: b64EncodeUnicode(content),
      sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`GitHub PUT gagal (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content.sha;
}

module.exports = { getNumbers, saveNumbers, OWNER, REPO, PATH, BRANCH };
