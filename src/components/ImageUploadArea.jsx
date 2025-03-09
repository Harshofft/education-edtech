import React from 'react';

const ImageUploadArea = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#E9DFCE] px-6 py-14">
        <p className="text-[#1C160C] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
          Upload image
        </p>
        <label className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#F4EFE6] text-[#1C160C] text-sm font-bold leading-normal tracking-[0.015em]">
          <input type="file" accept="image/*" id="fileInput" className="hidden" />
          <span className="truncate">Select image</span>
        </label>
      </div>
    </div>
  );
};

export default ImageUploadArea;