import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4  ">
      <div className="px-2 mb-3 rounded-2xl border-2 border-slate-400 shadow-[4px_4px_15px_rgba(0,0,0,0.25)]  bg-white/15 backdrop-blur-lg  ">
         <h1 className="text-8xl font-authappfont text-black font-thin -mb-1 mt-8 ">
            Welcome to Audiq
         </h1>
         <p className="text-xl text-black font-mono  mt-3 mb-8">
            Discover, share, and enjoy your favorite music tracks. Join our community of music lovers.
         </p>
       </div>
      <button  
       onClick={() => navigate('/Tracks')}
       className="bg-lime-600 mt-2 text-xl text-black/60 font-bold font-mono border-2 border-lime-800  transition-[800ms] shadow-lg hover:shadow-lime-300 hover:text-black active:transition-[800ms] py-3 px-8 rounded-full">
        Explore Tracks
      </button>
    </div>
  );
}