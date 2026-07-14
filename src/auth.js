// Account gate: the app opens on a welcome screen (sign in / sign up).
// Once signed in, the account's profiles (the kids) become available.
import {
  getAuthUser, signUp, signInPassword, signOut, onAuthChange,
  resetPassword, updatePassword, getFamilyName
} from './db.js';
import { showScreen } from './ui.js';
import { refreshProfiles, resetCurrent } from './profiles.js';
import { paintWelcome } from './wheel.js';

let recovering = false;   // true while handling a password-reset link

function setMsg(id, text, ok = false) {
  const el = document.getElementById(id);
  if (el) { el.textContent = text; el.className = 'auth-msg ' + (ok ? 'ok' : 'err'); }
}

async function doSignIn() {
  const email = document.getElementById('siEmail').value.trim();
  const password = document.getElementById('siPassword').value;
  if (!email || !password) { setMsg('siMsg', 'Entre ton email et ton mot de passe.'); return; }
  setMsg('siMsg', 'Connexion…', true);
  const res = await signInPassword(email, password);
  if (res.error) setMsg('siMsg', res.error);
  // on success → onAuthChange routes to the profiles
}

async function doSignUp() {
  const family = document.getElementById('suFamily').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const password = document.getElementById('suPassword').value;
  if (!family) { setMsg('suMsg', 'Donne un nom à ta famille.'); return; }
  if (!email || !email.includes('@')) { setMsg('suMsg', 'Entre un email valide.'); return; }
  if (password.length < 6) { setMsg('suMsg', 'Mot de passe : 6 caractères minimum.'); return; }
  setMsg('suMsg', 'Création…', true);
  const res = await signUp(email, password, family);
  if (res.error) { setMsg('suMsg', res.error); return; }
  if (res.needsConfirm) setMsg('suMsg', '📧 Vérifie tes emails pour confirmer, puis connecte-toi.', true);
  // else onAuthChange routes to the profiles
}

async function doForgot() {
  const email = document.getElementById('siEmail').value.trim();
  if (!email || !email.includes('@')) { setMsg('siMsg', 'Entre ton email ci-dessus, puis re-clique.'); return; }
  setMsg('siMsg', 'Envoi du lien…', true);
  const res = await resetPassword(email);
  if (res.error) setMsg('siMsg', res.error);
  else setMsg('siMsg', '📧 Lien de réinitialisation envoyé — vérifie tes emails.', true);
}

async function doReset() {
  const password = document.getElementById('npPassword').value;
  if (password.length < 6) { setMsg('npMsg', 'Mot de passe : 6 caractères minimum.'); return; }
  setMsg('npMsg', 'Mise à jour…', true);
  const res = await updatePassword(password);
  if (res.error) { setMsg('npMsg', res.error); return; }
  recovering = false;
  history.replaceState(null, '', location.pathname);   // drop the #recovery hash
  await refreshProfiles();
  showScreen('profileScreen');
}

// Show / hide password on every .pw-eye toggle.
function wireEyes() {
  document.querySelectorAll('.pw-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.eye);
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      btn.textContent = show ? '🙈' : '👁️';
    });
  });
}

// Show the profiles for the signed-in account (with its family name).
async function goProfiles() {
  await refreshProfiles();
  const el = document.getElementById('familyName');
  if (el) el.textContent = await getFamilyName();
  showScreen('profileScreen');
}

// Send the app to the right screen for the current session.
async function route() {
  if (location.hash.includes('type=recovery')) { recovering = true; showScreen('resetScreen'); return; }
  const user = await getAuthUser();
  if (user) await goProfiles();
  else showScreen('welcomeScreen');
}

export async function initAuth() {
  paintWelcome();
  wireEyes();

  document.getElementById('goSignIn').addEventListener('click', () => showScreen('signInScreen'));
  document.getElementById('goSignUp').addEventListener('click', () => showScreen('signUpScreen'));
  document.querySelectorAll('[data-action="welcome"]').forEach(b =>
    b.addEventListener('click', () => showScreen('welcomeScreen')));

  document.getElementById('signInForm').addEventListener('submit', (e) => { e.preventDefault(); doSignIn(); });
  document.getElementById('signUpForm').addEventListener('submit', (e) => { e.preventDefault(); doSignUp(); });
  document.getElementById('resetForm').addEventListener('submit', (e) => { e.preventDefault(); doReset(); });
  document.getElementById('forgotBtn').addEventListener('click', doForgot);
  document.getElementById('signOutBtn').addEventListener('click', () => signOut());

  onAuthChange((event) => {
    if (event === 'PASSWORD_RECOVERY') { recovering = true; showScreen('resetScreen'); return; }
    if (recovering && event === 'SIGNED_IN') return;   // stay on the reset screen
    if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
      goProfiles();
    } else if (event === 'SIGNED_OUT') {
      resetCurrent();
      showScreen('welcomeScreen');
    }
  });

  await route();
}
