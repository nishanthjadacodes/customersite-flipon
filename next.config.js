/** @type {import('next').NextConfig} */
const nextConfig = {
  // remotePatterns (Next 13+) is the modern replacement for `domains`.
  // next/image refuses to render any remote URL whose host isn't listed
  // here, so we explicitly allow the Render backend (where /uploads/*
  // files live) and Cloudinary (production media). Add new hosts here
  // as the catalogue grows — leaving the list to `localhost` only would
  // break every avatar / service image in production on Amplify.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flipon-backend.onrender.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // 301-redirect the old short legal-page slugs to the new canonical
  // URLs. The short slugs (/privacy, /terms, /contact) were the
  // original routes; we moved to longer, search-engine-friendly
  // versions because Play Store + standard SEO crawlers look for
  // /privacy-policy and /terms-and-conditions specifically.
  // permanent: true tells crawlers to update their indexes and stops
  // the old URLs from accumulating ranking weight separately.
  async redirects() {
    return [
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/contact', destination: '/contact-us', permanent: true },
    ];
  },
}

module.exports = nextConfig
