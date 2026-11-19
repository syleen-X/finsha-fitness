/**
 * Business Rule R1: Capacity — max (capacity - enrolled) spots per class.
 * Returns { valid: boolean, message: string }
 */
export function validateBookingQuantity(quantity, classItem) {
  const spotsLeft = classItem.capacity - classItem.enrolled;
  if (quantity < 1) return { valid: false, message: 'Book at least 1 spot.' };
  if (quantity > 6) return { valid: false, message: 'Maximum 6 spots per booking.' };
  if (quantity > spotsLeft) return { valid: false, message: `Only ${spotsLeft} spot(s) left in this class.` };
  return { valid: true, message: '' };
}

/**
 * Business Rule R2: Availability — class must be active and not fully booked.
 */
export function isClassBookable(classItem) {
  if (!classItem.available) return { bookable: false, reason: 'This class is currently inactive.' };
  if (classItem.enrolled >= classItem.capacity) return { bookable: false, reason: 'This class is fully booked.' };
  return { bookable: true, reason: '' };
}

/**
 * Business Rule R3: Minimum deposit — total booking value must be >= PKR 1000 to confirm online.
 */
export function validateMinimumBooking(totalAmount) {
  if (totalAmount < 1000) return { valid: false, message: 'Minimum online booking amount is PKR 1,000. Add more sessions or visit in person.' };
  return { valid: true, message: '' };
}
