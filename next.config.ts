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

export default nextConfig;
