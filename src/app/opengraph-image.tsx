import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BazaarSaar - Free Trade Journal & Behavioral Analytics for Indian Traders';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #111127 50%, #0a0a0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#fafaff',
            letterSpacing: '-2px',
            marginBottom: 8,
          }}
        >
          BazaarSaar
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#6b6b8a',
            marginBottom: 24,
          }}
        >
          बाज़ारसार
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#9090aa',
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: 40,
          }}
        >
          Free Trade Journal & Behavioral Analytics for Indian Traders
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
          }}
        >
          {['Trade Journal', 'Emotion Tracking', 'Playbook Adherence', 'Weekly Review'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: 12,
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.05)',
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 14,
            color: '#4a4a6a',
          }}
        >
          bazzarsaar.com · Works with Zerodha, Groww, Angel One & Upstox
        </div>
      </div>
    ),
    { ...size }
  );
}
