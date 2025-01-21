'use server';

import { env } from '@/env';

export async function searchPlaces(input: string) {
  if (!input || input.length < 2) return [];

  if (!env.GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured');
    throw new Error('Google Maps API key is missing');
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/js?input=${encodeURIComponent(
        input
      )}&key=${env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocompleter`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.predictions.map((prediction: any) => ({
        description: prediction.description,
        place_id: prediction.place_id,
        structured_formatting: prediction.structured_formatting,
      }));
    } else {
      console.error(
        'Places API Error:',
        data.status,
        data.error_message
      );
      return [];
    }
  } catch (error) {
    console.error('Error fetching place predictions:', error);
    return [];
  }
}
