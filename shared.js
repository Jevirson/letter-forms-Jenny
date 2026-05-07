// ── Supabase Config ──────────────────────────────────────────
const SUPABASE_URL = 'https://aeagsfjuvyzrupwzesix.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYWdzZmp1dnl6cnVwd3plc2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzI5MDEsImV4cCI6MjA5MzcwODkwMX0.ia3dd5iyNFBL8xHZX6EkRFoBEvp531umjYAiqZsiNH4';

const db = {
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON,
    'Authorization': 'Bearer ' + SUPABASE_ANON,
  },

  async getAll() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/letters?select=*&order=updated_at.desc`, {
      headers: this.headers
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getByKey(name, course) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/letters?student_name=eq.${encodeURIComponent(name)}&course=eq.${encodeURIComponent(course)}&select=*&limit=1`,
      { headers: this.headers }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] || null;
  },

  async getByName(name) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/letters?student_name=ilike.${encodeURIComponent(name)}&select=*&limit=1`,
      { headers: this.headers }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] || null;
  },

  async upsert(name, course, letter) {
    const existing = await this.getByKey(name, course);
    if (existing) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/letters?student_name=eq.${encodeURIComponent(name)}&course=eq.${encodeURIComponent(course)}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({ letter, updated_at: new Date().toISOString() })
        }
      );
      return res.ok;
    } else {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/letters`, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ student_name: name, course, letter })
      });
      return res.ok;
    }
  },

  async delete(name, course) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/letters?student_name=eq.${encodeURIComponent(name)}&course=eq.${encodeURIComponent(course)}`,
      { method: 'DELETE', headers: this.headers }
    );
    return res.ok;
  }
};

// ── Session (localStorage so it survives tab close) ──────────
const SESSION_KEY = 'farewell_jenny_session';
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } }
function setSession(role, name, course) { localStorage.setItem(SESSION_KEY, JSON.stringify({ role, name: name || '', course: course || '' })); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

// ── Profile (real name+course, persists across logout) ───────
const PROFILE_KEY = 'farewell_jenny_profile';
function getProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); } catch { return null; } }
function saveProfile(n, c) { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: n, course: c })); }
function clearProfile() { localStorage.removeItem(PROFILE_KEY); }

// ── Auth ─────────────────────────────────────────────────────
function authenticate(username, password) {
  if (username === 'student' && password === 'stud123') return 'student';
  if (username === 'Jenny'   && password === 'JennyGwapa') return 'teacher';
  return null;
}

// ── Redirect helpers ─────────────────────────────────────────
function redirectTo(path) { window.location.href = path; }

function requireRole(role) {
  const s = getSession();
  if (!s || s.role !== role) { redirectTo('login.html'); return false; }
  return true;
}

// ── Escape HTML ──────────────────────────────────────────────
function esc(v) {
  return String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function nl2br(v) { return esc(v).replace(/\n/g,'<br>'); }
