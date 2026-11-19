import { Link } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses.js';
import { isClassBookable, validateBookingQuantity, validateMinimumBooking } from '../rules/bookingRules.js';
import QuantityControl from '../components/QuantityControl.jsx';
import EmptyState from '../components/EmptyState.jsx';
import styles from './BookingPage.module.css';

export default function BookingPage({ booking, removeFromBooking, updateQuantity, total }) {
  const { classes } = useClasses();

  // R2 conflict check: compare booking items against live class data
  const conflicts = booking
    .map(item => {
      const liveClass = classes.find(c => c.id === item.id);
      if (!liveClass) return null;
      const { bookable, reason } = isClassBookable(liveClass);
      if (!bookable) return { id: item.id, name: item.name, reason };
      return null;
    })
    .filter(Boolean);

  // R1 live quantity validation per item
  function getQtyError(item) {
    const liveClass = classes.find(c => c.id === item.id);
    if (!liveClass) return '';
    const v = validateBookingQuantity(item.quantity, liveClass);
    return v.valid ? '' : v.message;
  }

  const r3 = validateMinimumBooking(total);

  if (booking.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>My Booking</h1>
          <EmptyState variant="emptyBooking" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>My Booking</h1>

        {/* R2 conflict banners */}
        {conflicts.length > 0 && (
          <div className={styles.conflictBanner} role="alert" aria-live="assertive">
            <span className={styles.conflictIcon} aria-hidden="true">⚠️</span>
            <div>
              <strong>Some classes in your booking are no longer available:</strong>
              <ul className={styles.conflictList}>
                {conflicts.map(c => (
                  <li key={c.id}>
                    <strong>{c.name}</strong>: {c.reason}
                    <button
                      className={styles.conflictRemove}
                      onClick={() => removeFromBooking(c.id)}
                      aria-label={`Remove ${c.name} from booking`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.layout}>
          {/* Booking items */}
          <div className={styles.itemsList}>
            {booking.map(item => {
              const qtyErr = getQtyError(item);
              return (
                <div key={item.id} className={`neu-card ${styles.bookingItem}`}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemLetter} aria-hidden="true">{item.name[0]}</div>
                  </div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <p className={styles.itemMeta}>👤 {item.trainer} · {item.category}</p>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromBooking(item.id)}
                        aria-label={`Remove ${item.name} from booking`}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.itemFooter}>
                      <QuantityControl
                        value={item.quantity}
                        onChange={qty => updateQuantity(item.id, qty)}
                        min={1}
                        max={6}
                        label={`Quantity for ${item.name}`}
                      />
                      {qtyErr && (
                        <p className={styles.qtyError} role="alert">{qtyErr}</p>
                      )}
                      <div className={styles.itemPriceGroup}>
                        <span className={styles.itemUnitPrice}>
                          PKR {item.price.toLocaleString()} × {item.quantity}
                        </span>
                        <span className={styles.itemTotal}>
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link to="/classes" className={styles.browseMore}>
              + Browse More Classes
            </Link>
          </div>

          {/* Summary sidebar */}
          <div className={styles.summary}>
            <div className={`neu-card ${styles.summaryCard}`}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRows}>
                {booking.map(item => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>{item.name} × {item.quantity}</span>
                    <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalValue}>PKR {total.toLocaleString()}</span>
              </div>

              {/* R3 warning */}
              {!r3.valid && (
                <div className={styles.r3Warning} role="alert">
                  <span aria-hidden="true">⚠️</span> {r3.message}
                </div>
              )}

              <Link
                to="/checkout"
                className={`btn-primary ${styles.checkoutBtn} ${(!r3.valid || conflicts.length > 0) ? styles.checkoutDisabled : ''}`}
                aria-disabled={!r3.valid || conflicts.length > 0}
                onClick={e => { if (!r3.valid || conflicts.length > 0) e.preventDefault(); }}
                tabIndex={!r3.valid || conflicts.length > 0 ? -1 : 0}
              >
                Proceed to Checkout →
              </Link>

              {!r3.valid && (
                <p className={styles.r3Hint}>
                  Add PKR {(1000 - total).toLocaleString()} more to enable online checkout.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
