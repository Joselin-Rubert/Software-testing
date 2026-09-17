export const SERVICES = [
  { id: 'general-service', name: 'General Service', icon: '✦', duration: '60 min', price: 49 },
  { id: 'oil-change', name: 'Oil Change', icon: '◒', duration: '30 min', price: 29 },
  { id: 'brake-service', name: 'Brake Service', icon: '◉', duration: '90 min', price: 79 },
  { id: 'engine-service', name: 'Engine Service', icon: '▣', duration: '120 min', price: 119 },
  { id: 'washing', name: 'Washing', icon: '◌', duration: '30 min', price: 19 }
];

export function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()); }
export function validatePassword(password) { return typeof password === 'string' && password.length >= 6; }
export function validateRegistration({ name, email, password }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!validateEmail(email)) errors.email = 'Enter a valid email address.';
  if (!validatePassword(password)) errors.password = 'Use at least 6 characters.';
  return { valid: Object.keys(errors).length === 0, errors };
}
export function validateLogin({ email, password }) {
  const errors = {};
  if (!validateEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return { valid: Object.keys(errors).length === 0, errors };
}
export function validateVehicleNumber(number) { return /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{3,4}$/i.test(String(number).replace(/[\s-]/g, '')); }
export function validateAppointmentDate(date, today = new Date()) {
  if (!date) return false;
  const selected = new Date(`${date}T00:00:00`);
  const minimum = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return !Number.isNaN(selected.valueOf()) && selected >= minimum;
}
export function getService(serviceId) { return SERVICES.find(service => service.id === serviceId); }
