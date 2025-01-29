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
      "We only collect Personal Information that you knowingly provide when purchasing products or services through our Website. This typically includes your email address, which is required to link your purchases to your identity.",
  },
  {
    id: "non-personal-information",
    title: "Non-Personal Information We Collect",
    content:
      "When you visit our Website, our servers automatically collect certain non-personal data, such as your IP address, browser type and version, operating system, language preferences, pages visited, time spent on those pages, search queries, and other related statistics.",
  },
  {
    id: "purchases",
    title: "Purchases",
    content:
      "All transactions made on the Website are processed through a third-party payment provider, Paddle (paddle.com). Paddle may collect personal and non-personal information such as your name, address, email, and payment details. Paddle operates under its own Privacy Policy (paddle.com/legal-buyers/), and WeOuddy does not control their data collection practices. For concerns regarding Paddle, please contact them directly.",
  },
  {
    id: "newsletter",
    title: "Newsletter Subscriptions",
    content:
      "If you sign up for our newsletter, either through a form or during the purchase process, this is managed by Loops (loops.so). Loops handles your information under its Privacy Policy (loops.so/privacy). For questions about Loops, contact them directly.",
  },
  {
    id: "managing",
    title: "Managing Personal Information",
    content:
      "You may request the deletion of your email address by contacting us. However, this will prevent you from accessing purchased products or subscriptions.",
  },
  {
    id: "rights",
    title: "Your Rights",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Withdraw consent for processing your data</li>
        <li>Access your data and obtain a copy</li>
        <li>Update or correct inaccuracies</li>
        <li>Restrict data processing in certain situations</li>
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
          <p className="text-gray-600">Last updated: 12/11/24</p>
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
