import Link from 'next/link';

export default function RootPage() {
  return (
    <main>
      <h1>Hello, world!</h1>
      <Link href="/skills">Start viewing skills</Link>
    </main>
  );
}
