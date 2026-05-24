'use client';

import React from 'react';

interface ContractRowSkeletonProps {
  index?: number;
}

export function ContractRowSkeleton({ index = 0 }: ContractRowSkeletonProps) {
  return (
    <div
      className="animate-pulse flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-5 bg-white rounded-2xl border animate-fade-in"
      style={{
        borderColor: '#e2ebe2',
        animationDelay: `${index * 30}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Left Side: Info & Icon Placeholder */}
      <div className="md:col-span-5 flex items-center gap-3.5 min-w-0">
        <div className="h-12 w-12 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3.5 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Center: Progress / Status Placeholder */}
      <div className="md:col-span-4 w-full max-w-sm px-2 md:px-6">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Side: Amount & Button Placeholder */}
      <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4 shrink-0">
        <div className="text-right space-y-1">
          <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
          <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
