// /frontend/src/components/marketing/PrivacyPolicyPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Information We Collect</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li>Email address</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Usage data and analytics</li>
              <li>Images you upload for code generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. How We Use Your Information</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Data Security</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Data Retention</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We retain your information for as long as your account is active or as needed to provide
              you services. Uploaded images are automatically deleted after processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Your Rights</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct or update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Object to or restrict certain processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Third-Party Services</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li><strong>Stripe</strong> - For payment processing</li>
              <li><strong>Supabase</strong> - For authentication and data storage</li>
              <li><strong>OpenAI/Anthropic</strong> - For AI code generation</li>
            </ul>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              These services have their own privacy policies and data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Contact Us</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Email: privacy@pix2code.com<br />
              Or use our <Link to="/contact" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">contact form</Link>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By using Pix2Code, you agree to this Privacy Policy. We may update this policy from time to time, 
            and will notify you of any significant changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;