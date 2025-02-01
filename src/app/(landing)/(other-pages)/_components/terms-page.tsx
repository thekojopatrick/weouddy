'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content:
      "By accessing or using WeOuddy's website and services (collectively, the 'Services'), you agree to these Terms of Service ('Terms'). If you do not agree with these Terms, please do not use our Services.",
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    content:
      "To use WeOuddy, you must be at least 13 years old (or the minimum legal age in your jurisdiction). If you're using our Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.",
  },
  {
    id: 'account',
    title: 'Account Responsibilities',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify WeOuddy of any unauthorized use of your account.',
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Do not post or share content that is illegal, harmful, or
          abusive
        </li>
        <li>
          Do not attempt to disrupt or compromise our Services
          security
        </li>
        <li>
          Do not impersonate others or spread misleading information
        </li>
        <li>
          Do not use our Services for unauthorized commercial purposes
        </li>
      </ul>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property Rights',
    content:
      'The Services and their original content, features, and functionality are owned by WeOuddy and are protected by international copyright, trademark, and other intellectual property laws. Users retain ownership of their content but grant WeOuddy a license to use, display, and distribute it within our Services.',
  },
  {
    id: 'termination',
    title: 'Termination',
    content:
      'WeOuddy reserves the right to terminate or suspend access to our Services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, WeOuddy, or third parties, or for any other reason at our sole discretion.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content:
      "WeOuddy provides the Services 'as is' without any warranty. We are not responsible for any indirect, incidental, special, or consequential damages arising from your use of our Services.",
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content:
      'WeOuddy may modify these Terms at any time. We will notify users of any material changes via email or through our Services. Your continued use of our Services following such modifications constitutes acceptance of the updated Terms.',
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: (
      <p>
        For questions about these Terms, please contact us at{' '}
        <a
          href="mailto:hello.weouddy@gmail.com"
          className="text-blue-600 hover:text-blue-800"
        >
          hello.weouddy@gmail.com
        </a>
      </p>
    ),
  },
];

const TableOfContents = ({ sections }: { sections: Section[] }) => (
  <nav className="mb-8 p-6 bg-gray-50 rounded-lg">
    <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
    <ul className="space-y-2">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () =>
      window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={`fixed bottom-8 right-8 rounded-full transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="mb-12 scroll-mt-16">
    <h2 className="text-2xl font-semibold mb-6 text-gray-900">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: 30/01/25</p>
        </div>

        {/* Table of Contents */}
        <TableOfContents sections={sections} />

        {/* Main Content */}
        <Card className="mb-8 shadow-xs">
          <CardContent className="p-8 sm:p-12">
            {/* Introduction */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-12 leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern your
                access to and use of WeOuddy&apos;s website and
                services. Please read these Terms carefully before
                using our Services. By using WeOuddy, you agree to be
                bound by these Terms and our Privacy Policy.
              </p>

              {/* Sections */}
              {sections.map((section) => (
                <Section
                  key={section.id}
                  id={section.id}
                  title={section.title}
                >
                  {section.content}
                </Section>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            © {new Date().getFullYear()} WeOuddy. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default TermsOfServicePage;
