import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNameInitials = (name: string, count = 2) => {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('');
  const filtered = initials?.replace(/[^a-zA-Z]/g, '');
  return filtered?.slice(0, count).toUpperCase();
};

export function capitalizeFirstLetter(str: string) {
  return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}

export function createURL(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>
) {
  const params = new URLSearchParams(oldParams);
  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  return `${href}?${params.toString()}`;
}

export const getMonth = (month: number) => {
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (month < 1 || month > 12) {
    return 'Invalid month number. Please enter a number between 1 and 12.';
  }

  return months[month - 1];
};

export const duplicateValidation = (arr: string[], el: string) => {
  if (!arr.find((t) => t === el)) {
    arr.push(el);
    return arr;
  } else {
    arr = arr.filter((t) => t !== el);
    return arr;
  }
};

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Helper functions
export function isCUID(str: string): boolean {
  return /^c[a-zA-Z0-9]{24}$/.test(str);
}

export function extractIdentifierFromLink(
  link: string
): string | null {
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

export function extractEventIdFromLink(
  link: string
): { type: 'id' | 'slug'; value: string } | null {
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    if (!lastPart) return null;

    // Check if it's a CUID (assuming that's what you're using for IDs)
    const isCUID = /^c[a-zA-Z0-9]{24}$/.test(lastPart);

    return {
      type: isCUID ? 'id' : 'slug',
      value: lastPart,
    };
  } catch {
    return null;
  }
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};
