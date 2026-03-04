import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_HOSTNAMES = new Set<string>();

function initAllowedHostnames() {
  if (ALLOWED_HOSTNAMES.size > 0) return;
  ALLOWED_HOSTNAMES.add('localhost');
  ALLOWED_HOSTNAMES.add('127.0.0.1');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const hostname = new URL(appUrl).hostname;
      ALLOWED_HOSTNAMES.add(hostname);
      if (hostname.startsWith('www.')) ALLOWED_HOSTNAMES.add(hostname.slice(4));
      else ALLOWED_HOSTNAMES.add(`www.${hostname}`);
    } catch { /* invalid URL */ }
  }
}

const ALLOWED_HOSTNAME_PATTERNS = [
  /^[a-z0-9-]+\.vercel\.app$/i,
];

function isAllowedHostname(hostname: string): boolean {
  initAllowedHostnames();
  if (ALLOWED_HOSTNAMES.has(hostname)) return true;
  return ALLOWED_HOSTNAME_PATTERNS.some((p) => p.test(hostname));
}

function isInternalRequest(request: NextRequest | Request): boolean {
  const headers = request.headers;
  const secFetchSite = headers.get('sec-fetch-site');
  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site') return true;
  if (secFetchSite === 'cross-site') return false;

  const origin = headers.get('origin');
  if (origin) {
    try { return isAllowedHostname(new URL(origin).hostname); } catch { return false; }
  }
  const referer = headers.get('referer');
  if (referer) {
    try { return isAllowedHostname(new URL(referer).hostname); } catch { return false; }
  }
  return false;
}

export function enforceDisplayOnly(
  request: NextRequest | Request,
  routePath: string
): NextResponse | null {
  if (process.env.NODE_ENV === 'development') {
    const secFetchSite = request.headers.get('sec-fetch-site');
    if (secFetchSite === 'cross-site') {
      return NextResponse.json(
        { error: 'Display-only data', route: routePath, message: 'BazaarSaar data is for display purposes only.' },
        { status: 403 }
      );
    }
    return null;
  }
  if (!isInternalRequest(request)) {
    return NextResponse.json(
      { error: 'Display-only data', route: routePath, message: 'BazaarSaar data is for display purposes only.' },
      { status: 403 }
    );
  }
  return null;
}
