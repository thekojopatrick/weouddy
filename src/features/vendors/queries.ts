// Example usage in a page
import { vendorsData } from "./dummy-data";
import { getTopRatedVendors, getVendorById, searchVendors } from "./helper";

// Get all vendors
const allVendors = vendorsData;

// Get a specific vendor
const vendor = getVendorById("v1");

// Search vendors
const searchResults = searchVendors("wedding");

// Get top rated vendors
const topVendors = getTopRatedVendors(3);
