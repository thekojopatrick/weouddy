export type RegionType =
  | 'Africa'
  | 'world'
  | 'Europe'
  | 'Asia'
  | 'Americas';

export interface LocationDetails {
  name: string;
  country?: string;
  region: string;
}

export interface LocationMapping {
  cities: Record<string, LocationDetails>;
  countries: Record<string, LocationDetails>;
}

export interface CategorizedLocation {
  city: string;
  country: string;
  region: string;
}

export const locationMapping: LocationMapping = {
  cities: {
    accra: {
      name: 'Accra',
      country: 'Ghana',
      region: 'Africa',
    },
    // Add more cities as needed
  },
  countries: {
    ghana: {
      name: 'Ghana',
      region: 'Africa',
    },
    // Add more countries as needed
  },
};

export function categorizeLocation(
  location: string
): CategorizedLocation {
  // Normalize input
  const [rawCity, rawCountry] = location
    .split(',')
    .map((l) => l.trim().toLowerCase());
  const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
  const country = rawCountry
    ? rawCountry.charAt(0).toUpperCase() + rawCountry.slice(1)
    : '';

  // Check city-specific mapping first
  if (locationMapping.cities[rawCity]) {
    const cityDetails = locationMapping.cities[rawCity];
    return {
      city: cityDetails.name,
      country: cityDetails.country || country,
      region: cityDetails.region,
    };
  }

  // Check country-specific mapping
  if (locationMapping.countries[rawCountry]) {
    const countryDetails = locationMapping.countries[rawCountry];
    return {
      city,
      country: countryDetails.name,
      region: countryDetails.region,
    };
  }

  // If no match, return as rest of the world
  return {
    city,
    country,
    region: 'world',
  };
}

// Helper function to validate location mapping
export function isValidLocation(location: string): boolean {
  const { city, country, region } = categorizeLocation(location);

  // Check if the location is explicitly mapped or has a valid region
  return (
    !!locationMapping.cities[city.toLowerCase()] ||
    !!locationMapping.countries[country.toLowerCase()] ||
    region !== 'world'
  );
}

// Geographical mapping data
export const GEOGRAPHICAL_MAPPING = {
  continents: {
    africa: {
      name: 'Africa',
      regions: {
        westAfrica: {
          name: 'West Africa',
          countries: {
            benin: 'Benin',
            burkinaFaso: 'Burkina Faso',
            capeVerde: 'Cape Verde',
            gambia: 'Gambia',
            ghana: 'Ghana',
            guinea: 'Guinea',
            guineaBissau: 'Guinea-Bissau',
            ivoryCoast: 'Ivory Coast',
            liberia: 'Liberia',
            mali: 'Mali',
            mauritania: 'Mauritania',
            niger: 'Niger',
            nigeria: 'Nigeria',
            senegal: 'Senegal',
            sierraLeone: 'Sierra Leone',
            togo: 'Togo',
          },
        },
        eastAfrica: {
          name: 'East Africa',
          countries: {
            burundi: 'Burundi',
            comoros: 'Comoros',
            djibouti: 'Djibouti',
            eritrea: 'Eritrea',
            ethiopia: 'Ethiopia',
            kenya: 'Kenya',
            madagascar: 'Madagascar',
            // Add more East African countries...
          },
        },
        // Add other African regions...
      },
    },
    // Add other continents as needed...
  },
};

// City mappings for supported countries
export const CITY_MAPPINGS = {
  ghana: {
    cities: {
      accra: {
        name: 'Accra',
        region: 'greaterAccra',
        subLocations: {
          eastLegon: 'East Legon',
          tema: 'Tema',
          teshie: 'Teshie',
          spintex: 'Spintex',
          airport: 'Airport',
          cantonments: 'Cantonments',
        },
      },
      kumasi: {
        name: 'Kumasi',
        region: 'ashanti',
        subLocations: {},
      },
      takoradi: {
        name: 'Takoradi',
        region: 'western',
        subLocations: {},
      },
    },
  },
  nigeria: {
    cities: {
      lagos: {
        name: 'Lagos',
        region: 'lagos',
        subLocations: {
          ikeja: 'Ikeja',
          victoria: 'Victoria Island',
          lekki: 'Lekki',
        },
      },
      abuja: {
        name: 'Abuja',
        region: 'fct',
        subLocations: {},
      },
    },
  },
};

export const getLocationPath = (location: string): string[] => {
  const paths: string[] = [];
  let currentPath = location;

  while (currentPath) {
    paths.unshift(currentPath);
    currentPath = currentPath.split('.').slice(0, -1).join('.');
  }

  return paths;
};

// Helper function to find country's region
export function findCountryRegion(countryName: string): {
  continent: string;
  region: string;
} | null {
  const continents = GEOGRAPHICAL_MAPPING.continents;

  for (const [continentKey, continent] of Object.entries(
    continents
  )) {
    for (const [regionKey, region] of Object.entries(
      continent.regions
    )) {
      const countryMatch = Object.entries(region.countries).find(
        ([_, name]) =>
          name.toLowerCase() === countryName.toLowerCase()
      );

      if (countryMatch) {
        return {
          continent: continentKey,
          region: regionKey,
        };
      }
    }
  }

  return null;
}
