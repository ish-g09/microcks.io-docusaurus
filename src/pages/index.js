import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {FaArrowRight} from 'react-icons/fa6';
import InlineMd from '../components/InlineMd';
import {hero, adopters, services, sponsors, supporters} from '../data/home';
import styles from './index.module.css';

function Hero() {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.wide, styles.heroInner)}>
        <div className={styles.heroText}>
          <h1>{hero.title}</h1>
          <p className={styles.heroLead}>
            <InlineMd text={hero.content} />
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to={hero.getStartedLink}>
              Get started
            </Link>
            <Link className="button button--outline button--primary button--lg" href={hero.releaseLink}>
              {hero.releaseLabel}
            </Link>
          </div>
          <ThemedImage
            className={styles.cncf}
            alt="Cloud Native Computing Foundation incubating project"
            sources={{light: withBaseUrl('/images/cncf-color.svg'), dark: withBaseUrl('/images/cncf-white.svg')}}
          />
        </div>
        <div className={styles.heroImage}>
          <img src={withBaseUrl('/images/Atom.svg')} alt="Microcks at the centre of the API ecosystem: Kafka, gRPC, GraphQL, CI/CD, Kubernetes…" />
        </div>
      </div>
    </header>
  );
}

function Adopters() {
  const {withBaseUrl} = useBaseUrlUtils();
  const logos = [...adopters.logos, ...adopters.logos];
  return (
    <>
      <section className={clsx(styles.section, styles.alt)}>
        <div className="container">
          <h2 className={clsx(styles.sectionTitle, styles.adoptersTitle)}>
            <InlineMd text={adopters.title} />
          </h2>
        </div>
      </section>
      <section className={clsx(styles.section, styles.adoptersLogos)}>
        <div className={styles.marquee} role="region" aria-label="Microcks adopters">
          <ul className={styles.marqueeTrack}>
            {logos.map((l, i) => (
              <li key={i} aria-hidden={i >= adopters.logos.length}>
                <img src={withBaseUrl(l.src)} alt={i < adopters.logos.length ? l.name : ''} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Services() {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <>
      {services.map((s, i) => (
        <section key={s.title} className={clsx(styles.section, i % 2 === 1 && styles.alt)}>
          <div className={clsx('container', styles.wide, styles.row, i % 2 === 1 && styles.rowReverse)}>
            <div className={styles.rowText}>
              <h2>{s.title}</h2>
              <p><InlineMd text={s.content} /></p>
              <Link className={styles.moreLink} to={s.link}>
                {s.label} <FaArrowRight aria-hidden size={12} />
              </Link>
            </div>
            <div className={styles.rowImage}>
              <img src={withBaseUrl(s.image)} alt={s.title} loading="lazy" />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

function Logos({data, children}) {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <section className={styles.section}>
      <div className={clsx('container', styles.center)}>
        <h2 className={styles.sectionTitle}>{data.title}</h2>
        <p className={styles.sectionLead}><InlineMd text={data.content} /></p>
        <ul className={styles.logoGrid}>
          {data.logos.map(l => (
            <li key={l.name}><img src={withBaseUrl(l.src)} alt={l.name} loading="lazy" /></li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout title="API Mocking and Testing" description="Microcks is an open source, cloud native tool for API Mocking and Testing">
      <main>
        <Hero />
        <Adopters />
        <Services />
        <Logos data={sponsors}>
          <a className={styles.donate} href="https://opencollective.com/microcks" target="_blank" rel="noopener noreferrer">
            Donate to our Collective
          </a>
        </Logos>
        <Logos data={supporters} />
      </main>
    </Layout>
  );
}
