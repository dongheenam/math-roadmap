import Link from 'next/link';

import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/skills">Skills</Link>
      <Link href="/units">Unit builder</Link>
    </nav>
  );
}
