export default function TechCard({ tech }) {
    const Icon = tech.icon;
    
    return (
      <div className="bg-gradient-to-r from-zinc-300 to-slate-100-100 bg-white/30 backdrop-blur-sm p-6 rounded-[0px_20px_0px_20px] border-2 border-[#333332] shadow-[4px_4px_15px_rgba(0,0,0,0.25)]">
        <div className="flex items-center mb-4 ml-2">
          <Icon className="w-7 h-7 " />
          <h3 className="text-xl font-mono font-semibold ml-5">{tech.name}</h3>
        </div>
        <ul className="space-y-2">
          {tech.items.map((item) => (
            <li key={item} className="text-black font-mono ml-3">{item}</li>
          ))}
        </ul>
      </div>
    );
  }