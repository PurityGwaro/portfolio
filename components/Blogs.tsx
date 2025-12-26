import { ExternalLink } from 'lucide-react';

export interface BlogPost {
  title: string;
  description: string;
  url: string;
}

interface BlogsProps {
  posts: BlogPost[];
}

export default function Blogs({ posts }: BlogsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-zinc-900">
          Blog
        </h2>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-600 px-4">
          Thoughts and insights on software development.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <a
            key={post.title}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-gray-300 p-6 sm:p-8 hover:bg-zinc-100 transition-colors group min-h-[44px] flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 group-hover:opacity-70 transition-opacity">
              {post.title}
            </h3>
            <p className="text-sm text-zinc-600 mb-6 flex-1">
              {post.description}
            </p>
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-900">
              Read More
              <ExternalLink className="h-3 w-3" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
