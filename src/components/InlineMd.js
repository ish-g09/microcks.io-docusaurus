import React from 'react';
import Link from '@docusaurus/Link';

// Tiny inline renderer for the data files: **bold**, [text](url) and <br>. No raw HTML is ever injected.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|<br\s*\/?>)/g;

export default function InlineMd({text}) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (/^<br/.test(part)) return <br key={i} />;
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) return <Link key={i} to={link[2]}>{link[1]}</Link>;
        return part;
      })}
    </>
  );
}
