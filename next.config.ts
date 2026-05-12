import type { NextConfig } from "next";

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // /advisors/** → backend:3001/advisors/**
        source: '/advisors/:path*',
        destination: `${API_BASE_URL}/advisors/:path*`,
      },
      {
        // /statistics/** → backend:3001/statistics/**
        source: '/statistics/:path*',
        destination: `${API_BASE_URL}/statistics/:path*`,
      },
    ];
  },
};

export default nextConfig;
