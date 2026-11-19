import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={`neu-card ${styles.card}`}>
        <span className={styles.icon} aria-hidden="true">🗺️</span>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          The page you are looking for does not exist or has been moved. Check the URL or return to Finsha Fitness home.
        </p>
        <Link to="/" className={`btn-primary ${styles.homeBtn}`}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
