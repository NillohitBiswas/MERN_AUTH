import { technologies } from '../../data/aboutTechnologies';
import TechCard from './TechCard';

export default function TechStack() {
  return (
    <section className="p-12 bg-black/65 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl text-white font-mono font-bold text-center mb-12">Technology Stack</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {technologies.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}