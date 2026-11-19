import { useState, useMemo, useEffect } from 'react';
import { useClasses } from '../hooks/useClasses.js';
import { setMockFailure } from '../utils/mockLoader.js';
import ClassCard from '../components/ClassCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import styles from './ClassesPage.module.css';

const CATEGORIES = ['All', 'Cardio', 'Strength', 'Yoga', 'Dance', 'Combat', 'Mind & Body'];
const SORTS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'duration', label: 'Duration' },
  { value: 'spots', label: 'Spots Left' },
];

export default function ClassesPage() {
  const { classes, loading, error, retry } = useClasses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [simFail, setSimFail] = useState(false);

  // Sync mockLoader failure flag + immediately re-fetch to reflect new state
  useEffect(() => {
    setMockFailure(simFail);
    retry();          // triggers a fresh fetch with the new failure flag
  }, [simFail]);     // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    let result = [...classes];

    // Search filter — independent of category filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.trainer.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    // Category filter — independent of search
    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }

    // Sort — applied after filtering
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'spots':
        result.sort((a, b) => (b.capacity - b.enrolled) - (a.capacity - a.enrolled));
        break;
      default:
        break;
    }

    return result;
  }, [classes, search, category, sort]);

  const hasSearch = search.trim().length > 0;
  const hasCategory = category !== 'All';

  function emptyVariant() {
    if (classes.length === 0) return 'noClasses';
    if (hasSearch || hasCategory) {
      if (hasSearch) return 'noSearch';
      return 'noFilter';
    }
    return 'noClasses';
  }

  function resetFilters() {
    setSearch('');
    setCategory('All');
    setSort('default');
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fitness Classes</h1>
          <p className={styles.sub}>Find the perfect class for your goals</p>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <label htmlFor="class-search" className="sr-only">Search classes</label>
            <input
              id="class-search"
              type="search"
              className={`neu-input ${styles.searchInput}`}
              placeholder="Search by name, trainer or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search fitness classes"
            />
          </div>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <label htmlFor="sort-select" className="sr-only">Sort classes</label>
            <select
              id="sort-select"
              className={`neu-input ${styles.sortSelect}`}
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort classes"
            >
              {SORTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className={styles.categories} role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* DEV: simulate failure toggle */}
        {import.meta.env.DEV && (
          <div className={styles.devBar}>
            <label className={styles.devLabel}>
              <input
                type="checkbox"
                checked={simFail}
                onChange={e => {
                  setSimFail(e.target.checked);
                  retry();
                }}
              />
              Simulate Load Failure
            </label>
          </div>
        )}

        {/* Results info */}
        {!loading && !error && classes.length > 0 && (
          <p className={styles.resultCount} aria-live="polite">
            Showing <strong>{filtered.length}</strong> of {classes.length} classes
            {(hasSearch || hasCategory) && (
              <button className={styles.clearBtn} onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </p>
        )}

        {/* Content */}
        {loading && <LoadingSpinner />}
        {!loading && error && <ErrorState message={error} onRetry={retry} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            variant={emptyVariant()}
            onReset={(hasSearch || hasCategory) ? resetFilters : undefined}
          />
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className={styles.grid} aria-label="Fitness classes list">
            {filtered.map(cls => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
