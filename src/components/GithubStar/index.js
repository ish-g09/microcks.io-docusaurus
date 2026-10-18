import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

const REPO = 'microcks/microcks';
const CACHE_KEY = 'mk-gh-stars';
// Shown when the unauthenticated GitHub API is rate-limited or unreachable
const FALLBACK_COUNT = 2065;

export default function GithubStar({className}) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.t < 3600e3) {
        setCount(cached.n);
        return;
      }
    } catch {}
    fetch(`https://api.github.com/repos/${REPO}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        setCount(d.stargazers_count);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({n: d.stargazers_count, t: Date.now()}));
        } catch {}
      })
      .catch(() => setCount(FALLBACK_COUNT));
  }, []);

  return (
    <span className={`${styles.group} ${className || ''}`}>
      <a className={styles.star} href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer" aria-label={`Star ${REPO} on GitHub`}>
        <span className={styles.icon} aria-hidden="true" />
        Star
      </a>
      {count !== null && (
        <a className={styles.count} href={`https://github.com/${REPO}/stargazers`} target="_blank" rel="noopener noreferrer" aria-label={`${count.toLocaleString('en-US')} stargazers on GitHub`}>
          {count.toLocaleString('en-US')}
        </a>
      )}
    </span>
  );
}
