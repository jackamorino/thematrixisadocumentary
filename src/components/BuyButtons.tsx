import { buyLinks, withUtm } from '@/lib/site';

interface BuyButtonsProps {
  source: string;
  size?: 'default' | 'sm';
  center?: boolean;
  amazonLabel?: string;
  appleLabel?: string;
}

/** The two primary conversion buttons (Amazon + Apple Books) with UTM tagging. */
export function BuyButtons({
  source,
  size = 'default',
  center = false,
  amazonLabel = 'BUY ON AMAZON',
  appleLabel = 'APPLE BOOKS',
}: BuyButtonsProps) {
  const sm = size === 'sm' ? ' btn-sm' : '';
  return (
    <div className={`btn-row${center ? ' btn-row--center' : ''}`}>
      <a
        href={withUtm(buyLinks.amazon, source)}
        className={`btn btn-primary${sm}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="buy-amazon"
      >
        {amazonLabel}
      </a>
      <a
        href={withUtm(buyLinks.apple, source)}
        className={`btn btn-outline${sm}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="buy-apple"
      >
        {appleLabel}
      </a>
    </div>
  );
}
