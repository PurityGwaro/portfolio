// components/TechStack.tsx
import { Code, Database, Cloud, Wrench } from 'lucide-react';
import techStackData from '@/data/techstack.json';

interface Tech {
  name: string;
  category: string;
}

// Define a proper type for the icon mapping
type IconType = React.ComponentType<{ className: string }>;
const categoryIcons: Record<string, IconType> = {
  'Core Stack': Code,
  'Databases & ORM': Database,
  'Infrastructure & DevOps': Cloud,
  'Developer Tools': Wrench,
};

export default function TechStack() {
  // Group technologies by category
  const groupedTech = techStackData.reduce((acc, tech: Tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <section id="tech" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black">
          Tech Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {Object.entries(groupedTech).map(([category, items]) => {
          const Icon = categoryIcons[category] || Code;
          return (
            <div
              key={category}
              className="border-2 border-gray-300 p-6 sm:p-8 text-black"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-900 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900">
                  {category}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item) => (
                  <div
                    key={item}
                    className="border border-gray-300 px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-zinc-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}