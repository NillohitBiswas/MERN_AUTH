import React from 'react';


export default function BackgroundLayout({ image, children }) {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Background"
          className="w-full h-full object-cover bg-center opacity-90"
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
