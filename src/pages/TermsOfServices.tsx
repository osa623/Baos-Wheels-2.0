import React from 'react';
import Navbar from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServices = () => {
  return (
    <div className="flex flex-col min-h-screen py-24">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Terms of Services</h1>
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Baoswheels. These Terms of Service govern your use of our website located at baoswheels.com (together or individually "Service") 
              operated by Baoswheels. Our Terms of Service outline the rules and regulations for the use of Baoswheels's website.
            </p>
            <p className="text-gray-700 mb-4">
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use Baoswheels 
              if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              Other than the content you own, under these Terms, Baoswheels and/or its licensors own all the intellectual property rights 
              and materials contained in this website. You are granted limited license only for purposes of viewing the material contained on this website.
            </p>
            <p className="text-gray-700 mb-4">
              You are specifically restricted from:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Publishing any website material in any other media</li>
              <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
              <li>Publicly performing and/or showing any website material</li>
              <li>Using this website in any way that is or may be damaging to this website</li>
              <li>Using this website in any way that impacts user access to this website</li>
              <li>Using this website contrary to applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Content</h2>
            <p className="text-gray-700 mb-4">
              In these Terms of Service, "Your Content" shall mean any audio, video text, images or other material you choose to display on this website. 
              By displaying Your Content, you grant Baoswheels a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, 
              translate and distribute it in any and all media.
            </p>
            <p className="text-gray-700 mb-4">
              Your Content must be your own and must not be invading any third-party's rights. Baoswheels reserves the right to remove any of Your Content 
              from this website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Warranties</h2>
            <p className="text-gray-700 mb-4">
              This website is provided "as is," with all faults, and Baoswheels express no representations or warranties, of any kind related to this website 
              or the materials contained on this website. Also, nothing contained on this website shall be interpreted as advising you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Baoswheels, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way 
              connected with your use of this website whether such liability is under contract. Baoswheels, including its officers, directors and employees 
              shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You hereby indemnify to the fullest extent Baoswheels from and against any and/or all liabilities, costs, demands, causes of action, 
              damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining 
              provisions herein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Variation of Terms</h2>
            <p className="text-gray-700 mb-4">
              Baoswheels is permitted to revise these Terms at any time as it sees fit, and by using this website you are expected to review these Terms on a regular basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Governing Law & Jurisdiction</h2>
            <p className="text-gray-700 mb-4">
              These Terms will be governed by and interpreted in accordance with the laws of the state/country of [Your Location], and you submit to the non-exclusive 
              jurisdiction of the state and federal courts located in [Your Location] for the resolution of any disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700">Email: terms@baoswheels.com</p>
              <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-700">Address: 123 Wheel Street, Automotive City, AC 12345</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfServices;
