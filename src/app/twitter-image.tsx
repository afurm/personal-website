import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Andrii Furmanets - Senior Full-Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: '#000000',
            opacity: 0.1,
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: '#000000',
            opacity: 0.1,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#000000',
              margin: 0,
            }}
          >
            Andrii Furmanets
          </h1>

          <h2
            style={{
              fontSize: 36,
              color: '#475569',
              margin: 0,
              marginBottom: 16,
            }}
          >
            Senior Full-Stack Developer
          </h2>

          <p
            style={{
              fontSize: 28,
              color: '#64748b',
              margin: 0,
            }}
          >
            React • TypeScript • Next.js • Ruby on Rails
          </p>

          <p
            style={{
              fontSize: 28,
              color: '#64748b',
              margin: 0,
              marginBottom: 32,
            }}
          >
            Fintech • Web3 • Healthcare
          </p>

          <p
            style={{
              fontSize: 24,
              color: '#475569',
              margin: 0,
            }}
          >
            andriifurmanets.com
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
