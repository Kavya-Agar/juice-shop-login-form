/**
 * server-example.js
 *
 * Minimal reference implementation of SERVER-SIDE validation + secure
 * password handling for the login form in index.html. This is not wired
 * up to a database — it's here to document the pattern asked for in the
 * assignment (Part 1: secure password handling with bcrypt; Part 2:
 * both client- and server-side validation).
 *
 * Run (optional, for demonstration only):
 *   npm install express bcrypt
 *   node server-example.js
 */

const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// --- In-memory "database" for demo purposes only -------------------------
// Password is never stored in plaintext: only the bcrypt hash is kept.
// SALT_ROUNDS=12 is a reasonable default cost factor as of 2026.
const SALT_ROUNDS = 12;
const users = {}; // { email: { passwordHash } }

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash("CorrectHorse123", SALT_ROUNDS);
  users["demo@example.com"] = { passwordHash };
}
seedDemoUser();

// --- Validation helpers (mirrors script.js, but this copy is the one ----
// --- that actually matters, since the client can't be trusted) ----------
function isValidEmail(value) {
  return typeof value === "string" && value.trim().length > 0 && value.includes("@");
}

function isValidPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};

  // 1) Re-validate on the server. Never trust client-side checks alone.
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ message: "Invalid email or password format." });
  }

  // 2) Look up the user by exact, parameter-bound match.
  //    If this were backed by a real SQL database, use a parameterized
  //    query / prepared statement, e.g. (node-postgres example):
  //      db.query("SELECT * FROM users WHERE email = $1", [email]);
  //    NEVER build the query by string concatenation
  //    (e.g. `SELECT * FROM users WHERE email = '${email}'`), which is
  //    exactly the SQL injection pattern exploitable in Juice Shop's
  //    login form via input like:  ' OR 1=1--
  const user = users[email];

  // 3) Compare using bcrypt.compare, which is timing-safe and never
  //    exposes the stored hash. Return a generic error either way so
  //    the response doesn't reveal whether the email exists
  //    (prevents user enumeration).
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // 4) On success, issue a session (e.g., signed, HttpOnly, Secure cookie
  //    or a short-lived JWT) — omitted here since this file only
  //    demonstrates validation + password handling.
  return res.json({ message: "Login successful (demo)." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Demo server listening on port ${PORT}`));

module.exports = { isValidEmail, isValidPassword };
