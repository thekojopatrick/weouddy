export type RegionType = "Africa" | "world" | "Europe" | "Asia" | "Americas";

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
    "accra": {
      name: "Accra",
      country: "Ghana",
      region: "Africa",
    },
    // Add more cities as needed
  },
  countries: {
    "ghana": {
      name: "Ghana",
      region: "Africa",
    },
    // Add more countries as needed
  },
};

export function categorizeLocation(location: string): CategorizedLocation {
  // Normalize input
  const [rawCity, rawCountry] = location.split(",").map((l) =>
    l.trim().toLowerCase()
  );
  const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
  const country = rawCountry
    ? rawCountry.charAt(0).toUpperCase() + rawCountry.slice(1)
    : "";

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
    region: "world",
  };
}

// Helper function to validate location mapping
export function isValidLocation(location: string): boolean {
  const { city, country, region } = categorizeLocation(location);

  // Check if the location is explicitly mapped or has a valid region
  return (
    !!locationMapping.cities[city.toLowerCase()] ||
    !!locationMapping.countries[country.toLowerCase()] ||
    region !== "world"
  );
}
