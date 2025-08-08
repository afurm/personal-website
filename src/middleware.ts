import { NextResponse, type NextRequest } from 'next/server';

// Canonical host and basic URL normalization without client-side scripts
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Enforce non-www
  if (url.hostname === 'www.andriifurmanets.com') {
    url.hostname = 'andriifurmanets.com';
    return NextResponse.redirect(url, 308);
  }

  // Prevent trailing slash on non-root paths
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/$/, '');
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)'],
};


