import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CookieConsent from '@site/src/components/CookieConsent';

export default function Root({children}) {
  return (
    <>
      <blockquote className="llms-txt-directive">
        For AI agents: the complete documentation index is available at <a href="/llms.txt">llms.txt</a>; every page is also available as Markdown by appending <code>.md</code> to its URL.
      </blockquote>
      {children}
      <BrowserOnly>{() => <CookieConsent />}</BrowserOnly>
    </>
  );
}
