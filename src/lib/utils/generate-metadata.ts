import { formatDate } from "date-fns";
import { Metadata } from "next";
import { getSiteURL } from "@/utils";
import { EventModel } from "@/types/event";
import { formatEventDateTime } from "./formatters";

const SITE_URL = getSiteURL();

function getHomepageOGImageLink(): string {
  return `${SITE_URL}/assets/opengraph-image.jpg`;
}

export function generateMetadataForEvent(data: EventModel): Metadata {
  const metadata: Metadata = {
    title: data.name,
    publisher: data.host.name,
    description: data.description,
    robots: getRobotsMetadata(),
    twitter: getTwitterMetadata(data),
    openGraph: getOpenGraphMetadata(data),
    keywords: data.type,
    alternates: {
      canonical: `${SITE_URL}/events/${data.slug}`,
    },
  };

  return metadata;
}

function getRobotsMetadata(): Metadata["robots"] {
  const metadata: Metadata["robots"] = {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  };
  return metadata;
}

function getOpenGraphMetadata(data: EventModel): Metadata["openGraph"] {
  return {
    type: "article",
    locale: "en_US",
    siteName: "WeOuddy",
    authors: data.host.name,
    description: data?.description ?? `Join me at ${data?.name}`,
    title: `${data.name} | WeOuddy`,
    modifiedTime: formatEventDateTime(data?.updatedAt as never).date,
    publishedTime: formatEventDateTime(data?.updatedAt as never).time,
    url: `https://www.weouddy.com/events/${data.slug}`,
    images: [
      {
        width: "1080",
        height: "1080",
        alt: data.name,
        type: "image/jpeg",
        url: data.coverImage ?? getHomepageOGImageLink(),
      },
    ],
  };
}

function getTwitterMetadata(data: EventModel): Metadata["twitter"] {
  return {
    title: `${data.name} | WeOuddy`,
    site: `WeOuddy`,
    description: data?.description ?? `Join me at ${data?.name}`,
    card: "summary_large_image",
    siteId: "https://www.weouddy.com",
    images: [
      {
        width: "1080",
        height: "1080",
        alt: data.name,
        type: "image/jpeg",
        url: data.coverImage ?? getHomepageOGImageLink(),
      },
    ],
  };
}
