import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses.js';
import { isClassBookable, validateBookingQuantity } from '../rules/bookingRules.js';
import QuantityControl from '../components/QuantityControl.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import styles from './ClassDetailPage.module.css';

const CATEGORY_COLORS = {
  Cardio: '#E76F51',
  Strength: '#264653',
  Yoga: '#2A9D8F',
  Dance: '#e9a830',
  Combat: '#c0392b',
  'Mind & Body': '#8e6bbf',
};

export default function ClassDetailPage({ addToBooking }) {
  const { id } = useParams();
  const { classes, loading } = useClasses();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [qtyError, setQtyError] = useState('');

  if (loading) return <LoadingSpinner />;

  const cls = classes.find(c => c.id === id);

  if (!cls) {
    return (
      <div className={styles.notFound}>
        <div className={`neu-card ${styles.notFoundCard}`}>
          <span className={styles.notFoundIcon} aria-hidden="true">❓</span>
          <h2>Class Not Found</h2>
          <p>No class found with ID <code>{id}</code>.</p>
          <Link to="/classes" className="btn-primary">← Back to Classes</Link>
        </div>
      </div>
    );
  }

  const { bookable, reason } = isClassBookable(cls);
  const spotsLeft = cls.capacity - cls.enrolled;
  const spotsPercent = Math.min(100, (cls.enrolled / cls.capacity) * 100);

  function handleQtyChange(newQty) {
    setQty(newQty);
    setAdded(false);
    const v = validateBookingQuantity(newQty, cls);
    setQtyError(v.valid ? '' : v.message);
  }

  function handleAddToBooking() {
    const v = validateBookingQuantity(qty, cls);
    if (!v.valid) { setQtyError(v.message); return; }
    addToBooking(cls, qty);
    setAdded(true);
    setQtyError('');
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link to="/classes" className={styles.backLink}>← Back to Classes</Link>

        <div className={styles.layout}>
          {/* Left: image + meta */}
          <div className={styles.leftCol}>
            <div className={styles.imagePlaceholder} aria-hidden="true">
              {cls.image ? (
                <img src={cls.image} alt={cls.name} className={styles.detailImage} />
              ) : (
                <span className={styles.imageLetter}>{cls.name[0]}</span>
              )}
            </div>

            {/* Schedule */}
            <div className={`neu-card ${styles.infoCard}`}>
              <h3 className={styles.infoCardTitle}>📅 Schedule</h3>
              <div className={styles.schedDays}>
                {cls.schedule.map(d => (
                  <span key={d} className={styles.schedDay}>{d}</span>
                ))}
              </div>
              <p className={styles.schedTime}>{cls.time}</p>
            </div>

            {/* Equipment */}
            <div className={`neu-card ${styles.infoCard}`}>
              <h3 className={styles.infoCardTitle}>🎒 Equipment</h3>
              <ul className={styles.equipList}>
                {cls.equipment.map(e => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: details + booking */}
          <div className={styles.rightCol}>
            {/* Badge + title */}
            <div>
              <span
                className={styles.catBadge}
                style={{ background: CATEGORY_COLORS[cls.category] || '#888' }}
              >
                {cls.category}
              </span>
              <h1 className={styles.className}>{cls.name}</h1>
              <p className={styles.trainerLine}>👤 {cls.trainer}</p>
            </div>

            {/* Meta chips */}
            <div className={styles.chips}>
              <span className={`neu-card ${styles.chip}`}>⏱ {cls.duration} min</span>
              <span className={`neu-card ${styles.chip}`}>📶 {cls.intensity}</span>
              <span className={`neu-card ${styles.chip}`}>
                👥 {spotsLeft}/{cls.capacity} spots
              </span>
            </div>

            {/* Description */}
            <p className={styles.description}>{cls.description}</p>

            {/* Benefits */}
            <div>
              <h3 className={styles.subHeading}>✅ Benefits</h3>
              <ul className={styles.benefitsList}>
                {cls.benefits.map(b => (
                  <li key={b} className={styles.benefitItem}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Spots bar */}
            <div>
              <h3 className={styles.subHeading}>Availability</h3>
              <div className={styles.spotsBar} role="img" aria-label={`${cls.enrolled} of ${cls.capacity} spots filled`}>
                <div
                  className={styles.spotsBarFill}
                  style={{
                    width: `${spotsPercent}%`,
                    background: spotsPercent >= 100 ? '#c0392b' : spotsPercent > 80 ? '#e9a830' : '#2A9D8F'
                  }}
                ></div>
              </div>
              <p className={styles.spotsText}>
                {bookable ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} remaining` : (cls.available ? 'Fully booked' : 'Class inactive')}
              </p>
            </div>

            {/* Booking section */}
            <div className={`neu-card ${styles.bookingBox}`}>
              <div className={styles.priceRow}>
                <span className={styles.price}>PKR {cls.price.toLocaleString()}</span>
                <span className={styles.perSession}>/ session</span>
              </div>

              {bookable ? (
                <>
                  <div className={styles.qtyRow}>
                    <span className={styles.qtyLabel}>Spots to book:</span>
                    <QuantityControl
                      value={qty}
                      onChange={handleQtyChange}
                      min={1}
                      max={Math.min(6, spotsLeft)}
                      label="Number of spots"
                    />
                  </div>
                  {qtyError && (
                    <p className={styles.qtyError} role="alert">{qtyError}</p>
                  )}
                  <p className={styles.subtotal}>
                    Subtotal: <strong>PKR {(cls.price * qty).toLocaleString()}</strong>
                  </p>
                  <button
                    className="btn-primary"
                    onClick={handleAddToBooking}
                    disabled={!!qtyError || added}
                  >
                    {added ? '✓ Added to Booking' : 'Add to Booking'}
                  </button>
                  {added && (
                    <p className={styles.addedMsg} role="status" aria-live="polite">
                      ✅ Added! <Link to="/booking">View Booking →</Link>
                    </p>
                  )}
                </>
              ) : (
                <div className={styles.notBookable} role="alert">
                  <p>⛔ {reason}</p>
                  <button className="btn-primary" disabled>
                    Not Available
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
