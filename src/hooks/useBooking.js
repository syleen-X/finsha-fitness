import { useState, useEffect } from 'react';

function getStoredBooking() {
  try {
    const raw = localStorage.getItem('finsha-booking');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useBooking() {
  const [booking, setBooking] = useState(getStoredBooking);

  useEffect(() => {
    localStorage.setItem('finsha-booking', JSON.stringify(booking));
  }, [booking]);

  function addToBooking(classItem, quantity = 1) {
    setBooking(prev => {
      const existing = prev.find(b => b.id === classItem.id);
      if (existing) {
        return prev.map(b => b.id === classItem.id ? { ...b, quantity: b.quantity + quantity } : b);
      }
      return [...prev, { ...classItem, quantity }];
    });
  }

  function removeFromBooking(id) {
    setBooking(prev => prev.filter(b => b.id !== id));
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) { removeFromBooking(id); return; }
    setBooking(prev => prev.map(b => b.id === id ? { ...b, quantity } : b));
  }

  function clearBooking() { setBooking([]); }

  const total = booking.reduce((sum, b) => sum + b.price * b.quantity, 0);
  const totalSessions = booking.reduce((sum, b) => sum + b.quantity, 0);

  return { booking, addToBooking, removeFromBooking, updateQuantity, clearBooking, total, totalSessions };
}
