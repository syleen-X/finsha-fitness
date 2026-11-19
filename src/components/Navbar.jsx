import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ bookingCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Finsha Fitness - Home">
          {/* Dumbbell icon SVG */}
          <svg className={styles.logoIcon} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="14" width="6" height="8" rx="2" fill="#E76F51"/>
            <rect x="28" y="14" width="6" height="8" rx="2" fill="#E76F51"/>
            <rect x="7" y="11" width="4" height="14" rx="1.5" fill="#2A9D8F"/>
            <rect x="25" y="11" width="4" height="14" rx="1.5" fill="#2A9D8F"/>
            <rect x="11" y="16" width="14" height="4" rx="2" fill="#F4EDE4"/>
          </svg>
          <span className="liquid-chrome">Finsha</span>
          <span className={styles.logoSub}>&nbsp;Fitness</span>
        </Link>

        <button
          className={styles.hamburger}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        </button>

        <ul
          id="nav-menu"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
          role="menubar"
        >
          <li role="none">
            <Link
              to="/"
              role="menuitem"
              className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li role="none">
            <Link
              to="/classes"
              role="menuitem"
              className={`${styles.link} ${isActive('/classes') ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Classes
            </Link>
          </li>
          <li role="none">
            <Link
              to="/booking"
              role="menuitem"
              className={`${styles.link} ${isActive('/booking') ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
              aria-label={`My Booking${bookingCount > 0 ? `, ${bookingCount} sessions` : ''}`}
            >
              My Booking
              {bookingCount > 0 && (
                <span className={styles.badge} aria-hidden="true">{bookingCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
