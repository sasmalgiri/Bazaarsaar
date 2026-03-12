/**
 * Yahoo Finance API helper with crumb/cookie authentication.
 * Yahoo requires a valid crumb + cookie pair for API access (enforced since 2023).
 * We cache the crumb/cookie for 30 minutes to avoid excessive requests.
 */

let cachedCrumb: string | null = null;
let cachedCookie: string | null = null;
let cachedAt = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function fetchCrumb(): Promise<{ crumb: string; cookie: string }> {
  // Step 1: Get consent cookie from Yahoo Finance
  const consentRes = await fetch('https://fc.yahoo.com', {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'manual',
  });
  // We need the set-cookie header even from a redirect/error
  const setCookies = consentRes.headers.getSetCookie?.() ?? [];
  const cookieJar = setCookies.map(c => c.split(';')[0]).join('; ');

  // Step 2: Fetch the crumb using the cookie
  const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      'User-Agent': USER_AGENT,
      'Cookie': cookieJar,
    },
  });

  if (!crumbRes.ok) {
    throw new Error(`Failed to fetch Yahoo crumb: ${crumbRes.status}`);
  }

  const crumb = await crumbRes.text();
  return { crumb: crumb.trim(), cookie: cookieJar };
}

async function getCrumbAndCookie(): Promise<{ crumb: string; cookie: string }> {
  const now = Date.now();
  if (cachedCrumb && cachedCookie && now - cachedAt < CACHE_TTL) {
    return { crumb: cachedCrumb, cookie: cachedCookie };
  }

  const { crumb, cookie } = await fetchCrumb();
  cachedCrumb = crumb;
  cachedCookie = cookie;
  cachedAt = now;
  return { crumb, cookie };
}

/**
 * Fetch from Yahoo Finance API with proper authentication.
 * Automatically retries once if crumb is stale.
 */
export async function yahooFetch(url: string): Promise<Response> {
  const { crumb, cookie } = await getCrumbAndCookie();
  const separator = url.includes('?') ? '&' : '?';
  const authedUrl = `${url}${separator}crumb=${encodeURIComponent(crumb)}`;

  let res = await fetch(authedUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      'Cookie': cookie,
    },
  });

  // If 401/403, crumb might be stale — refresh and retry once
  if (res.status === 401 || res.status === 403) {
    cachedCrumb = null; // force refresh
    const fresh = await getCrumbAndCookie();
    const freshUrl = `${url}${separator}crumb=${encodeURIComponent(fresh.crumb)}`;
    res = await fetch(freshUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': fresh.cookie,
      },
    });
  }

  return res;
}
