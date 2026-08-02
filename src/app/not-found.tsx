import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';

export default function NotFound() {
  return (
    <>
      <Nav solid />
      <main id="main" className="section center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p className="eyebrow">LOST IN THE LABYRINTH</p>
        <h1 className="section-title" style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
          This page has been forgotten
        </h1>
        <p className="lead" style={{ fontSize: 20, maxWidth: 480, margin: '16px auto 28px' }}>
          The thread that guides you out is love, but this door leads nowhere.
          Let&rsquo;s find your way back.
        </p>
        <div className="btn-row btn-row--center">
          <Link href="/" className="btn btn-primary">
            RETURN HOME
          </Link>
          <Link href="/blog" className="btn btn-outline">
            READ THE KEYS
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
