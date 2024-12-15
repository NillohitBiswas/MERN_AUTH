import React from 'react';

export default function FeaturedSection() {
  const features = [
    {
      title: "Discover Music",
      description: "Find new tracks from various genres",
      icon: "🎵"
    },
    {
      title: "Upload Music",
      description: "Let others listen to your tracks",
      icon: "📝"
    },
    {
      title: "Share & Connect",
      description: "Join the music community",
      icon: "🤝"
    }
  ];

  return (
    <div className="py-8 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-mono font-bold text-center mb-8">
          What's in here!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center bg-white/50 p-6 rounded-[0px_20px_0px_20px] border-2 border-zinc-950 shadow-[4px_4px_15px_rgba(0,0,0,0.25)]">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl  text-black font-mono font-semibold mb-2">{feature.title}</h3>
              <p className="text-black font-mono">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}