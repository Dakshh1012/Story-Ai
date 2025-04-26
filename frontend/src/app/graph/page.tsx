"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Graph component with SSR disabled
const GraphNoSSR = dynamic(() => import('@/components/graph'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[80vh] bg-gray-900">
      <div className="text-cyan-300 text-xl font-medium">Loading graph visualization...</div>
    </div>
  )
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-black py-6">
      <h1 className="text-4xl font-bold mb-4 text-cyan-300">Ravenswood Manor Investigation</h1>
      <p className="text-gray-300 mb-6 max-w-2xl text-center">
        Interactive visualization of relationships between characters, locations, and evidence from the Ravenswood Manor murder case
      </p>
      <div className="w-full max-w-7xl rounded-lg overflow-hidden border border-cyan-800 shadow-lg shadow-cyan-900/20">
        <GraphNoSSR />
      </div>
      <div className="mt-4 text-gray-400 text-sm">
        <p>Tip: Drag nodes to rearrange. Click on nodes to focus.</p>
      </div>
    </div>
  );
}
