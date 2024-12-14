import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getNameInitials = (name: string, count = 2) => {
	const initials = name
		.split(' ')
		.map((n) => n[0])
		.join('');
	const filtered = initials.replace(/[^a-zA-Z]/g, '');
	return filtered.slice(0, count).toUpperCase();
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
