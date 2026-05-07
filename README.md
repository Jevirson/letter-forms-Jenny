# 💌 Farewell Ms. Jenny — Letter Portal

A static web app for students to write farewell letters to their teacher, Ms. Jenny. Built with pure HTML, CSS, and JavaScript — no server required. Works perfectly on GitHub Pages.

## Features

- 🎓 **Student Portal** — Write, edit, and delete your farewell letter
- 👩‍🏫 **Teacher Portal** — Ms. Jenny can read all submitted letters
- 🏠 **Student Home Page** — Dashboard with quick actions
- 📖 **Browse Letters** — See what classmates have written
- 💾 **Persistent Storage** — Letters are saved in browser localStorage

## How to Use

### Option 1: GitHub Pages
1. Fork or upload this repo to GitHub
2. Go to **Settings → Pages** → set source to `main` branch, root `/`
3. Visit `https://yourusername.github.io/your-repo-name/`

### Option 2: Run Locally
Just open `index.html` in any browser — no server needed!

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Student | `student` | `stud123` |
| Teacher | `Jenny` | `JennyGwapa` |

> ⚠️ **Note:** Since this is a static site, letters are stored in the browser's **localStorage**. All users sharing the same browser/device will see the same letters. For a shared classroom experience, students should use the same browser profile or a shared device. To use across different devices, a backend/database would be needed.

## Files

```
├── index.html      — Role selection landing page
├── login.html      — Login page (shared for both roles)
├── home.html       — Student home page (dashboard)
├── teacher.html    — Teacher's read-only letter view
├── app.css         — All styles
├── shared.js       — Auth, storage, and utility functions
└── README.md
```

## Customization

To change credentials, edit the `CREDENTIALS` object in `shared.js`:

```js
const CREDENTIALS = {
  student: { username: 'student', password: 'stud123', role: 'student' },
  teacher: { username: 'Jenny',   password: 'JennyGwapa', role: 'teacher' },
};
```

To change the teacher's name in the UI, find and replace `Ms. Jenny` in the HTML files.
