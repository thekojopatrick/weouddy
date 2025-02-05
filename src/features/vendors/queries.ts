// Example usage in a page
import { vendorsData } from "./dummy-data";
import { getTopRatedVendors, getVendorById, searchVendors } from "./helper";

// Get all vendors
export const allVendors = vendorsData;

// Get a specific vendor
export const vendor = getVendorById("v1");

// Search vendors
export const searchResults = searchVendors("wedding");

// Get top rated vendors
export const topVendors = getTopRatedVendors(3);
