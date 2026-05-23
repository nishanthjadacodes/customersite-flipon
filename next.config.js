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
}

module.exports = nextConfig
