import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bazzarsaar.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/trades/', '/review/', '/settings/', '/onboarding/', '/datalab/', '/api/', '/auth/zerodha/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
