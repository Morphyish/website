import React from 'react';
import clsx from 'clsx';
import SolarSystemSvg from '@site/src/svg/solar-system.svg';
import BoilAndBubblesSvg from '@site/src/svg/boil-and-bubbles.svg';
import LoadingSquaresSvg from '@site/src/svg/loading-squares.svg';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Solar System',
    Svg: SolarSystemSvg,
  },
  {
    title: 'Boil and Bubbles',
    Svg: BoilAndBubblesSvg,
  },
  {
    title: 'Loading Squares',
    Svg: LoadingSquaresSvg,
  },
];

function Feature({ title, Svg }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.svg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <p className={styles.label}>{title}</p>
      </div>
    </div>
  );
}

export default function SvgGallery(): JSX.Element {
  return (
    <section className={styles.gallery}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
