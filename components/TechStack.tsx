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
  'Core Backend': Code,
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
    <section id="tech" className="mx-auto max-w-7xl px-8 py-24 bg-zinc-50 dark:bg-black">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
          Tech Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(groupedTech).map(([category, items]) => {
          const Icon = categoryIcons[category] || Code;
          return (
            <div
              key={category}
              className="border-2 border-zinc-900 dark:border-zinc-100 p-8 bg-white dark:bg-black"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {category}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                  <div
                    key={item}
                    className="border border-zinc-900 dark:border-zinc-100 px-4 py-3 text-center text-sm font-medium uppercase tracking-wider text-zinc-900 dark:text-zinc-100"
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