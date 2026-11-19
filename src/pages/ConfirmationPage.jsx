import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ConfirmationPage.module.css';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem('finsha-confirmation');
  const data = raw ? JSON.parse(raw) : null;

  useEffect(() => {
    if (!data) navigate('/');
  }, [data, navigate]);

  if (!data) return null;

  const { booking, total, fields, ref } = data;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={`neu-card ${styles.card}`}>
          {/* Header */}
          <div className={styles.hero}>
            <span className={styles.icon} aria-hidden="true">🎉</span>
            <h1 className={`liquid-chrome ${styles.heading}`}>Booking Confirmed!</h1>
            <p className={styles.sub}>
              Thank you, <strong>{fields.fullName}</strong>! Your sessions at Finsha Fitness are locked in.
            </p>
            <div className={styles.refBadge}>
              Booking Reference: <strong>{ref}</strong>
            </div>
          </div>

          {/* Details grid */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{fields.email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone</span>
              <span className={styles.detailValue}>{fields.phone}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Start Date</span>
              <span className={styles.detailValue}>{fields.startDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Session Type</span>
              <span className={styles.detailValue}>{fields.sessionType}</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* Booked classes */}
          <h2 className={styles.sectionTitle}>📋 Classes Booked</h2>
          <div className={styles.classList}>
            {booking.map(item => (
              <div key={item.id} className={styles.classItem}>
                <div className={styles.classInfo}>
                  <span className={styles.className}>{item.name}</span>
                  <span className={styles.classMeta}>
                    {item.category} · {item.trainer} · {item.quantity} session{item.quantity !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className={styles.classPrice}>
                  PKR {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Paid</span>
            <span className={styles.totalValue}>PKR {total.toLocaleString()}</span>
          </div>

          {fields.notes && (
            <div className={styles.notes}>
              <span className={styles.detailLabel}>Your Notes</span>
              <p className={styles.notesText}>{fields.notes}</p>
            </div>
          )}

          <Link to="/classes" className={`btn-primary ${styles.backBtn}`}>
            ← Browse More Classes
          </Link>
        </div>
      </div>
    </div>
  );
}
