import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateRegistration, validateLogin, validateVehicleNumber, validateAppointmentDate, getService } from '../js/validation.js';
import { registerCustomer, loginCustomer, clearCustomerData } from '../js/customer.js';
import { addVehicle, clearVehicleData } from '../js/vehicle.js';
import { createBooking, updateBookingStatus, clearBookingData } from '../js/booking.js';

globalThis.localStorage = { data: {}, getItem(key) { return this.data[key] ?? null; }, setItem(key, value) { this.data[key] = String(value); }, removeItem(key) { delete this.data[key]; }, clear() { this.data = {}; } };
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const cases = [];
function test(name, callback) { try { callback(); cases.push({ name, passed: true }); } catch (error) { cases.push({ name, passed: false, error: error.message }); } }
localStorage.clear();

test('Customer registration validation accepts complete details', () => assert.equal(validateRegistration({ name: 'Asha Rao', email: 'asha@example.com', password: 'secret1' }).valid, true));
test('Customer registration validation rejects malformed email', () => assert.equal(validateRegistration({ name: 'Asha Rao', email: 'wrong', password: 'secret1' }).valid, false));
test('Login validation requires email and password', () => assert.equal(validateLogin({ email: '', password: '' }).valid, false));
test('Vehicle number validation accepts Indian registration format', () => assert.equal(validateVehicleNumber('KA01AB1234'), true));
test('Vehicle number validation rejects invalid text', () => assert.equal(validateVehicleNumber('CAR-123'), false));
test('Service selection returns a known service', () => assert.equal(getService('oil-change').name, 'Oil Change'));
test('Appointment date validation rejects dates in the past', () => assert.equal(validateAppointmentDate('2020-01-01'), false));
test('Invalid form submission returns field errors', () => assert.equal(createBooking({ userId: 'u1', vehicleId: '', serviceId: '', date: '', time: '' }).success, false));
test('Booking creation stores a pending appointment', () => { const result = createBooking({ userId: 'u1', vehicleId: 'v1', vehicleNumber: 'KA01AB1234', serviceId: 'oil-change', date: tomorrow, time: '10:30' }); assert.equal(result.success, true); assert.equal(result.booking.status, 'Pending'); });
test('Booking status update changes the appointment state', () => { const booking = JSON.parse(localStorage.getItem('autocare_bookings'))[0]; const result = updateBookingStatus(booking.id, 'Confirmed'); assert.equal(result.success, true); assert.equal(result.booking.status, 'Confirmed'); });
test('Customer registration and login work together', () => { clearCustomerData(); const registration = registerCustomer({ name: 'Asha Rao', email: 'asha@example.com', password: 'secret1' }); assert.equal(registration.success, true); const login = loginCustomer({ email: 'asha@example.com', password: 'secret1' }); assert.equal(login.success, true); });
test('Vehicle creation stores a validated vehicle', () => { const result = addVehicle({ userId: 'u1', number: 'KA01AB1234', model: 'Honda City' }); assert.equal(result.success, true); });

const passed = cases.filter(item => item.passed).length; const failed = cases.length - passed; const generatedAt = new Date().toLocaleString();
const rows = cases.map(item => `<tr><td>${item.name}</td><td class="${item.passed ? 'pass' : 'fail'}">${item.passed ? 'PASSED' : 'FAILED'}</td><td>${item.error || 'Completed successfully'}</td></tr>`).join('');
const report = `<!doctype html><html><head><meta charset="UTF-8"><title>AutoCare Test Report</title><style>body{font-family:Arial,sans-serif;background:#f4f7f2;color:#17201d;margin:40px}main{max-width:980px;margin:auto;background:#fff;padding:32px;border-radius:14px}h1{margin-top:0}.summary{display:flex;gap:12px}.metric{padding:16px 22px;background:#e5f7e9;border-radius:9px}.metric.fail{background:#ffe4e2}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e1e7e2}.pass{color:#267047;font-weight:bold}.fail{color:#ad4d4a;font-weight:bold}small{color:#68746d}</style></head><body><main><h1>AutoCare automated test report</h1><small>Generated ${generatedAt}</small><div class="summary"><div class="metric"><strong>${passed}</strong><br>Passed</div><div class="metric ${failed ? 'fail' : ''}"><strong>${failed}</strong><br>Failed</div><div class="metric"><strong>${cases.length}</strong><br>Total</div></div><table><thead><tr><th>Test case</th><th>Result</th><th>Details</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`;
fs.mkdirSync(path.resolve('reports'), { recursive: true }); fs.writeFileSync(path.resolve('reports/test-report.html'), report);
console.log(`Tests: ${passed} passed, ${failed} failed`); if (failed) process.exitCode = 1;
clearBookingData(); clearVehicleData(); clearCustomerData();
