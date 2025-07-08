// /root/screenshot-to-code/frontend/src/components/marketing/AboutPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  // Team members data
  const team = [
    {
      name: 'Abi Sachdev',
      role: 'Founder & CEO',
      imageUrl: '/team/abi.jpg',
      bio: 'Abi has worked at leading AI companies and has a passion for democratizing design-to-code tools.',
    },
    {
      name: 'Sam Johnson',
      role: 'CTO',
      imageUrl: '/team/sam.jpg',
      bio: 'Sam previously built AI-powered tools at Google and brings deep technical expertise to the team.',
    },
    {
      name: 'Maya Patel',
      role: 'Head of Engineering',
      imageUrl: '/team/maya.jpg',
      bio: 'Maya leads our engineering team with a focus on creating reliable, high-performance tools.',
    },
    {
      name: 'David Chen',
      role: 'Lead AI Engineer',
      imageUrl: '/team/david.jpg',
      bio: 'David specializes in computer vision and has helped build our core image recognition technology.',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="/images/about-header.jpg"
          alt="About Pix 2 Code"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-20"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About Pix 2 Code</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our mission is to revolutionize the way developers translate designs into code, saving countless hours and enabling more focus on creating exceptional user experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our story section */}
      <div className="overflow-hidden bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Our Story</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">From Idea to Innovation</p>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Pix 2 Code began in 2023 when our founder, frustrated with the tedious process of converting designs to code, saw an opportunity to leverage recent advances in AI.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
                      </svg>
                      The Problem:
                    </dt>{' '}
                    Developers spend countless hours recreating designs in code, with multiple feedback loops and iterations.
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                      The Insight:
                    </dt>{' '}
                    Advances in computer vision and large language models could potentially automate this process with high accuracy.
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
                      </svg>
                      The Solution:
                    </dt>{' '}
                    Pix 2 Code was born - a tool that takes any screenshot or mockup and converts it to clean, production-ready code in seconds.
                  </div>
                </dl>
              </div>
            </div>
            <img
              src="/images/about-story.jpg"
              alt="Product screenshot"
              className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We're a group of passionate engineers and designers who believe in making the web development process more efficient and accessible.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          >
            {team.map((person) => (
              <li key={person.name}>
                <img className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">{person.name}</h3>
                <p className="text-base leading-7 text-blue-600">{person.role}</p>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">{person.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              These core principles guide everything we do at Pix 2 Code.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 dark:text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Efficiency
              </dt>
              <dd className="inline"> We value your time and strive to create tools that maximize productivity.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Quality
              </dt>
              <dd className="inline"> We're committed to delivering accurate, clean code that meets professional standards.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Innovation
              </dt>
              <dd className="inline"> We continuously explore new technologies to improve our tools and stay ahead of industry needs.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900 dark:text-white">
                <svg className="absolute left-1 top-1 h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Accessibility
              </dt>
              <dd className="inline"> We believe powerful development tools should be accessible to everyone, regardless of coding expertise.</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join us in transforming web development
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Experience the future of design-to-code conversion today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/app"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link to="/contact" className="text-sm font-semibold leading-6 text-white">
                Contact us <span aria-hidden="true">→</span>
              </Link>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;