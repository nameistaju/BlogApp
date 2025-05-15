import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Spinner;