// Profiles: anonymous auth, the "Qui joue ?" picker, create form, delete,
// and the current-player badge. Owns the current profile.
import { getProfiles, createProfile, deleteProfile, AVATARS } from './db.js';
import { showScreen } from './ui.js';

const STORAGE_KEY = 'qr_profile_id';
let currentProfile = null;   // selected profile row, or null (guest)
let managing = false;
let pickedAvatar = AVATARS[0].emoji;

export function getCurrentProfile() { return currentProfile; }
export function getProfileId() { return currentProfile ? currentProfile.id : null; }
export function resetCurrent() { setCurrent(null); }

function ageFrom(birthdate) {
  if (!birthdate) return null;
  const b = new Date(birthdate), now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return (a >= 0 && a < 120) ? a : null;
}

function setCurrent(profile) {
  currentProfile = profile;
  if (profile) localStorage.setItem(STORAGE_KEY, profile.id);
  else localStorage.removeItem(STORAGE_KEY);
  const cp = document.getElementById('currentPlayer');
  if (cp) {
    cp.querySelector('.cp-avatar').textContent = profile ? (profile.avatar || '🙂') : '';
    cp.querySelector('.cp-name').textContent = profile ? profile.first_name : '';
    cp.querySelector('.cp-score').textContent = '';
  }
}

function play(profile) {
  setCurrent(profile);
  showScreen('wheelScreen');
}

/* ── "Qui joue ?" picker ── */
async function renderProfiles() {
  const profiles = await getProfiles();
  const listEl = document.getElementById('profileList');
  const hintEl = document.getElementById('profileHint');
  const manageBtn = document.getElementById('manageBtn');
  listEl.innerHTML = '';

  // + Nouveau — always first.
  const add = document.createElement('button');
  add.className = 'profile-btn add';
  add.innerHTML = `<span class="avatar">➕</span><span>Nouveau</span>`;
  add.onclick = openCreate;
  listEl.appendChild(add);

  for (const p of profiles) {
    const age = ageFrom(p.birthdate);
    const btn = document.createElement('button');
    btn.className = 'profile-btn';
    btn.innerHTML =
      `<span class="avatar">${p.avatar || '🙂'}</span>` +
      `<span class="profile-name">${p.first_name}</span>` +
      (age != null ? `<span class="profile-age">${age} ans</span>` : '') +
      `<span class="profile-del" title="Supprimer">✕</span>`;
    btn.onclick = (e) => {
      if (e.target.classList.contains('profile-del')) return confirmDelete(p);
      if (managing) return;                 // in manage mode, taps don't start a game
      play(p);
    };
    listEl.appendChild(btn);
  }

  hintEl.textContent = profiles.length
    ? 'Touche ton personnage pour jouer.'
    : 'Crée ton premier joueur ! 🎉';
  manageBtn.style.display = profiles.length ? '' : 'none';
}

async function confirmDelete(p) {
  if (!confirm(`Supprimer le profil de ${p.first_name} ? Sa progression sera perdue.`)) return;
  const res = await deleteProfile(p.id);
  if (res.error) { alert(res.error); return; }
  if (currentProfile && currentProfile.id === p.id) setCurrent(null);
  await renderProfiles();
}

function initManage() {
  const btn = document.getElementById('manageBtn');
  btn.addEventListener('click', () => {
    managing = !managing;
    btn.setAttribute('aria-pressed', String(managing));
    btn.textContent = managing ? '✓ Terminé' : '🗑️ Gérer les profils';
    document.getElementById('profileScreen').classList.toggle('managing', managing);
  });
}

/* ── Create form ── */
function renderAvatarPicker() {
  const wrap = document.getElementById('avatarPick');
  wrap.innerHTML = '';
  AVATARS.forEach((a) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'avatar-opt' + (a.emoji === pickedAvatar ? ' sel' : '');
    b.textContent = a.emoji;
    b.title = a.label;
    b.onclick = () => {
      pickedAvatar = a.emoji;
      wrap.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
    };
    wrap.appendChild(b);
  });
}

function openCreate() {
  document.getElementById('profileForm').reset();
  pickedAvatar = AVATARS[0].emoji;
  renderAvatarPicker();
  showScreen('profileCreateScreen');
}

function initCreateForm() {
  renderAvatarPicker();
  document.getElementById('pfCancel').addEventListener('click', () => showScreen('profileScreen'));
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const first_name = document.getElementById('pfFirst').value.trim();
    if (!first_name) return;
    const res = await createProfile({
      first_name,
      last_name: document.getElementById('pfLast').value.trim() || null,
      birthdate: document.getElementById('pfDob').value || null,
      avatar: pickedAvatar
    });
    if (res.error) { alert(res.error); return; }
    await renderProfiles();
    play(res.data);   // jump straight into playing as the new profile
  });
}

// Re-render the picker (e.g. after sign-in / sign-out swaps the account).
export async function refreshProfiles() {
  await renderProfiles();
}

export function initProfiles() {
  initManage();
  initCreateForm();
  document.getElementById('currentPlayer').addEventListener('click', () => showScreen('profileScreen'));
  // The picker is rendered by auth.js once a user is signed in (refreshProfiles).
}
