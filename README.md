# Secure Login Form Demo

A minimal login form built for **HW 2-B (OWASP Juice Shop / OWASP Top 10)**. It demonstrates a basic HTML/JS login page with client-side validation, plus a reference server-side implementation showing proper input re-validation and secure password handling (bcrypt).

## What this project does

- **`index.html` / `style.css`** — A simple email + password login form.
- **`script.js`** — Client-side validation:
  - Blocks empty submissions.
  - Requires the email field to contain `"@"`.
  - Requires the password to be at least 8 characters.
  - Writes all messages back to the page using `textContent` (never `innerHTML`), so user input can't be rendered as executable HTML/JS.
- **`server-example.js`** — A minimal Express reference server showing what real server-side validation looks like:
  - Re-checks the same email/password rules server-side (client-side checks can always be bypassed).
  - Hashes and verifies passwords with **bcrypt** instead of storing or comparing plaintext passwords.
  - Notes where a real app would use parameterized SQL queries instead of string concatenation (to avoid SQL injection).

This project does **not** implement real authentication, sessions, or a database — it's a teaching example focused on the validation and password-handling patterns, written after identifying and exploiting SQL injection / XSS / broken-auth issues in OWASP Juice Shop.

## How to run

### Just the front-end form
Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

### With the server-side validation example
```bash
npm install
npm start
```
This starts an Express server on `http://localhost:3000` with a `POST /api/login` endpoint that re-validates input and checks the password against a bcrypt hash of a demo user (`demo@example.com` / `CorrectHorse123`). The front-end form currently calls a mocked `fakeServerValidate()` in `script.js` rather than this live endpoint, since no real backend/database is wired up for this assignment.

## Security notes

- Client-side validation is a UX convenience only, not a security boundary — see `server-example.js` for why the server must re-validate everything.
- Passwords are never stored or compared in plaintext; only bcrypt hashes are kept.
- User input is never inserted into the DOM via `innerHTML`, which mitigates DOM-based XSS.
- See the accompanying assignment write-up (PDF) for the specific vulnerabilities identified and exploited in OWASP Juice Shop (Part 1) and the attack attempted against this form (Part 3).
