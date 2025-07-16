import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { CREDIT_PACKAGES, formatPrice, formatCredits, PRICE_PER_CREDIT, SAVINGS_PERCENTAGE } from '../../config/pricing';

// FAQ data
const faqs = [
  {
    question: 'How do credits work?',
    answer:
      'Credits are used when you generate code from screenshots, videos, or text. Different features consume different amounts of credits based on complexity. For example, text-to-code uses 1 credit, image-to-code uses 2 credits, and video-to-code uses 5 credits.'
  },
  {
    question: 'Do credits expire?',
    answer:
      'No, credits never expire. Once purchased, they remain in your account until used.'
  },
  {
    question: 'Can I upgrade my plan later?',
    answer:
      'Credits are purchased as one-time packages, not subscriptions. You can buy additional credit packages anytime you need more.'
  },
  {
    question: 'What happens when I run out of credits?',
    answer:
      'When your credits reach zero, you won\'t be able to generate new code until you purchase more. Your existing projects and code remain accessible.'
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards through Stripe. Enterprise customers can request invoicing with net-30 terms.'
  },
  {
    question: 'Can I get a refund?',
    answer:
      'We offer a 7-day money-back guarantee if you\'re not satisfied. Unused credits can be refunded within this period.'
  }
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showingAll, setShowingAll] = useState(false);

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/pricing' } });
      return;
    }

    // TODO: Implement Stripe checkout
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
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 ring-1 ${
                pkg.recommended
                  ? 'bg-gray-900 ring-gray-900 dark:bg-white dark:ring-white'
                  : 'ring-gray-200 dark:ring-gray-700'
              }`}
            >
              {pkg.recommended && (
                <p className={`text-sm font-semibold leading-6 ${
                  pkg.recommended ? 'text-white dark:text-gray-900' : ''
                }`}>
                  Most popular
                </p>
              )}
              <h3 className={`mt-4 text-lg font-semibold leading-8 ${
                pkg.recommended 
                  ? 'text-white dark:text-gray-900' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {pkg.name}
              </h3>
              <p className={`mt-4 text-sm leading-6 ${
                pkg.recommended 
                  ? 'text-gray-300 dark:text-gray-600' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {pkg.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${
                  pkg.recommended 
                    ? 'text-white dark:text-gray-900' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {formatPrice(pkg.price)}
                </span>
              </p>
              <p className={`mt-1 text-sm ${
                pkg.recommended 
                  ? 'text-gray-300 dark:text-gray-600' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {formatCredits(pkg.credits)} credits • {formatPrice(pkg.price / pkg.credits)} per credit
              </p>
              <ul className={`mt-8 space-y-3 text-sm leading-6 ${
                pkg.recommended 
                  ? 'text-gray-300 dark:text-gray-600' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${
                        pkg.recommended 
                          ? 'text-white dark:text-gray-900' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
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
              <button
                onClick={() => handlePurchase(pkg.id)}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  pkg.recommended
                    ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:outline-gray-900'
                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400'
                }`}
              >
                Buy now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {SAVINGS_PERCENTAGE}% Cost Savings
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Traditional development costs ${TRADITIONAL_DEVELOPMENT_COST_PER_COMPONENT} per component. 
            With Pix 2 Code, it's just {formatPrice(PRICE_PER_CREDIT)}.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-100/10">
            {faqs.map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-500">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start building?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Start with 2 free credits and see the magic happen.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={user ? "/app" : "/signup"}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <button
                onClick={handleContactSales}
                className="text-sm font-semibold leading-6 text-white hover:text-blue-100"
              >
                Contact sales <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;