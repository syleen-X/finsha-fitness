import { Link } from 'react-router-dom';
import { isClassBookable } from '../rules/bookingRules.js';
import styles from './ClassCard.module.css';

const CATEGORY_COLORS = {
  Cardio: '#E76F51',
  Strength: '#264653',
  Yoga: '#2A9D8F',
  Dance: '#e9a830',
  Combat: '#c0392b',
  'Mind & Body': '#8e6bbf',
};

const INTENSITY_COLORS = {
  Low: '#2A9D8F',
  Medium: '#e9a830',
  High: '#E76F51',
};

export default function ClassCard({ cls }) {
  const spotsLeft = cls.capacity - cls.enrolled;
  const { bookable } = isClassBookable(cls);

  let spotsColor = styles.spotsGreen;
  if (!bookable) spotsColor = styles.spotsGrey;
  else if (spotsLeft <= 1) spotsColor = styles.spotsRed;
  else if (spotsLeft <= 5) spotsColor = styles.spotsOrange;

  return (
    <article className={`neu-card ${styles.card} ${!bookable ? styles.unavailable : ''}`}>
      {/* Overlay for sold out / inactive */}
      {!bookable && (
        <div className={styles.overlay} aria-label={cls.available ? 'Fully Booked' : 'Inactive'}>
          <span>{cls.available ? 'Fully Booked' : 'Inactive'}</span>
        </div>
      )}

      {/* Category badge */}
      <div
        className={styles.badge}
        style={{ background: CATEGORY_COLORS[cls.category] || '#888' }}
        aria-label={`Category: ${cls.category}`}
      >
        {cls.category}
      </div>

      {/* Class image */}
      <div className={styles.imageWrap} aria-hidden="true">
        {cls.image ? (
          <img
            src={cls.image}
            alt=""
            className={styles.image}
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className={styles.imageFallback} style={{ display: cls.image ? 'none' : 'flex' }}>
          <span className={styles.imageLetter}>{cls.name[0]}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{cls.name}</h3>
        <p className={styles.trainer}>👤 {cls.trainer}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>⏱ {cls.duration} min</span>
          <span
            className={styles.intensity}
            style={{ color: INTENSITY_COLORS[cls.intensity] }}
          >
            {cls.intensity}
          </span>
        </div>

        <div className={styles.schedule}>
          <span className={styles.scheduleLabel}>📅</span>
          {cls.schedule.map(d => (
            <span key={d} className={styles.day}>{d}</span>
          ))}
          <span className={styles.time}>{cls.time}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceGroup}>
            <span className={styles.price}>PKR {cls.price.toLocaleString()}</span>
            <span className={styles.perSession}>/session</span>
          </div>
          <span className={`${styles.spots} ${spotsColor}`}>
            {bookable ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : (cls.available ? 'Full' : 'Inactive')}
          </span>
        </div>

        <Link
          to={`/classes/${cls.id}`}
          className={`btn-primary ${styles.viewBtn}`}
          aria-label={`View details for ${cls.name}`}
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
