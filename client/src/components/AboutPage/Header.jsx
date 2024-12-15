import React from 'react';

export default function Header() {
  return (
    <div className=" bg-white backdrop-blur-lg py-16">
     <div className="text-center mb-2 max-w-6xl mx-auto px-4">
       <h1 className="text-7xl font-authappfont text-black mb-2">
         About Our Project
       </h1>
       <p className="text-xl text-black font-mono max-w-6xl mx-auto">
         A modern music streaming platform built with cutting-edge technologies,
         designed to provide the best experience for music lovers. 
       </p>
     </div>
    </div>
  );
}