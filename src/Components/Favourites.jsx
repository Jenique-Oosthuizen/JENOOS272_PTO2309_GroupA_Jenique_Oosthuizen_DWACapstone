import { useEffect, useState } from 'react';
import { supabase } from '../UserAccount/supabaseClient';

/**
 * Favourites component displays a user's list of favourite podcast episodes.
 * It allows users to view, sort, play, and remove their favourite episodes.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.user - The authenticated user object from Supabase, containing user details such as `id`.
 * @param {Function} props.setCurrentEpisode - Function to set the currently playing episode.
 * @param {Object} props.currentEpisode - The currently playing episode object.
 * 
 * @returns {JSX.Element} - The rendered Favourites component.
 */
export default function Favourites({ user, setCurrentEpisode, currentEpisode }) {
  /**
   * State to store the list of favourite episodes fetched from the database.
   * @type {Array<Object>}
   */
  const [favourites, setFavourites] = useState([]);

  /**
   * State to manage loading status while fetching data from the database.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * State to handle any errors that occur while fetching or removing favourites.
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * State to manage the sorting order for the favourite episodes.
   * @type {string}
   */
  const [sortOrder, setSortOrder] = useState('title-asc'); // Sorting state

  /**
   * Fetches the user's favourite episodes from the Supabase `favourites` table
   * and sets the fetched data to the `favourites` state.
   */
  useEffect(() => {
    const loadFavourites = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const { data, error } = await supabase
          .from('favourites')
          .select('episode_id, show_title, episode_title, season, episode_number, created_at') // Add created_at for sorting
          .eq('user_id', user.id);
  
        if (error) throw error; // Handle error
  
        console.log("Fetched favourites data: ", data); // Log the fetched data
        setFavourites(data);
      } catch (error) {
        setError('Error loading favourites. Please try again.');
        console.error('Error loading favourites:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      loadFavourites();
    }
  }, [user]);  

  /**
   * Sorts the list of favourite episodes based on the selected sorting order.
   * @returns {Array<Object>} - The sorted array of favourite episodes.
   */
  const sortFavourites = () => {
    return [...favourites].sort((a, b) => {
      switch (sortOrder) {
        case 'title-asc':
          return a.show_title.localeCompare(b.show_title);
        case 'title-desc':
          return b.show_title.localeCompare(a.show_title);
        case 'date-asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'date-desc':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return favourites;
      }
    });
  };

  // Loading state handling
  if (loading) return <p>Loading favourites...</p>;

  return (
    <>
      <h3 className="fav-title">Favourite Episodes</h3>

      {/* Sorting Options */}
      <div className="sort-options">
        <label>Sort by:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="title-asc">Show Title (A-Z)</option>
          <option value="title-desc">Show Title (Z-A)</option>
          <option value="date-asc">Date Added (Oldest)</option>
          <option value="date-desc">Date Added (Newest)</option>
        </select>
      </div>
      <hr></hr>

      {/* Error handling */}
      {error && <p className="error-message">{error}</p>} {/* Display error message if there's an error */}
      
      {/* List of favourite episodes */}
      <div className="favourites-list">
        {favourites.length === 0 ? (
          <p>No favourites yet.</p>
        ) : (
          sortFavourites().map((fav, index) => (
            <div key={`${fav.episode_id}-${index}`} className="favourite-item">  {/* Using episode_id + index */}
              <h4>{fav.show_title} - {fav.episode_title}</h4>
              <p>Season {fav.season}, Episode {fav.episode_number}</p>

              {/* Play Button */}
              <button
                onClick={() => setCurrentEpisode(fav)} // Set the currently playing episode
              >
                {currentEpisode?.episode_id === fav.episode_id ? 'Pause' : 'Play'}
              </button>

              {/* Remove from Favourites Button */}
              <button
                onClick={async () => {
                  const confirmed = window.confirm('Are you sure you want to remove this favourite?');
                  if (!confirmed) return; // Add confirmation for user interaction

                  await supabase
                    .from('favourites')
                    .delete()
                    .eq('episode_id', fav.episode_id)
                    .eq('user_id', user.id);
                  setFavourites(favourites.filter(f => f.episode_id !== fav.episode_id));
                }}
              >
                Remove from Favourites
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}