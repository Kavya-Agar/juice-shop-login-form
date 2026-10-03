/**
 * Client-side validation for the login form.
 *
 * Security notes:
 * - This validation is a UX convenience only. It is NOT a security boundary.
 *   The server MUST re-validate everything (see server-example.js) because
 *   client-side JS can always be bypassed (disabled, edited via DevTools,
 *   or skipped entirely by posting directly to the API).
 * - User-supplied values are only ever written back to the page with
 *   textContent (never innerHTML), so attacker-supplied HTML/JS in the
 *   email or password fields cannot execute as script (mitigates DOM XSS).
 */

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formStatus = document.getElementById("formStatus");

function isValidEmail(value) {
  // Minimal check per assignment spec: must contain "@" and not be empty.
  // (A full RFC-5322 regex is intentionally avoided here — real email
  // validation should ultimately happen server-side via a confirmation link.)
  return value.trim().length > 0 && value.includes("@");
}

function isValidPassword(value) {
  return value.length >= 8;
}

function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message; // textContent, not innerHTML -> no XSS sink
  inputEl.classList.toggle("invalid", Boolean(message));
}

function validateForm(email, password) {
  let valid = true;

  if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Enter a valid email address (must contain \"@\").");
    valid = false;
  } else {
    setFieldError(emailInput, emailError, "");
  }

  if (!isValidPassword(password)) {
    setFieldError(passwordInput, passwordError, "Password must be at least 8 characters.");
    valid = false;
  } else {
    setFieldError(passwordInput, passwordError, "");
  }

  return valid;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  formStatus.textContent = "";

  // Prevent empty / malformed submissions client-side first.
  if (!validateForm(email, password)) {
    formStatus.textContent = "Please fix the errors above.";
    return;
  }

  // In a real app this would POST to the backend over HTTPS.
  // The backend performs the SAME checks again (never trust the client),
  // plus the actual authentication against hashed credentials.
  try {
    const result = await fakeServerValidate(email, password);
    formStatus.textContent = result.message; // textContent only, never innerHTML
  } catch (err) {
    formStatus.textContent = "Something went wrong. Please try again.";
  }
});

/**
 * Stand-in for a real network call, so this demo works with no backend
 * running. It deliberately mirrors the checks in server-example.js to
 * illustrate "never trust the client" — see that file for the real
 * server-side validation + bcrypt password check.
 */
async function fakeServerValidate(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 150)); // simulate latency

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return { ok: false, message: "Server rejected the request: invalid input." };
  }

  return { ok: true, message: "Validation passed (demo only — no real account exists)." };
}
