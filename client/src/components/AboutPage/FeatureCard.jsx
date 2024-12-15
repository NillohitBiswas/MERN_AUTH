export default function FeatureCard({ feature }) {
  const Icon = feature.icon;
  
  return (
    <div className="p-6 bg-black/75 rounded-lg border border-slate-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-items-center mb-4 text-white font-mono">
        <Icon className="w-6 h-6 ml-12" />
        <h3 className="text-xl items-center font-semibold ml-2">{feature.title}</h3>
      </div>
      <p className="text-slate-300 font-mono text-center">{feature.description}</p>
    </div>
  );
}