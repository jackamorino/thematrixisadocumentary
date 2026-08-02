import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { LiteYouTube } from '@/components/LiteYouTube';
import { Nav } from '@/components/Nav';
import { getSiteSettings, getVideos } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata, videoJsonLd } from '@/lib/seo';
import { buyLinks, cycleLabel } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Videos',
  path: '/videos',
  description:
    'Decode The Real: the remembering continues on YouTube, turning the Keys one video at a time.',
});
export const revalidate = 60;

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([
    getVideos(),
    getSiteSettings(),
  ]);

  const featured = videos.find((v) => v.featured) ?? videos[0];
  const rest = featured ? videos.filter((v) => v._id !== featured._id) : videos;

  const videoLd = videos
    .map((v) => videoJsonLd(v))
    .filter((x): x is Record<string, unknown> => Boolean(x));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Videos', path: '/videos' },
          ]),
          ...videoLd,
        ]}
      />
      <Nav solid />

      <main id="main">
        <header
          className="blog-header"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 0%, #101a33 0%, #05070d 70%)' }}
        >
          <p className="eyebrow">THE CHANNEL</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(30px,4.4vw,48px)' }}>
            Decode The Real
          </h1>
          <p className="lead" style={{ fontSize: 'clamp(17px,1.8vw,20px)', maxWidth: 560, margin: '16px auto 0' }}>
            The remembering continues on YouTube, turning the Keys, one video at a
            time.
          </p>
          <a
            href={buyLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: 28 }}
          >
            SUBSCRIBE ON YOUTUBE
          </a>
        </header>

        {!settings.showVideos ? (
          <section className="section center" aria-live="polite">
            <p className="lead" style={{ fontSize: 20, maxWidth: 560, margin: '0 auto' }}>
              The first videos are on their way. Subscribe on YouTube to be there
              when the Keys start turning.
            </p>
          </section>
        ) : (
          <>
            {featured && (
              <section style={{ padding: 'clamp(24px,4vw,40px) clamp(20px,6vw,100px) 0' }}>
                <div className="featured-card" style={{ display: 'block' }}>
                  <LiteYouTube id={featured.youtubeId} title={featured.title} large />
                  <div
                    style={{
                      padding: '22px 26px',
                      background: 'var(--panel)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 12,
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="font-heading" style={{ fontSize: 'clamp(18px,2vw,22px)', color: 'var(--text)' }}>
                      {featured.title}
                    </div>
                    <div style={{ fontSize: 15, color: 'var(--text-50)' }}>Latest upload</div>
                  </div>
                </div>
              </section>
            )}

            <section
              className="grid-fill"
              style={{ padding: 'clamp(32px,5vw,56px) clamp(20px,6vw,100px) clamp(48px,7vw,80px)' }}
              aria-label="All videos"
            >
              {rest.map((video) => (
                <div className="video-card" key={video._id}>
                  <LiteYouTube id={video.youtubeId} title={video.title} />
                  <div className="video-card__body">
                    <div className="video-card__title">{video.title}</div>
                    <div className="video-card__cat">{cycleLabel(video.cycle)}</div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
