import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="ml-3 text-blue-600 font-semibold">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
