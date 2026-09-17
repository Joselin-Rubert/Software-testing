import { validateLogin, validateRegistration } from './validation.js';

const USERS_KEY = 'autocare_users';
const SESSION_KEY = 'autocare_session';
const read = key => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export function registerCustomer(details) {
  const validation = validateRegistration(details);
  if (!validation.valid) return { success: false, errors: validation.errors };
  const users = read(USERS_KEY);
  if (users.some(user => user.email.toLowerCase() === details.email.trim().toLowerCase())) return { success: false, errors: { email: 'An account with this email already exists.' } };
  const user = { id: `cus_${Date.now()}`, name: details.name.trim(), email: details.email.trim().toLowerCase(), password: details.password };
  users.push(user); write(USERS_KEY, users); localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return { success: true, user };
}
export function loginCustomer(details) {
  const validation = validateLogin(details);
  if (!validation.valid) return { success: false, errors: validation.errors };
  const user = read(USERS_KEY).find(item => item.email === details.email.trim().toLowerCase() && item.password === details.password);
  if (!user) return { success: false, errors: { form: 'Email or password is incorrect.' } };
  const session = { id: user.id, name: user.name, email: user.email }; localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}
export function getCurrentUser() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
export function logoutCustomer() { localStorage.removeItem(SESSION_KEY); }
export function clearCustomerData() { localStorage.removeItem(USERS_KEY); localStorage.removeItem(SESSION_KEY); }
