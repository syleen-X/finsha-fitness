import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ message = 'Loading classes...' }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={`neu-card ${styles.card}`}>
        <div className={styles.spinnerRing} aria-hidden="true">
          <div className={styles.inner}></div>
        </div>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}
