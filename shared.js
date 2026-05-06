// ── Storage helpers ──────────────────────────────────────────
const STORAGE_KEY = 'farewell_jenny_letters';
const SESSION_KEY = 'farewell_jenny_session';

function getAllSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.letters)) return parsed.letters;
    return [];
  } catch { return []; }
}

function saveAllSubmissions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ letters: list }));
}

function buildKey(name, course) {
  return (name + '|' + course).toLowerCase().trim();
}

function getSubmission(name, course) {
  return getAllSubmissions().find(e => buildKey(e.student_name, e.course) === buildKey(name, course)) || null;
}

function upsertSubmission(name, course, letter) {
  const all = getAllSubmissions();
  const key = buildKey(name, course);
  const now = new Date().toLocaleString('en-PH', { hour12: true });
  const entry = { student_name: name.trim(), course: course.trim(), letter: letter.trim(), updated_at: now };
  const idx = all.findIndex(e => buildKey(e.student_name, e.course) === key);
  if (idx >= 0) all[idx] = entry; else all.unshift(entry);
  saveAllSubmissions(all);
}

function deleteSubmissionByKey(name, course) {
  const all = getAllSubmissions().filter(e => buildKey(e.student_name, e.course) !== buildKey(name, course));
  saveAllSubmissions(all);
}

function getOtherSubmissions(name, course) {
  return getAllSubmissions().filter(e => buildKey(e.student_name, e.course) !== buildKey(name, course));
}

// ── Session helpers ──────────────────────────────────────────
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

function setSession(role, name, course) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role, name: name || '', course: course || '' }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Auth ─────────────────────────────────────────────────────
const CREDENTIALS = {
  student: { username: 'student', password: 'stud123', role: 'student' },
  teacher: { username: 'Jenny',   password: 'JennyGwapa', role: 'teacher' },
};

function authenticate(username, password) {
  for (const c of Object.values(CREDENTIALS)) {
    if (c.username === username && c.password === password) return c.role;
  }
  return null;
}

// ── Redirect helpers ─────────────────────────────────────────
function redirectTo(path) { window.location.href = path; }

function requireRole(role) {
  const s = getSession();
  if (!s || s.role !== role) {
    redirectTo('login.html');
    return false;
  }
  return true;
}

function redirectIfLoggedIn() {
  const s = getSession();
  if (!s) return;
  if (s.role === 'student') redirectTo('home.html');
  if (s.role === 'teacher') redirectTo('teacher.html');
}

// ── Escape HTML ──────────────────────────────────────────────
function esc(v) {
  return String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function nl2br(v) {
  return esc(v).replace(/\n/g, '<br>');
}