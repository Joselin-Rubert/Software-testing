export function getBookingStats(bookings) {
  return { total: bookings.length, pending: bookings.filter(item => item.status === 'Pending').length, confirmed: bookings.filter(item => item.status === 'Confirmed').length, completed: bookings.filter(item => item.status === 'Completed').length, cancelled: bookings.filter(item => item.status === 'Cancelled').length };
}
export function getServiceBreakdown(bookings) { return bookings.reduce((result, booking) => { result[booking.serviceName] = (result[booking.serviceName] || 0) + 1; return result; }, {}); }
