const BASE_URL = 'https://podcast-api.netlify.app';

/**
 * API endpoint configuration object for the podcast website.
 * Contains the base URL and methods to construct full API endpoints for fetching shows and show details.
 *
 * @constant
 * @type {Object}
 * @property {string} SHOWS - The endpoint for fetching all shows.
 * @property {function(number|string): string} SHOW_DETAILS - A function that returns the endpoint for fetching details of a specific show by its ID.
 *
 * @example
 * // Fetch all shows
 * const showsEndpoint = API_ENDPOINTS.SHOWS;
 * console.log(showsEndpoint); // "https://podcast-api.netlify.app/shows"
 *
 * // Fetch details of a specific show
 * const showDetailsEndpoint = API_ENDPOINTS.SHOW_DETAILS(123);
 * console.log(showDetailsEndpoint); // "https://podcast-api.netlify.app/id/123"
 */
export const API_ENDPOINTS = {
  SHOWS: `${BASE_URL}/shows`,
  SHOW_DETAILS: (showId) => `${BASE_URL}/id/${showId}`,
};