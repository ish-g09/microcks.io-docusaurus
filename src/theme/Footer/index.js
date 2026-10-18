import React from 'react';
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {FaGithub, FaDiscord, FaLinkedinIn, FaBluesky, FaXTwitter, FaMastodon, FaYoutube} from 'react-icons/fa6';
import {socials} from '@site/src/data/home';
import styles from './styles.module.css';

const ICONS = {github: FaGithub, discord: FaDiscord, linkedin: FaLinkedinIn, bluesky: FaBluesky, x: FaXTwitter, mastodon: FaMastodon, youtube: FaYoutube};

const LINKS = [
  {label: 'Quick Start', to: '/documentation/tutorials/getting-started/'},
  {label: 'Privacy Policy', href: 'https://www.linuxfoundation.org/legal/privacy-policy'},
  {label: 'Terms & Conditions', href: 'https://www.linuxfoundation.org/legal/terms'},
];

function Footer() {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <footer className={`footer ${styles.footer}`}>
      <div className={`container ${styles.top}`}>
        <Link to="/" aria-label="Microcks home">
          <ThemedImage
            alt="Microcks"
            width={160}
            sources={{light: withBaseUrl('/images/microcks-logo-blue-name.png'), dark: withBaseUrl('/images/microcks-logo-white-name.png')}}
          />
        </Link>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {LINKS.map(l => (
              <li key={l.label}><Link {...(l.to ? {to: l.to} : {href: l.href})}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <ul className={styles.socials}>
          {socials.map(s => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.name}>
                <a href={s.href} aria-label={s.name} title={s.name} target="_blank" rel="noopener noreferrer"><Icon size={18} /></a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={`container ${styles.legal}`}>
        <p>
          Copyright © {new Date().getFullYear()} The Linux Foundation® (TLF) has registered trademarks and uses trademarks. For a list of TLF
          trademarks, see <Link href="https://www.linuxfoundation.org/legal/trademark-usage">Trademark Usage</Link>.
        </p>
        <p>
          <strong>Microcks</strong> is a{' '}
          <Link href="https://landscape.cncf.io/?selected=microcks&item=app-definition-and-development--application-definition-image-build--microcks">
            <strong>Cloud Native Computing Incubating</strong>
          </Link>{' '}
          project 🚀
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
