import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const KEY = 'microcks-cookie-consent';
const GA_ID = 'G-9TK2NJ5V4J';
const SCARF_ID = '19c4c77c-b3f5-4936-a328-7248d6f29cae';

function enableAnalytics() {
  if (window.__mkAnalytics) return;
  window.__mkAnalytics = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {anonymize_ip: true});
  const ga = document.createElement('script');
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(ga);

  const pixel = new Image();
  pixel.referrerPolicy = 'no-referrer-when-downgrade';
  pixel.src = `https://static.scarf.sh/a.png?x-pxid=${SCARF_ID}`;
}

/** Analytics (Google Analytics + Scarf) only load after explicit consent. */
export default function CookieConsent() {
  const [choice, setChoice] = useState('pending');

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === 'accepted') enableAnalytics();
    setChoice(stored ?? 'unset');
  }, []);

  const decide = value => {
    localStorage.setItem(KEY, value);
    if (value === 'accepted') enableAnalytics();
    setChoice(value);
  };

  if (choice !== 'unset') return null;
  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p>
        We use cookies to measure audience and improve this website. See the{' '}
        <Link href="https://www.linuxfoundation.org/legal/privacy-policy">Linux Foundation privacy policy</Link>.
      </p>
      <div className={styles.actions}>
        <button className="button button--primary button--sm" onClick={() => decide('accepted')}>Accept</button>
        <button className="button button--secondary button--outline button--sm" onClick={() => decide('declined')}>Decline</button>
      </div>
    </div>
  );
}
