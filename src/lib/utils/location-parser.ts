import { getGeocode, getLatLng } from 'use-places-autocomplete';
import { CITY_MAPPINGS, findCountryRegion } from './location-mapping';

interface ParsedLocation {
  locationPath: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  originalAddress: string;
}

export async function parseLocation(
  address: string
): Promise<ParsedLocation> {
  try {
    // Get geocoding results
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    // Parse address components
    const addressComponents = results[0].address_components;
    let country = '';
    let city = '';
    let subLocality = '';

    for (const component of addressComponents) {
      const types = component.types;

      if (types.includes('country')) {
        country = component.long_name;
      }
      if (
        types.includes('locality') ||
        types.includes('administrative_area_level_2')
      ) {
        city = component.long_name;
      }
      if (
        types.includes('sublocality') ||
        types.includes('neighborhood')
      ) {
        subLocality = component.long_name;
      }
    }

    // Find country's geographical location
    const countryRegion = findCountryRegion(country);
    let locationPath = 'world'; // Default to world

    if (countryRegion) {
      locationPath = `${countryRegion.continent}.${countryRegion.region}.${country.toLowerCase().replace(/\s+/g, '')}`;

      // Check for city and sub-location mapping
      const countryMapping =
        CITY_MAPPINGS[
          country.toLowerCase() as keyof typeof CITY_MAPPINGS
        ];
      if (countryMapping) {
        const cityKey = Object.keys(countryMapping.cities).find(
          (key) =>
            city
              .toLowerCase()
              .includes(
                countryMapping.cities[
                  key as keyof typeof countryMapping.cities
                ]?.name.toLowerCase()
              )
        ) as keyof typeof countryMapping.cities;

        if (cityKey) {
          locationPath += `.${cityKey}`;

          // Check for sub-locations
          if (subLocality) {
            const subLocations =
              countryMapping.cities[
                cityKey as keyof typeof countryMapping.cities
              ]?.subLocations;
            const subLocationKey = subLocations
              ? Object.keys(subLocations).find((key) =>
                  subLocality
                    .toLowerCase()
                    .includes(subLocations[key].toLowerCase())
                )
              : undefined;

            if (subLocationKey) {
              locationPath += `.${subLocationKey}`;
            }
          }
        }
      }
    }

    return {
      locationPath,
      city,
      country,
      coordinates: { lat, lng },
      originalAddress: results[0].formatted_address,
    };
  } catch (error) {
    console.error('Error parsing location:', error);
    throw new Error('Failed to parse location');
  }
}

// Usage example:
/*
  const location = await parseLocation('East Legon Hills, Tema, Ghana');
  // Returns:
  {
    locationPath: 'africa.westAfrica.ghana.accra.eastLegon',
    city: 'Accra',
    country: 'Ghana',
    coordinates: { lat: 5.6037, lng: -0.187 },
    originalAddress: 'East Legon Hills, Tema, Greater Accra, Ghana'
  }

  // When creating/updating an event
const eventLocation = {
  location: parsedLocation.locationPath,        // "africa.westAfrica.ghana.accra.eastlegon"
  city: parsedLocation.city,                    // "Accra"
  country: parsedLocation.country,              // "Ghana"
  coordinates: parsedLocation.coordinates       // { lat: 5.6037, lng: -0.187 }
};
  */
