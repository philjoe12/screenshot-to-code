// /root/screenshot-to-code/frontend/src/components/marketing/BlogPostPage.tsx

import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: {
    name: string;
    role: string;
    imageUrl: string;
    bio: string;
  };
  category: string;
  imageUrl: string;
  content: React.ReactNode;
  relatedPosts: string[];
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Blog posts data - in a real app, you'd fetch this from an API
  const blogPosts: Record<string, BlogPost> = {
    'how-ai-transforms-frontend-development': {
      id: '1',
      title: 'How AI is Transforming Frontend Development',
      slug: 'how-ai-transforms-frontend-development',
      date: 'March 15, 2025',
      author: {
        name: 'Alex Johnson',
        role: 'Lead Developer',
        imageUrl: '/blog/authors/alex.jpg',
        bio: 'Alex has been developing frontend applications for over 10 years and has been exploring AI-assisted development tools since their inception.',
      },
      category: 'Technology',
      imageUrl: '/blog/ai-frontend.jpg',
      content: (
        <>
          <p className="text-lg">
            The landscape of frontend development is changing rapidly with the introduction of AI-powered tools. 
            What used to take hours or days can now be accomplished in minutes, and the quality of the output 
            continues to improve as these technologies evolve.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">The Traditional Frontend Development Process</h2>
          <p>
            Traditionally, frontend development has followed a predictable workflow:
          </p>
          <ol className="list-decimal pl-6 my-4 space-y-2">
            <li>Designers create mockups or prototypes</li>
            <li>Developers analyze the designs and plan the implementation</li>
            <li>HTML structure is created based on the design</li>
            <li>CSS styles are applied to match the visual design</li>
            <li>JavaScript is added for interactivity</li>
            <li>Responsive adaptations are made for different screen sizes</li>
            <li>Multiple rounds of review and refinement occur</li>
          </ol>
          <p>
            This process is time-consuming, requires specialized skills, and often involves a lot of back-and-forth 
            between designers and developers to ensure the final product matches the original vision.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Enter AI-Powered Code Generation</h2>
          <p>
            AI-powered tools like Pix 2 Code are fundamentally changing this workflow. By leveraging advanced 
            computer vision and large language models, these tools can:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Analyze a screenshot, mockup, or design file</li>
            <li>Understand the visual structure, components, and design elements</li>
            <li>Generate semantic HTML that follows accessibility best practices</li>
            <li>Apply CSS or utilize frameworks like Tailwind or Bootstrap</li>
            <li>Create responsive layouts automatically</li>
            <li>Add appropriate JavaScript for interactive elements</li>
            <li>Produce code that's ready for production or further refinement</li>
          </ul>
          
          <div className="my-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              "AI tools don't replace developers—they empower them to work at a higher level of abstraction, 
              focusing on user experience, business logic, and creative solutions rather than repetitive implementation tasks."
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Benefits for Different Stakeholders</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">For Developers</h3>
          <p>
            Developers can focus on more complex and interesting problems, using AI-generated code as a starting point 
            rather than building everything from scratch. This increases productivity and job satisfaction, as less time 
            is spent on repetitive tasks.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">For Designers</h3>
          <p>
            Designers can get immediate feedback on their designs by seeing them implemented in code. This tightens 
            the feedback loop and allows for more iterations in less time. Designers are also empowered to explore 
            code implementation themselves without needing to learn all the technical details.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">For Project Managers</h3>
          <p>
            Project timelines can be significantly reduced, allowing for faster time-to-market. Resources can be 
            allocated more efficiently, and the risk of delays due to implementation challenges is reduced.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">For Businesses</h3>
          <p>
            Reduced development costs and shorter project timelines translate to better ROI. The ability to 
            iterate quickly allows businesses to be more responsive to market feedback and changing requirements.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Challenges and Considerations</h2>
          <p>
            While AI code generation offers tremendous benefits, there are some challenges to consider:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>
              <strong>Quality control:</strong> Generated code should always be reviewed for quality, performance, 
              and security concerns before deployment
            </li>
            <li>
              <strong>Customization needs:</strong> Some unique or complex design elements may still require manual 
              adjustment after the initial generation
            </li>
            <li>
              <strong>Accessibility:</strong> While tools are improving in this area, ensuring full accessibility 
              compliance may require additional expertise
            </li>
            <li>
              <strong>Developer skill evolution:</strong> As basic implementation becomes automated, developers need 
              to evolve their skills toward areas where human creativity and problem-solving still outperform AI
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">The Future of Frontend Development</h2>
          <p>
            As AI tools continue to improve, we can expect even more powerful capabilities:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>More sophisticated understanding of design intentions and patterns</li>
            <li>Better handling of complex interactions and animations</li>
            <li>Optimization for performance, accessibility, and SEO built into the generation process</li>
            <li>Integration with component libraries and design systems</li>
            <li>Ability to generate cross-platform code for web, mobile, and other interfaces</li>
          </ul>
          
          <p>
            Frontend development is unlikely to be completely automated anytime soon, but the role of frontend 
            developers will evolve. They'll spend less time on implementation details and more time on architecture, 
            user experience, performance optimization, and integrating with backend systems.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
          <p>
            AI-powered code generation is transforming frontend development in ways that benefit everyone involved 
            in the process. By embracing these tools, teams can work more efficiently, iterate more quickly, and 
            focus their human creativity and problem-solving abilities where they matter most.
          </p>
          <p className="mt-4">
            As with any technological shift, those who adapt and learn to leverage these new capabilities will 
            have a significant advantage in the evolving landscape of web development.
          </p>
        </>
      ),
      relatedPosts: ['evolution-of-design-to-code-tools', 'best-practices-for-ai-code-generation'],
    },
    
    // Additional blog posts would be defined here
    'evolution-of-design-to-code-tools': {
      id: '2',
      title: 'The Evolution of Design-to-Code Tools',
      slug: 'evolution-of-design-to-code-tools',
      date: 'February 28, 2025',
      author: {
        name: 'Sophia Chen',
        role: 'UX Researcher',
        imageUrl: '/blog/authors/sophia.jpg',
        bio: 'Sophia specializes in researching tools and workflows that bridge the gap between design and development.',
      },
      category: 'Design',
      imageUrl: '/blog/design-to-code.jpg',
      content: (
        <>
          <p className="text-lg">
            The journey from design to code has been a long-standing challenge in web development. 
            This article explores how design-to-code tools have evolved over the years.
          </p>
          
          <p>
            [Full article content would go here]
          </p>
        </>
      ),
      relatedPosts: ['how-ai-transforms-frontend-development', 'figma-to-production-workflow'],
    },
    
    'best-practices-for-ai-code-generation': {
      id: '3',
      title: 'Best Practices for Working with AI Code Generation',
      slug: 'best-practices-for-ai-code-generation',
      date: 'February 14, 2025',
      author: {
        name: 'Marcus Williams',
        role: 'Senior Frontend Engineer',
        imageUrl: '/blog/authors/marcus.jpg',
        bio: 'Marcus has been integrating AI tools into development workflows at scale for enterprise clients.',
      },
      category: 'Tutorials',
      imageUrl: '/blog/ai-code-best-practices.jpg',
      content: (
        <>
          <p className="text-lg">
            AI code generation tools are powerful, but getting the most out of them requires some strategic approaches.
            This guide covers the best practices for working with tools like Pix 2 Code.
          </p>
          
          <p>
            [Full article content would go here]
          </p>
        </>
      ),
      relatedPosts: ['how-ai-transforms-frontend-development', 'ai-impact-on-developer-productivity'],
    },
  };

  // Get current post
  const post = slug ? blogPosts[slug] : null;
  
  // Get related posts
  const relatedPostsData = post 
    ? post.relatedPosts.map(relatedSlug => blogPosts[relatedSlug])
    : [];

  // If post not found
  if (!post) {
    return (
      <div className="bg-white dark:bg-gray-900 px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Blog Post Not Found
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-10">
            <Link
              to="/blog"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Article header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 dark:from-blue-900/20">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <Link to="/blog" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 dark:bg-blue-500/20 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10 dark:ring-blue-400/30">
                  {post.category}
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">
                  <span>{post.date}</span>
                </span>
              </Link>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {post.title}
            </h1>
            <div className="mt-10 flex items-center gap-x-4">
              <img
                src={post.author.imageUrl}
                alt={post.author.name}
                className="h-12 w-12 rounded-full bg-gray-50"
              />
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">{post.author.name}</div>
                <div className="text-sm leading-6 text-gray-600 dark:text-gray-300">{post.author.role}</div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mt-16 prose prose-lg prose-blue dark:prose-invert">
            {post.content}
          </div>
          
          {/* Author bio */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
            <div className="flex items-center gap-x-6">
              <img src={post.author.imageUrl} alt="" className="h-16 w-16 rounded-full bg-gray-50" />
              <div>
                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white">{post.author.name}</h3>
                <p className="text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400">{post.author.role}</p>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{post.author.bio}</p>
              </div>
            </div>
          </div>
          
          {/* Related posts */}
          {relatedPostsData.length > 0 && (
            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Related Posts</h2>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
                {relatedPostsData.map((relatedPost) => (
                  <div key={relatedPost.id} className="group relative">
                    <div className="aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <span className="absolute inset-0" />
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{relatedPost.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Call to action */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl px-6 py-10 sm:py-12 sm:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Ready to try Pix 2 Code?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Start turning your designs into code in seconds, not hours.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to="/app"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Get started
                  </Link>
                  <Link to="/gallery" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    View examples <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;