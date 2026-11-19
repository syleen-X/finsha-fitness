import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

const VARIANTS = {
  noClasses: {
    icon: '🏋️',
    title: 'No classes available',
    message: 'We haven\'t added any fitness classes yet. Check back soon!',
    action: null,
  },
  noSearch: {
    icon: '🔍',
    title: 'No matches found',
    message: 'No classes match your search. Try different keywords or clear your search.',
    action: null,
  },
  noFilter: {
    icon: '📂',
    title: 'No classes in this category',
    message: 'No classes match the selected filter. Try a different category.',
    action: null,
  },
  emptyBooking: {
    icon: '📋',
    title: 'Your booking is empty',
    message: 'You haven\'t added any classes yet. Browse our schedule and book a session!',
    action: { label: 'Browse Classes', to: '/classes' },
  },
};

export default function EmptyState({ variant = 'noClasses', onReset }) {
  const v = VARIANTS[variant] || VARIANTS.noClasses;
  return (
    <div className={styles.wrapper}>
      <div className={`neu-card ${styles.card}`}>
        <span className={styles.icon} aria-hidden="true">{v.icon}</span>
        <h3 className={styles.title}>{v.title}</h3>
        <p className={styles.message}>{v.message}</p>
        {onReset && (
          <button className="btn-ghost" onClick={onReset}>
            Clear Filters
          </button>
        )}
        {v.action && (
          <Link to={v.action.to} className="btn-primary">
            {v.action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
