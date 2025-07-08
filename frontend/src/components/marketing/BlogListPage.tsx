// /root/screenshot-to-code/frontend/src/components/marketing/BlogListPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  author: {
    name: string;
    role: string;
    imageUrl: string;
  };
  category: string;
  imageUrl: string;
  slug: string;
}

const BlogListPage: React.FC = () => {
  // Blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'How AI is Transforming Frontend Development',
      description: 'Explore how technologies like Pix 2 Code are changing the landscape of frontend development, making it faster and more accessible.',
      date: 'March 15, 2025',
      author: {
        name: 'Alex Johnson',
        role: 'Lead Developer',
        imageUrl: '/blog/authors/alex.jpg',
      },
      category: 'Technology',
      imageUrl: '/blog/ai-frontend.jpg',
      slug: 'how-ai-transforms-frontend-development',
    },
    {
      id: '2',
      title: 'The Evolution of Design-to-Code Tools',
      description: 'A look at how design-to-code tools have evolved over the years, from basic CSS generators to sophisticated AI-powered solutions.',
      date: 'February 28, 2025',
      author: {
        name: 'Sophia Chen',
        role: 'UX Researcher',
        imageUrl: '/blog/authors/sophia.jpg',
      },
      category: 'Design',
      imageUrl: '/blog/design-to-code.jpg',
      slug: 'evolution-of-design-to-code-tools',
    },
    {
      id: '3',
      title: 'Best Practices for Working with AI Code Generation',
      description: 'Tips and tricks for getting the most out of AI code generation tools like Pix 2 Code, including preparation and post-generation workflows.',
      date: 'February 14, 2025',
      author: {
        name: 'Marcus Williams',
        role: 'Senior Frontend Engineer',
        imageUrl: '/blog/authors/marcus.jpg',
      },
      category: 'Tutorials',
      imageUrl: '/blog/ai-code-best-practices.jpg',
      slug: 'best-practices-for-ai-code-generation',
    },
    {
      id: '4',
      title: 'From Figma to Production: A Complete Workflow',
      description: 'A step-by-step guide to taking designs from Figma to production-ready code using Pix 2 Code and other modern tools.',
      date: 'January 30, 2025',
      author: {
        name: 'Elena Rodriguez',
        role: 'Product Designer',
        imageUrl: '/blog/authors/elena.jpg',
      },
      category: 'Tutorials',
      imageUrl: '/blog/figma-to-production.jpg',
      slug: 'figma-to-production-workflow',
    },
    {
      id: '5',
      title: 'The Impact of AI on Developer Productivity',
      description: 'Research findings on how AI tools are affecting developer productivity, job satisfaction, and project timelines.',
      date: 'January 15, 2025',
      author: {
        name: 'David Kumar',
        role: 'Research Lead',
        imageUrl: '/blog/authors/david.jpg',
      },
      category: 'Research',
      imageUrl: '/blog/ai-productivity.jpg',
      slug: 'ai-impact-on-developer-productivity',
    },
    {
      id: '6',
      title: 'Accessibility Considerations with AI-Generated Code',
      description: 'How to ensure AI-generated code meets accessibility standards, with tips for testing and improving accessibility.',
      date: 'December 28, 2024',
      author: {
        name: 'Jasmine Taylor',
        role: 'Accessibility Specialist',
        imageUrl: '/blog/authors/jasmine.jpg',
      },
      category: 'Accessibility',
      imageUrl: '/blog/accessibility.jpg',
      slug: 'accessibility-with-ai-generated-code',
    },
  ];

  // Categories for filtering
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter posts by category
  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Blog</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Insights, tutorials, and updates from the Pix 2 Code team on AI, design, and frontend development.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="flex overflow-x-auto py-4 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium mr-2 ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium mr-2 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog list */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {filteredPosts.map((post) => (
              <article key={post.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-gray-100/10" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
                      {post.date}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {post.category}
                    </span>
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      <Link to={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">{post.description}</p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 dark:border-gray-100/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          <span className="absolute inset-0" />
                          {post.author.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">{post.author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Stay up to date</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Subscribe to our newsletter for the latest updates, articles, and resources.
            </p>
            <form className="mt-10 max-w-md mx-auto">
              <div className="flex gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;