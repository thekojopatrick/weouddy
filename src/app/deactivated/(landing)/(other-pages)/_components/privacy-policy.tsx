"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections = [
  {
    id: "personal-information",
    title: "Personal Information We Collect",
    content:
      "We only collect Personal Information that you knowingly provide when signing up, purchasing products or services, or interacting with our platform. This may include your name, email address, profile details, and event-related interactions.",
  },
  {
    id: "non-personal-information",
    title: "Non-Personal Information We Collect",
    content:
      "When you visit our platform, we automatically collect certain non-personal data, such as your IP address, browser type, device information, operating system, language preferences, pages visited, time spent on those pages, and engagement metrics to improve user experience and platform security.",
  },
  {
    id: "user-content",
    title: "User-Generated Content & Public Information",
    content:
      "When you post content (photos, videos, comments) on our platform, it may be publicly visible to other users. By posting, you grant us a non-exclusive, royalty-free, worldwide license to store, display, and use this content to operate our services. You remain the owner of your content, and you may delete it at any time unless required for legal compliance or security purposes.",
  },
  {
    id: "purchases",
    title: "Purchases",
    content:
      "All transactions made on our platform are processed through a third-party payment provider, Paddle (paddle.com). Paddle may collect personal and non-personal information such as your name, address, email, and payment details. Paddle operates under its own Privacy Policy (paddle.com/legal-buyers/), and we do not control their data collection practices. Please contact Paddle for any concerns regarding payment processing.",
  },
  {
    id: "newsletter",
    title: "Newsletter Subscriptions",
    content:
      "If you sign up for our newsletter, either through a form or during the sign-up process, this is managed by Resend (resend.com). Resend handles your information under its Privacy Policy (Resend/privacy). For questions about Resend, contact them directly.",
  },
  {
    id: "cookies-tracking",
    title: "Cookies & Tracking Technologies",
    content:
      "We use cookies and similar tracking technologies to analyze user activity, enhance platform functionality, and provide a personalized experience. By using our platform, you consent to our use of cookies. You can manage your cookie preferences in your browser settings.",
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content:
      "We retain your personal information for as long as necessary to provide our services or as required by law. If you request deletion of your account, we will remove your data unless retention is necessary for legal or security reasons.",
  },
  {
    id: "third-party-services",
    title: "Third-Party Services & Integrations",
    content:
      "We may share data with trusted service providers (e.g., analytics tools, hosting providers, AI moderation services) to improve platform performance and user experience. These third parties are required to follow strict data protection laws. We do not sell your data to third parties.",
  },
  {
    id: "age-restrictions",
    title: "Age Restrictions",
    content:
      "Our platform is not intended for users under 13 (or the legal age in your country). If we discover that we have collected data from a minor without parental consent, we will delete it immediately.",
  },
  {
    id: "managing",
    title: "Managing Personal Information",
    content:
      "You may request the deletion of your personal information by contacting us. However, deleting certain data may prevent you from accessing features, purchases, or subscriptions on our platform.",
  },
  {
    id: "rights",
    title: "Your Rights",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Withdraw consent for processing your data</li>
        <li>Access and obtain a copy of your personal data</li>
        <li>Update or correct inaccuracies in your data</li>
        <li>Restrict data processing under certain conditions</li>
        <li>Request the deletion of your data</li>
        <li>Receive your data in a structured, machine-readable format</li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <p>
        For questions about this Policy, please email us at{" "}
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

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={`fixed bottom-8 right-8 rounded-full transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
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
    <h2 className="text-2xl font-semibold mb-6 text-gray-900">{title}</h2>
    <div className="text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Privacy Policy
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
                This Privacy Policy (&quot;Policy&quot;) outlines how WeOuddy
                (&quot;WeOuddy&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;) collects, protects, and uses your personal
                information (&quot;Personal Information&quot;) when you
                (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;)
                interact with our website (weoudy.com) or purchase any products
                or services (collectively referred to as the
                &quot;Website&quot;). It also explains your rights regarding
                your Personal Information and how you can manage or update it.
                This Policy does not apply to third-party companies or
                individuals we do not control or employ.
              </p>

              {/* Sections */}
              {sections.map((section) => (
                <Section key={section.id} id={section.id} title={section.title}>
                  {section.content}
                </Section>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>© {new Date().getFullYear()} WeOuddy. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPolicyPage;
