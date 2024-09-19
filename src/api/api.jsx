import { API_ENDPOINTS } from "./endpoint";

/**
 * Fetches all available shows from the API.
 *
 * @async
 * @function fetchShows
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of show objects.
 * @throws Will throw an error if the request fails or the response is not OK.
 *
 * @example
 * fetchShows()
 *   .then(shows => console.log(shows))
 *   .catch(error => console.error('Error fetching shows:', error));
 */
export const fetchShows = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.SHOWS);

    if (!response.ok) {
      throw new Error('Failed to fetch shows');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

/**
 * Fetches details for a specific show by its ID.
 *
 * @async
 * @function fetchShowDetails
 * @param {number|string} showId - The ID of the show to fetch details for.
 * @returns {Promise<Object>} A promise that resolves to the show details object.
 * @throws Will throw an error if the request fails or the response is not OK.
 *
 * @example
 * fetchShowDetails(123)
 *   .then(showDetails => console.log(showDetails))
 *   .catch(error => console.error('Error fetching show details:', error));
 */
export const fetchShowDetails = async (showId) => {
  try {
    const endpoint = API_ENDPOINTS.SHOW_DETAILS(showId);
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for show with ID ${showId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for show with ID ${showId}:`, error);
    throw error;
  }
};