// Fixed version of /root/screenshot-to-code/frontend/src/components/marketing/PricingPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Credit packages data
const CREDIT_PACKAGES = [
  {
    id: 'small',
    name: 'Basic',
    credits: 100,
    price: 9.99,
    description: 'Perfect for small projects and personal use',
    features: [
      'Generate up to 100 components or pages',
      'HTML/CSS code generation',
      'Tailwind CSS support',
      'Export to code repositories',
      'Basic email support',
    ],
    recommended: false,
  },
  {
    id: 'medium',
    name: 'Standard',
    credits: 500,
    price: 39.99,
    description: 'Ideal for freelancers and growing businesses',
    features: [
      'Generate up to 500 components or pages',
      'React component generation',
      'Priority email support',
      'Access to latest AI models',
      'API for automation',
    ],
    recommended: true,
  },
  {
    id: 'large',
    name: 'Pro',
    credits: 2000,
    price: 99.99,
    description: 'Best value for agencies and professional teams',
    features: [
      'Generate up to 2000 components or pages',
      'Custom framework support',
      'Priority support with 24-hour response',
      'Team collaboration features',
      'Advanced customization options',
    ],
    recommended: false,
  },
  {
    id: 'custom',
    name: 'Enterprise',
    credits: 'Custom',
    price: 'Custom',
    description: 'Tailored solutions for larger organizations',
    features: [
      'Custom credit allocation',
      'Dedicated account manager',
      'Custom integration support',
      'Advanced security features',
      'Custom reporting and analytics',
    ],
    recommended: false,
    isCustom: true,
  },
];

// FAQ items
const FAQS = [
  {
    question: 'What are credits?',
    answer:
      'Credits are the currency used in Pix 2 Code to generate code from your designs. One credit typically allows you to generate one component or page. More complex designs may require additional credits.'
  },
  {
    question: 'Do credits expire?',
    answer:
      'No, your purchased credits never expire. You can use them at your own pace without worrying about time limitations.'
  },
  {
    question: 'What happens when I run out of credits?',
    answer:
      'When you run out of credits, you can purchase more at any time. Your account will remain active, and all your previous generations will still be accessible.'
  },
  {
    question: 'Can I try before I buy?',
    answer:
      'Yes, new users receive 10 free credits upon registration to test our service. This allows you to experience the quality of our code generation before making a purchase.'
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards and PayPal. For Enterprise customers, we also support invoicing with net-30 terms.'
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer:
      'We offer a 7-day money-back guarantee if you\'re not satisfied with our service. Contact our support team to request a refund.'
  }
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showingAll, setShowingAll] = useState(false);

  // Handle purchase button click
  const handlePurchase = async (packageId: string) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/login', { state: { returnTo: '/pricing' } });
      return;
    }

    // In a real app with Supabase, you'd create a checkout session
    // const { data, error } = await supabase.functions.invoke('create-checkout', {
    //   body: { packageId, userId: user?.id },
    // });
    
    // if (error) {
    //   console.error('Error creating checkout session:', error);
    //   return;
    // }
    
    // window.location.href = data.url;
    
    // For our mock version, just show an alert
    alert(`In a real app, you would be redirected to Stripe to purchase the ${packageId} credit package`);
  };

  const handleContactSales = () => {
    navigate('/contact', { state: { subject: 'enterprise' } });
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Pay only for what you use with our credit-based system. No subscriptions, no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Credit packages */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10 ${
                pkg.recommended ? 'lg:z-10 lg:shadow-2xl' : ''
              }`}
            >
              <div>
                {pkg.recommended && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-semibold text-blue-800 dark:text-blue-200">
                      Best Value
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {pkg.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {pkg.description}
                </p>
                <div className="mt-6">
                  <div className="flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {typeof pkg.price === 'number' ? `$${pkg.price.toFixed(2)}` : pkg.price}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {typeof pkg.credits === 'number' ? `${pkg.credits} credits` : pkg.credits}
                  </p>
                </div>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                {pkg.isCustom ? (
                  <button
                    onClick={handleContactSales}
                    className="mt-8 block w-full rounded-md bg-blue-50 dark:bg-blue-900 py-2.5 px-3.5 text-center text-sm font-semibold text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Contact Sales
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    className={`${
                      pkg.recommended
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                        : 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                    } mt-8 block w-full rounded-md py-2.5 px-3.5 text-center text-sm font-semibold`}
                  >
                    Buy Credits
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value calculation */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-xl sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              How much value do credits provide?
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
              Our credit system is designed to give you maximum value. Here's how our credits compare to traditional development costs:
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400">
                What's included
              </h4>
              <div className="h-px flex-auto bg-gray-100 dark:bg-gray-700"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:grid-cols-2 sm:gap-6">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Time saved: 1-2 hours of development time per credit
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Production-ready code generation
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Responsive designs that work on all devices
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Framework choices: HTML, React, Vue, and more
              </li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 py-10 text-center ring-1 ring-inset ring-gray-900/5 dark:ring-gray-100/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                  Traditional development cost
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">$100</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-gray-300">per component</span>
                </p>
                <p className="mt-6 text-xs leading-5 text-gray-600 dark:text-gray-400">
                  Based on average developer rates of $50/hour and 2 hours per component
                </p>
                <p className="mt-6 text-base font-semibold text-gray-600 dark:text-gray-300">
                  Pix 2 Code cost
                </p>
                <p className="mt-2 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">$0.10</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-gray-300">per component</span>
                </p>
                <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                  Based on our Standard package ($39.99 for 500 credits)
                </p>
                <p className="mt-6 text-lg font-bold text-green-600 dark:text-green-400">
                  Save over 99%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-100/10">
            {showingAll
              ? FAQS.map((faq) => (
                  <div key={faq.question} className="pt-6">
                    <dt>
                      <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </dd>
                  </div>
                ))
              : FAQS.slice(0, 3).map((faq) => (
                  <div key={faq.question} className="pt-6">
                    <dt>
                      <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
            
            {!showingAll && (
              <div className="pt-6 text-center">
                <button
                  onClick={() => setShowingAll(true)}
                  className="text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Show more questions <span aria-hidden="true">↓</span>
                </button>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600 dark:text-blue-400">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Developers love our credits
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
              <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900 dark:text-white">
                    <p>"Pix 2 Code has revolutionized my workflow. I used to spend hours coding up designs, but now I can generate them in seconds. The credit system is straightforward and provides incredible value."</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</div>
                      <div className="text-gray-600 dark:text-gray-400">Frontend Developer</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
              <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900 dark:text-white">
                    <p>"I purchased the Standard credit package and it's been a game-changer for my small agency. We're able to deliver projects faster and take on more clients. The ROI is incredible."</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Michael Chen</div>
                      <div className="text-gray-600 dark:text-gray-400">Agency Owner</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
              <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900 dark:text-white">
                    <p>"As a freelancer, I appreciate the flexibility of the credit system. I can purchase credits when I need them and they never expire. It's perfect for my irregular project schedule."</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Emma Rodriguez</div>
                      <div className="text-gray-600 dark:text-gray-400">Freelance Developer</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start building faster?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Sign up today and get 10 free credits to try Pix 2 Code.
              No credit card required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={user ? '/app' : '/signup'}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {user ? 'Go to app' : 'Get free credits'}
              </Link>
              <Link
                to="/gallery"
                className="text-sm font-semibold leading-6 text-white"
              >
                See examples <span aria-hidden="true">→</span>
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

export default PricingPage;