// /root/screenshot-to-code/frontend/src/components/marketing/GalleryPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  resultSrc: string;
  tags: string[];
  framework: string;
}

const GalleryPage: React.FC = () => {
  // Gallery items data
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'E-commerce Product Page',
      description: 'A modern product display page with image gallery and purchase options.',
      imageSrc: '/gallery/ecommerce-screenshot.jpg',
      resultSrc: '/gallery/ecommerce-result.jpg',
      tags: ['E-commerce', 'Product', 'Responsive'],
      framework: 'HTML + Tailwind CSS',
    },
    {
      id: '2',
      title: 'Dashboard Interface',
      description: 'A comprehensive analytics dashboard with charts and interactive elements.',
      imageSrc: '/gallery/dashboard-screenshot.jpg',
      resultSrc: '/gallery/dashboard-result.jpg',
      tags: ['Dashboard', 'Analytics', 'Charts'],
      framework: 'React',
    },
    {
      id: '3',
      title: 'Landing Page',
      description: 'A high-converting SaaS landing page with gradients and call-to-actions.',
      imageSrc: '/gallery/landing-screenshot.jpg',
      resultSrc: '/gallery/landing-result.jpg',
      tags: ['Landing', 'Marketing', 'Hero'],
      framework: 'HTML + CSS',
    },
    {
      id: '4',
      title: 'Blog Layout',
      description: 'A modern blog layout with featured articles and sidebar.',
      imageSrc: '/gallery/blog-screenshot.jpg',
      resultSrc: '/gallery/blog-result.jpg',
      tags: ['Blog', 'Content', 'Typography'],
      framework: 'React',
    },
    {
      id: '5',
      title: 'Mobile App UI',
      description: 'A mobile app interface with navigation and card components.',
      imageSrc: '/gallery/mobile-screenshot.jpg',
      resultSrc: '/gallery/mobile-result.jpg',
      tags: ['Mobile', 'App', 'UI/UX'],
      framework: 'HTML + Tailwind CSS',
    },
    {
      id: '6',
      title: 'Sign Up Form',
      description: 'A multi-step sign up form with validation and progress indicator.',
      imageSrc: '/gallery/signup-screenshot.jpg',
      resultSrc: '/gallery/signup-result.jpg',
      tags: ['Form', 'Validation', 'Authentication'],
      framework: 'React',
    },
  ];

  // Filter states
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<string | null>(null);

  // Extract all unique tags and frameworks for filtering
  const allTags = Array.from(new Set(galleryItems.flatMap(item => item.tags)));
  const allFrameworks = Array.from(new Set(galleryItems.map(item => item.framework)));

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => {
    const matchesTag = !activeTag || item.tags.includes(activeTag);
    const matchesFramework = !activeFramework || item.framework === activeFramework;
    return matchesTag && matchesFramework;
  });

  // Reset filters
  const resetFilters = () => {
    setActiveTag(null);
    setActiveFramework(null);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  // Handle framework selection
  const handleFrameworkSelect = (framework: string) => {
    setActiveFramework(activeFramework === framework ? null : framework);
  };

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Gallery</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Browse examples of designs converted to code using Pix 2 Code. Click on any example to see the before and after.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filter by tag:</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    activeTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filter by framework:</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {allFrameworks.map(framework => (
                <button
                  key={framework}
                  onClick={() => handleFrameworkSelect(framework)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    activeFramework === framework
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {framework}
                </button>
              ))}
            </div>
          </div>

          {(activeTag || activeFramework) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery grid */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative">
              <div
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 transition hover:opacity-75 dark:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Framework: <span className="text-blue-600 dark:text-blue-400">{item.framework}</span>
              </p>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try changing or clearing your filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="mt-2 text-gray-600 dark:text-gray-300">{selectedItem.description}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Original Screenshot</h3>
                  <img
                    src={selectedItem.imageSrc}
                    alt={`${selectedItem.title} screenshot`}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Generated Result ({selectedItem.framework})
                  </h3>
                  <img
                    src={selectedItem.resultSrc}
                    alt={`${selectedItem.title} result`}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/app"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Try with your own design
                  <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#3b82f6" />
                  <stop offset={1} stopColor="#1d4ed8" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build faster?
                <br />
                Try Pix 2 Code today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Transform your designs into code in seconds, not hours. Join thousands of developers saving time with Pix 2 Code.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  to="/app"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <Link to="/pricing" className="text-sm font-semibold leading-6 text-white">
                  View pricing <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="/images/app-screenshot.png"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;