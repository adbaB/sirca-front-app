import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // /advisors/** → backend:3000/advisors/**
        source: '/advisors/:path*',
        destination: `${API_BASE_URL}/advisors/:path*`,
      },
      {
        // /statistics/** → backend:3000/statistics/**
        source: '/statistics/:path*',
        destination: `${API_BASE_URL}/statistics/:path*`,
      },
      {
        // /auth/** → backend:3000/auth/**
        source: '/auth/:path*',
        destination: `${API_BASE_URL}/auth/:path*`,
      },
      {
        // /users/** → backend:3000/users/**
        source: '/users/:path*',
        destination: `${API_BASE_URL}/users/:path*`,
      },
      {
        // /roles/** → backend:3000/roles/**
        source: '/roles/:path*',
        destination: `${API_BASE_URL}/roles/:path*`,
      },
      {
        // /permissions/** → backend:3000/permissions/**
        source: '/permissions/:path*',
        destination: `${API_BASE_URL}/permissions/:path*`,
      },
      {
        // /contracts/** → backend:3000/contracts/**
        source: '/contracts/:path*',
        destination: `${API_BASE_URL}/contracts/:path*`,
      },
      {
        // /portfolios/** → backend:3000/portfolios/**
        source: '/portfolios/:path*',
        destination: `${API_BASE_URL}/portfolios/:path*`,
      },
      {
        // /affiliates/** → backend:3000/affiliates/**
        source: '/affiliates/:path*',
        destination: `${API_BASE_URL}/affiliates/:path*`,
      },
      {
        // /payments/** → backend:3000/payments/**
        source: '/payments/:path*',
        destination: `${API_BASE_URL}/payments/:path*`,
      },
      {
        // /persons/** → backend:3000/persons/**
        source: '/persons/:path*',
        destination: `${API_BASE_URL}/persons/:path*`,
      },
      {
        // /plans/** → backend:3000/plans/**
        source: '/plans/:path*',
        destination: `${API_BASE_URL}/plans/:path*`,
      },
      {
        // /billing/** → backend:3000/billing/**
        source: '/billing/:path*',
        destination: `${API_BASE_URL}/billing/:path*`,
      },
      {
        // /reports/** → backend:3000/reports/**
        source: '/reports/:path*',
        destination: `${API_BASE_URL}/reports/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "adba-5x",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
