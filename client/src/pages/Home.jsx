import React from 'react'

import homeimage from '../assets/homeimage.jpeg'
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
      <img
        src={homeimage}
        alt="Music Background"
        layout="fill"
        quality={100}
        className="w-full h-full object-cover opacity-100"
      />
      </div>
     
      <div className="relative z-10">
        <Hero />
        <FeaturedSection />
      </div>
    </div>
  );
}