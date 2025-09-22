import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Andrii Furmanets';
    const description = searchParams.get('description') || 'Senior Full-Stack Developer';

    return new ImageResponse(
      (
        <div
          style={{
            background: '#0f172a',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontFamily: 'system-ui',
            padding: '120px',
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '50px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: '1.2',
                margin: 0,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              {description}
            </p>

            <div
              style={{
                fontSize: '20px',
                color: '#64748b',
                margin: 0,
                marginTop: '40px',
              }}
            >
              andriifurmanets.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}