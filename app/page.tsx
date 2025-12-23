import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Blogs from '@/components/Blogs';
import projectsData from '@/data/projects.json';
import blogsData from '@/data/blogs.json';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects projects={projectsData} />
      <TechStack />
      <Blogs posts={blogsData} />
    </>
  );
}
