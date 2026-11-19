import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateBookingQuantity } from './bookingRules.js';

const mockClass = { capacity: 15, enrolled: 12 }; // 3 spots left

describe('validateBookingQuantity', () => {
  it('valid: booking 1 spot when 3 spots remain', () => {
    const result = validateBookingQuantity(1, mockClass);
    assert.equal(result.valid, true);
  });

  it('boundary: booking exactly 3 spots (all remaining)', () => {
    const result = validateBookingQuantity(3, mockClass);
    assert.equal(result.valid, true);
  });

  it('invalid: booking 4 spots when only 3 remain', () => {
    const result = validateBookingQuantity(4, mockClass);
    assert.equal(result.valid, false);
    assert.ok(result.message.includes('3 spot(s) left'));
  });

  it('boundary: booking exactly 6 (max per booking)', () => {
    const bigClass = { capacity: 20, enrolled: 5 }; // 15 spots left
    const result = validateBookingQuantity(6, bigClass);
    assert.equal(result.valid, true);
  });

  it('invalid: booking 7 spots exceeds max per booking', () => {
    const bigClass = { capacity: 20, enrolled: 5 };
    const result = validateBookingQuantity(7, bigClass);
    assert.equal(result.valid, false);
    assert.ok(result.message.includes('Maximum 6'));
  });
});
