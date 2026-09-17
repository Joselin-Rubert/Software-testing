import { getService, validateAppointmentDate } from './validation.js';
const BOOKINGS_KEY = 'autocare_bookings';
const read = () => JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
const write = bookings => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
export function getBookings(userId) { const bookings = read(); return userId ? bookings.filter(booking => booking.userId === userId) : bookings; }
export function createBooking({ userId, vehicleId, vehicleNumber, serviceId, date, time }) {
  const errors = {};
  if (!vehicleId) errors.vehicle = 'Choose a vehicle.';
  if (!getService(serviceId)) errors.service = 'Choose a service.';
  if (!validateAppointmentDate(date)) errors.date = 'Choose today or a future date.';
  if (!time) errors.time = 'Choose an appointment time.';
  if (Object.keys(errors).length) return { success: false, errors };
  const service = getService(serviceId); const booking = { id: `BK-${String(Date.now()).slice(-6)}`, userId, vehicleId, vehicleNumber, serviceId, serviceName: service.name, date, time, status: 'Pending', createdAt: new Date().toISOString() };
  const bookings = read(); bookings.unshift(booking); write(bookings); return { success: true, booking };
}
export function updateBookingStatus(bookingId, status) {
  const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled']; const bookings = read(); const booking = bookings.find(item => item.id === bookingId);
  if (!booking || !allowed.includes(status)) return { success: false, error: 'Booking or status is invalid.' };
  booking.status = status; write(bookings); return { success: true, booking };
}
export function clearBookingData() { localStorage.removeItem(BOOKINGS_KEY); }
