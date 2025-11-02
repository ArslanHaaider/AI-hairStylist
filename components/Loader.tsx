
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative h-16 w-16">
            <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-purple-500/20 border-l-purple-500/20 animate-spin"></div>
            <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-pink-500 border-r-pink-500/20 border-b-pink-500/20 border-l-pink-500/20 animate-spin [animation-delay:-0.2s]"></div>
        </div>
      <h3 className="mt-6 text-lg font-medium text-gray-300">Styling in progress...</h3>
      <p className="mt-1 text-sm text-gray-500">The AI is working its magic. This can take a moment.</p>
    </div>
  );
};
