import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import InlineMd from '../components/InlineMd';
import {community} from '../data/home';
import styles from './community.module.css';

export default function Community() {
  const {withBaseUrl} = useBaseUrlUtils();
  const {banner, blocks} = community;
  return (
    <Layout title="Microcks community and resources" description="Microcks community and resources">
      <main>
        <header className={styles.banner}>
          <div className={clsx('container', styles.bannerInner)}>
            <div>
              <h1>{banner.title}</h1>
              <p className={styles.lead}><InlineMd text={banner.content} /></p>
              <Link className="button button--outline button--primary button--lg" href={banner.link}>{banner.label}</Link>
            </div>
            <img src={withBaseUrl(banner.image)} alt="Microcks maintainers and community" />
          </div>
        </header>
        {blocks.map((b, i) => (
          <section key={b.title} className={clsx(styles.block, i % 2 === 0 && styles.alt)}>
            <div className={clsx('container', styles.row, i % 2 === 1 && styles.reverse)}>
              <div className={styles.text}>
                <h2><InlineMd text={b.title} /></h2>
                <p><InlineMd text={b.content} /></p>
              </div>
              <img src={withBaseUrl(b.image)} alt="" loading="lazy" />
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
