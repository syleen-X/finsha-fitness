import styles from './ErrorState.module.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert" aria-live="assertive">
      <div className={`neu-card ${styles.card}`}>
        <span className={styles.icon} aria-hidden="true">⚠️</span>
        <h3 className={styles.title}>Oops! Something went wrong</h3>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button className="btn-primary" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
