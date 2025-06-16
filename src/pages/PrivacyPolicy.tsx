import React from 'react';
import Navbar from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen py-24">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Baoswheels. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Identity Data: includes first name, last name, username or similar identifier.</li>
              <li>Contact Data: includes billing address, delivery address, email address and telephone numbers.</li>
              <li>Technical Data: includes internet protocol (IP) address, your login data, browser type and version.</li>
              <li>Usage Data: includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
              <li>To recommend products or services which may be of interest to you.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Cookies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you 
              with a good experience when you browse our website and also allows us to improve our site. By continuing to 
              browse the site, you are agreeing to our use of cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
              to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Legal Rights</h2>
            <p className="text-gray-700 mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are under 13, please do not provide any information on this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Changes to Our Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update our privacy policy from time to time. We will notify you of any changes by posting the 
              new privacy policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
