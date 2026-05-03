import React from 'react';

export const PageSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-pulse mt-8">
      <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-10"></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-2xl w-full"></div>
        ))}
      </div>
    </div>
  );
};
