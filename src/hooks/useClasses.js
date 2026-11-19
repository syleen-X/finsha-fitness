import { useState, useEffect } from 'react';
import { loadClasses } from '../utils/mockLoader.js';

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetch() {
    setLoading(true);
    setError(null);
    try {
      const data = await loadClasses();
      setClasses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetch(); }, []);

  return { classes, loading, error, retry: fetch };
}
