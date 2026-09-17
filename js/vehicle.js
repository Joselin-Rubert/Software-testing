import { validateVehicleNumber } from './validation.js';
const VEHICLES_KEY = 'autocare_vehicles';
const read = () => JSON.parse(localStorage.getItem(VEHICLES_KEY) || '[]');
const write = vehicles => localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
export function getVehicles(userId) { return read().filter(vehicle => vehicle.userId === userId); }
export function addVehicle({ userId, number, model }) {
  const normalizedNumber = String(number || '').replace(/[\s-]/g, '').toUpperCase();
  if (!validateVehicleNumber(normalizedNumber)) return { success: false, errors: { number: 'Use a valid registration number, e.g. KA01AB1234.' } };
  if (!model || model.trim().length < 2) return { success: false, errors: { model: 'Enter the vehicle make and model.' } };
  const vehicles = read();
  if (vehicles.some(vehicle => vehicle.userId === userId && vehicle.number === normalizedNumber)) return { success: false, errors: { number: 'This vehicle is already in your garage.' } };
  const vehicle = { id: `veh_${Date.now()}`, userId, number: normalizedNumber, model: model.trim() }; vehicles.push(vehicle); write(vehicles); return { success: true, vehicle };
}
export function removeVehicle(vehicleId) { write(read().filter(vehicle => vehicle.id !== vehicleId)); }
export function clearVehicleData() { localStorage.removeItem(VEHICLES_KEY); }
