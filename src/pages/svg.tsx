import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import SvgGallery from '@site/src/components/SvgGallery';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">SVG</h1>
        <p className="hero__subtitle">A gallery of animated doodles</p>
      </div>
    </header>
  );
}

export default function Svg() {
  return (
    <Layout
      title="SVG"
      description="Svg are meaningless">
      <HomepageHeader />
      <main>
        <SvgGallery />
      </main>
    </Layout>
  );
}
