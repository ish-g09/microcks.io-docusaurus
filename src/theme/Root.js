import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CookieConsent from '@site/src/components/CookieConsent';

export default function Root({children}) {
  return (
    <>
      {children}
      <BrowserOnly>{() => <CookieConsent />}</BrowserOnly>
    </>
  );
}
