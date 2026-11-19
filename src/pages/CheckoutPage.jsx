import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutPage.module.css';

const PHONE_RE = /^(03\d{2}[-\s]?\d{7}|03\d{9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function validate(name, value) {
  switch (name) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required.';
      if (value.trim().length < 3) return 'Name must be at least 3 characters.';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required.';
      if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
      return '';
    case 'phone':
      if (!value.trim()) return 'Phone number is required.';
      if (!PHONE_RE.test(value.trim())) return 'Enter a valid Pakistani number (03XX-XXXXXXX).';
      return '';
    case 'startDate': {
      if (!value) return 'Start date is required.';
      const chosen = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (chosen <= today) return 'Start date must be in the future.';
      return '';
    }
    default:
      return '';
  }
}

export default function CheckoutPage({ booking, total, clearBooking }) {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: '',
    notes: '',
    sessionType: 'In-Studio',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [reviewing, setReviewing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Guard: redirect to /booking if cart is empty — but NOT after confirm (which clears it intentionally)
  useEffect(() => {
    if (!confirmed && (!booking || booking.length === 0)) {
      navigate('/booking');
    }
  }, [booking, navigate, confirmed]);

  if (!confirmed && (!booking || booking.length === 0)) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    // Live-clear error when field becomes valid
    if (touched[name]) {
      const err = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Validate all required fields; keep existing valid values untouched
    const required = ['fullName', 'email', 'phone', 'startDate'];
    const newErrors = {};
    const newTouched = { ...touched };
    required.forEach(k => {
      newTouched[k] = true;
      const err = validate(k, fields[k]);
      if (err) newErrors[k] = err;
    });
    setTouched(newTouched);
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length === 0) {
      setReviewing(true);
    }
  }

  function handleConfirm() {
    // Store confirmation data for ConfirmationPage
    const ref = `FF-${Date.now().toString(36).toUpperCase()}`;
    sessionStorage.setItem('finsha-confirmation', JSON.stringify({
      booking,
      total,
      fields,
      ref,
    }));
    setConfirmed(true);   // disarm the empty-booking guard before clearing
    clearBooking();
    navigate('/confirmation');
  }

  if (reviewing) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Review Your Booking</h1>
          <div className={`neu-card ${styles.reviewCard}`}>
            <h2 className={styles.reviewHeading}>Booking Summary</h2>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewField}>
                <span className={styles.reviewLabel}>Full Name</span>
                <span className={styles.reviewValue}>{fields.fullName}</span>
              </div>
              <div className={styles.reviewField}>
                <span className={styles.reviewLabel}>Email</span>
                <span className={styles.reviewValue}>{fields.email}</span>
              </div>
              <div className={styles.reviewField}>
                <span className={styles.reviewLabel}>Phone</span>
                <span className={styles.reviewValue}>{fields.phone}</span>
              </div>
              <div className={styles.reviewField}>
                <span className={styles.reviewLabel}>Start Date</span>
                <span className={styles.reviewValue}>{fields.startDate}</span>
              </div>
              <div className={styles.reviewField}>
                <span className={styles.reviewLabel}>Session Type</span>
                <span className={styles.reviewValue}>{fields.sessionType}</span>
              </div>
              {fields.notes && (
                <div className={styles.reviewField} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.reviewLabel}>Notes</span>
                  <span className={styles.reviewValue}>{fields.notes}</span>
                </div>
              )}
            </div>

            <div className={styles.reviewDivider}></div>

            <h3 className={styles.reviewSubheading}>Classes</h3>
            {booking.map(item => (
              <div key={item.id} className={styles.reviewItem}>
                <span>{item.name} × {item.quantity}</span>
                <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div className={styles.reviewDivider}></div>
            <div className={styles.reviewTotal}>
              <span>Total</span>
              <span className={styles.reviewTotalValue}>PKR {total.toLocaleString()}</span>
            </div>

            <div className={styles.reviewActions}>
              <button className="btn-ghost" onClick={() => setReviewing(false)}>
                ← Edit Details
              </button>
              <button className="btn-primary" onClick={handleConfirm}>
                Confirm Booking ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Checkout form"
          >
            {/* Full Name */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="fullName">
                Full Name <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`neu-input ${errors.fullName ? styles.inputError : ''}`}
                value={fields.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p id="fullName-error" className={styles.fieldError} role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`neu-input ${errors.email ? styles.inputError : ''}`}
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                aria-required="true"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className={styles.fieldError} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">
                Phone Number <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`neu-input ${errors.phone ? styles.inputError : ''}`}
                value={fields.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="03XX-XXXXXXX"
                autoComplete="tel"
                aria-required="true"
                aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
                aria-invalid={!!errors.phone}
              />
              <p id="phone-hint" className={styles.hint}>Pakistani format: 03XX-XXXXXXX</p>
              {errors.phone && (
                <p id="phone-error" className={styles.fieldError} role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="startDate">
                Preferred Start Date <span className={styles.required} aria-hidden="true">*</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className={`neu-input ${errors.startDate ? styles.inputError : ''}`}
                value={fields.startDate}
                min={getTomorrow()}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                aria-invalid={!!errors.startDate}
              />
              {errors.startDate && (
                <p id="startDate-error" className={styles.fieldError} role="alert">
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* Session type */}
            <fieldset className={styles.fieldGroup}>
              <legend className={styles.label}>
                Session Type <span className={styles.required} aria-hidden="true">*</span>
              </legend>
              <div className={styles.radioGroup}>
                {['In-Studio', 'Online'].map(opt => (
                  <label key={opt} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="sessionType"
                      value={opt}
                      checked={fields.sessionType === opt}
                      onChange={handleChange}
                      className={styles.radio}
                    />
                    <span className={`neu-card ${styles.radioCard}`}>
                      {opt === 'In-Studio' ? '🏋️' : '💻'} {opt}
                      {opt === 'Online' && (
                        <span className={styles.r3Tag}> (R3 applies)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Notes */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="notes">
                Notes <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                className={`neu-input ${styles.textarea}`}
                value={fields.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requirements, injuries, or questions…"
              />
            </div>

            <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
              Review Booking →
            </button>
          </form>

          {/* Mini summary sidebar */}
          <div className={styles.aside}>
            <div className={`neu-card ${styles.asideCard}`}>
              <h2 className={styles.asideTitle}>Booking Summary</h2>
              {booking.map(item => (
                <div key={item.id} className={styles.asideRow}>
                  <span className={styles.asideLabel}>{item.name} × {item.quantity}</span>
                  <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={styles.asideDivider}></div>
              <div className={styles.asideTotal}>
                <span>Total</span>
                <span className={styles.asideTotalValue}>PKR {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
