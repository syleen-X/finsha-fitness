import { Link } from 'react-router-dom';
import { fitnessClasses } from '../data/classes.js';
import ClassCard from '../components/ClassCard.jsx';
import styles from './HomePage.module.css';

const STATS = [
  { value: '50+', label: 'Classes' },
  { value: '12+', label: 'Trainers' },
  { value: '500+', label: 'Members' },
  { value: '7', label: 'Days / Week' },
];

const FEATURES = [
  {
    icon: '🏆',
    title: 'Expert Trainers',
    desc: 'All instructors are certified professionals with 5+ years of experience in their discipline.',
  },
  {
    icon: '📍',
    title: 'Prime Location',
    desc: 'Located in the heart of Islamabad, easily accessible from F-10 and G-11 sectors.',
  },
  {
    icon: '💪',
    title: 'Modern Equipment',
    desc: 'State-of-the-art equipment updated annually to keep you training with the best tools available.',
  },
];

const featuredClasses = fitnessClasses.filter(c => c.available && (c.capacity - c.enrolled) > 0).slice(0, 4);

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroBg} aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className={styles.heroBgImg}
          />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>🔥 Islamabad&apos;s #1 Fitness Studio</span>
          <h1 id="hero-heading" className={`liquid-chrome ${styles.heroHeading}`}>
            Train Smarter.<br />Live Fitter.
          </h1>
          <p className={styles.heroSubtext}>
            Finsha Fitness is your complete fitness destination — expert trainers, diverse classes,
            and a community that keeps you moving.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/classes" className="btn-primary">
              Browse Classes →
            </Link>
            <Link to="/booking" className="btn-ghost">
              View My Booking
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.statsStrip} aria-label="Studio statistics">
        <div className={styles.statsInner}>
          {STATS.map(s => (
            <div key={s.label} className={`neu-card ${styles.statCard}`}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured classes */}
      <section className={styles.section} aria-labelledby="featured-heading">
        <div className={styles.sectionInner}>
          <h2 id="featured-heading" className={styles.sectionTitle}>
            Featured Classes
          </h2>
          <p className={styles.sectionSub}>Handpicked sessions to get you started</p>
          <div className={styles.grid}>
            {featuredClasses.map(cls => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
          <div className={styles.cta}>
            <Link to="/classes" className="btn-accent">
              Browse All Classes
            </Link>
          </div>
        </div>
      </section>

      {/* Why Finsha */}
      <section className={styles.whySection} aria-labelledby="why-heading">
        <div className={styles.sectionInner}>
          <h2 id="why-heading" className={styles.sectionTitle}>Why Finsha?</h2>
          <p className={styles.sectionSub}>What makes us different</p>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={`neu-card ${styles.featureCard}`}>
                <span className={styles.featureIcon} aria-hidden="true">{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
