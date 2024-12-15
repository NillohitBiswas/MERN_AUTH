import { features } from '../../data/aboutFeatures';
import FeatureCard from './FeatureCard';

export default function Features() {
  return (
    <section className="py-12 bg-gradient-to-br from-lime-500 to-lime-300-200 bg-white/15 backdrop-blur-sm ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}