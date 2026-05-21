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
      {
        // /auth/** → backend:3001/auth/**
        source: '/auth/:path*',
        destination: `${API_BASE_URL}/auth/:path*`,
      },
      {
        // /users/** → backend:3001/users/**
        source: '/users/:path*',
        destination: `${API_BASE_URL}/users/:path*`,
      },
      {
        // /roles/** → backend:3001/roles/**
        source: '/roles/:path*',
        destination: `${API_BASE_URL}/roles/:path*`,
      },
      {
        // /permissions/** → backend:3001/permissions/**
        source: '/permissions/:path*',
        destination: `${API_BASE_URL}/permissions/:path*`,
      },
      {
        // /contracts/** → backend:3001/contracts/**
        source: '/contracts/:path*',
        destination: `${API_BASE_URL}/contracts/:path*`,
      },
      {
        // /affiliates/** → backend:3001/affiliates/**
        source: '/affiliates/:path*',
        destination: `${API_BASE_URL}/affiliates/:path*`,
      },
      {
        // /payments/** → backend:3001/payments/**
        source: '/payments/:path*',
        destination: `${API_BASE_URL}/payments/:path*`,
      },
      {
        // /persons/** → backend:3001/persons/**
        source: '/persons/:path*',
        destination: `${API_BASE_URL}/persons/:path*`,
      },
      {
        // /plans/** → backend:3001/plans/**
        source: '/plans/:path*',
        destination: `${API_BASE_URL}/plans/:path*`,
      },
    ];
  },
};

export default nextConfig;
