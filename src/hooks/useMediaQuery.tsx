import React from 'react';

/**
 * Custom hook to monitor media query changes.
 *
 * @param query - The media query string to evaluate (e.g., "(min-width: 768px)").
 * @returns A boolean indicating whether the media query matches.
 */

export function useMediaQuery(query: string) {
	const subscribe = React.useCallback(
		(callback: (event: MediaQueryListEvent) => void) => {
			const matchMedia = window.matchMedia(query);

			matchMedia.addEventListener('change', callback);
			return () => {
				matchMedia.removeEventListener('change', callback);
			};
		},
		[query]
	);

	const getSnapshot = () => window.matchMedia(query).matches;

	const getServerSnapshot = () => {
		throw Error('useMediaQuery is a client-only hook');
	};

	return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
