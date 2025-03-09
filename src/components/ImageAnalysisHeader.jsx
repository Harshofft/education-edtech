// ImageAnalysisHeader.jsx
import React from 'react';

const ImageAnalysisHeader = () => {
  return (
    <div className="flex flex-wrap justify-center text-align gap-3 p-4">
      <h1 className="text-[#1C160C] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Image Analysis
      </h1>
      {/* Add any additional header elements here, like buttons or filters */}
    </div>
  );
};

export default ImageAnalysisHeader;