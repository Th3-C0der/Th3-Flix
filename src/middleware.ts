import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to block popups and ads
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: http:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.myanimelist.net https://graphql.anilist.co https://*.supabase.co wss://*.supabase.co https://api.themoviedb.org",
      "frame-src 'self' https://www.youtube.com https://vidsrc.cc https://vidlink.pro https://www.vidking.net https://embed.su https://multiembed.mov https://filmku.stream https://www.nontongo.win https://autoembed.co https://player.autoembed.cc https://www.2embed.cc https://vidsrc.xyz https://vidsrc.to https://vidsrc.icu https://moviesapi.club https://2anime.xyz https://allanime.day https://challenges.cloudflare.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
