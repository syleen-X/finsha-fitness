import styles from './QuantityControl.module.css';

export default function QuantityControl({ value, onChange, min = 1, max = 6, label }) {
  return (
    <div className={styles.wrapper} role="group" aria-label={label || 'Quantity'}>
      <button
        className={`${styles.btn} ${styles.btnMinus}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        className={`${styles.btn} ${styles.btnPlus}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
