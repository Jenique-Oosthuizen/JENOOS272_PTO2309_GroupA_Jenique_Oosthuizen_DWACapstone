import { useEffect, useState } from 'react';
import { fetchShows, fetchShowDetails } from './api/api';
import { supabase } from './UserAccount/supabaseClient';
import Auth from './UserAccount/Auth';
import Account from './UserAccount/Account';
import Fuse from 'fuse.js';
import { genreNames } from './Assets/GenreNames';
import Header from './Components/Header';
import ShowPreview from './Components/Show-Preview';
import ShowDetails from './Components/ShowDetails';
import Favourites from './Components/Favourites';
import AudioPlayer from './Components/AudioPlayer';
import Carousel from './Components/Carousel';
import './App.css';

/**
 * Main application component for the podcast website.
 * This component handles the core logic, including fetching shows, managing user authentication,
 * rendering the home view, show details, favourites, and account management.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  /**
   * State to hold the list of fetched shows.
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);

  /**
   * State to manage the loading status while fetching shows.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * State to store the selected show for which details are being displayed.
   * @type {Object|null}
   */
  const [selectedShow, setSelectedShow] = useState(null);

  /**
   * State to track the loading status while fetching show details.
   * @type {boolean}
   */
  const [showDetailsLoading, setShowDetailsLoading] = useState(false);

  /**
   * State to track the selected genre for filtering shows.
   * @type {string}
   */
  const [selectedGenre, setSelectedGenre] = useState('All');

  /**
   * State to track the current view of the app (e.g., 'home', 'favourites', 'account').
   * @type {string}
   */
  const [view, setView] = useState('home');

  /**
   * State to store the current user session obtained from Supabase authentication.
   * @type {Object|null}
   */
  const [session, setSession] = useState(null);

  /**
   * Fuse.js instance for searching through shows.
   * @type {Fuse|null}
   */
  const [fuse, setFuse] = useState(null);

  /**
   * State to track the current sorting order for shows.
   * @type {string}
   */
  const [sortOrder, setSortOrder] = useState('all');

  /**
   * State to store the currently playing episode.
   * @type {Object|null}
   */
  const [currentEpisode, setCurrentEpisode] = useState(null);

  /**
   * Sorts the shows based on the selected sort order.
   * 
   * @param {Array<Object>} shows - The array of shows to be sorted.
   * @returns {Array<Object>} - The sorted array of shows.
   */
  const sortShows = (shows) => {
    if (sortOrder === 'all') {
      return shows; // Return original list of shows without sorting
    }

    switch (sortOrder) {
      case 'title-asc':
        return [...shows].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...shows].sort((a, b) => b.title.localeCompare(a.title));
      case 'date-asc':
        return [...shows].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      case 'date-desc':
        return [...shows].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      default:
        return shows;
    }
  };

  /**
   * Handles changes to the sort order.
   * 
   * @param {string} sortOption - The selected sort option.
   */
  const handleSortChange = (sortOption) => {
    setSortOrder(sortOption);
  };

  // Fetch session from Supabase on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * useEffect hook to fetch all shows from the API on the initial render.
   * Sets the fetched data to the `data` state and initializes Fuse.js for search functionality.
   */
  useEffect(() => {
    loadShows(); // Fetch and set up shows
  }, []);

  /**
   * Fetches shows from the API and updates the state with the fetched data.
   * Initializes the Fuse.js instance for search functionality.
   */
  const loadShows = async () => {
    try {
      const shows = await fetchShows();
      setData(shows);
      const fuseInstance = new Fuse(shows, { keys: ['title', 'description'], includeScore: true, threshold: 0.3 });
      setFuse(fuseInstance);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  // If data is still loading, display a loading message
  if (loading) return <p>Loading shows...</p>;

  /**
   * Handles search input by using Fuse.js to search for shows based on the query.
   * If the query is empty, it resets the shows to the original state.
   * 
   * @param {string} query - The search query input by the user.
   */
  const handleSearch = (query) => {
    if (query.trim() === '') {
      loadShows(); // Reset data to original state if query is empty
    } else if (fuse) {
      const result = fuse.search(query);
      setData(result.map(({ item }) => item)); // Update data with search results
    }
  };

  /**
   * Fetches the details of a specific show by its ID and updates the selected show state.
   * Also updates the view to show the show details.
   * 
   * @param {number} showId - The ID of the show to fetch details for.
   */
  const handleShowDetails = async (showId) => {
    setShowDetailsLoading(true);
    try {
      const showDetails = await fetchShowDetails(showId);
      setSelectedShow(showDetails);
      setView('showDetails'); // Change view to show details
    } catch (error) {
      console.error(`Error fetching details for show with ID ${showId}:`, error);
    } finally {
      setShowDetailsLoading(false);
    }
  };

  /**
   * Handles genre selection from the header and updates the selected genre.
   * Resets to the home view and the 'All' genre if 'Home' is selected.
   * 
   * @param {string} genre - The selected genre name.
   */
  const handleGenreSelect = (genre) => {
    setView('home');
    if (genre === 'Home') {
      setSelectedGenre('All');
    } else {
      setSelectedGenre(genre);
    }
  };

  /**
   * Changes the view of the app based on the user's navigation.
   * 
   * @param {string} newView - The new view to switch to (e.g., 'home', 'favourites', 'account').
   */
  const handleViewChange = (newView) => {
    setView(newView);
  };

  /**
   * Filters the shows based on the selected genre.
   * Returns all shows if 'All' is selected, or filters shows by the selected genre.
   * 
   * @returns {Array<Object>} - The filtered list of shows.
   */
  const filteredShows = selectedGenre === 'All'
    ? data
    : data.filter(show => show.genres.some(genreID => genreNames[genreID] === selectedGenre));

  const sortedAndFilteredShows = sortShows(filteredShows);

  // Render Account view if 'account' view is selected
  if (view === 'account') {
    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Account key={session.user.id} session={session} />
        <button onClick={() => setView('home')}>Back to Home</button>
      </div>
    );
  }

  // Render Auth page if session is not found
  if (!session) {
    return <Auth supabaseClient={supabase} />;
  }

  // Render Favourites view
  if (view === 'favourites') {
    return (
      <div>
        <Header
          onGenreSelect={handleGenreSelect}
          onViewChange={handleViewChange}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
        />
        <Favourites 
          user={session.user} 
          setCurrentEpisode={setCurrentEpisode} 
          currentEpisode={currentEpisode} 
        />
      </div>
    );
  }

  // Home view: Show list of show previews
  if (view === 'home') {
    const showPreviews = sortedAndFilteredShows.map((item) => (
      <ShowPreview
        key={item.id}
        {...item}
        onClick={() => handleShowDetails(item.id)}
      />
    ));

    return (
      <>
        <Header
          onGenreSelect={handleGenreSelect}
          onViewChange={handleViewChange}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
        />
        <Carousel shows={data} onShowClick={handleShowDetails} />
        <section className="show-list">
          {loading ? <p>Loading shows...</p> : showPreviews}
        </section>
        {currentEpisode && <AudioPlayer episode={currentEpisode} user={session.user} />}
      </>
    );
  }

  // ShowDetails view: Show details of the selected show
  if (view === 'showDetails') {
    return (
      <>
        {showDetailsLoading ? (
          <p>Loading show details...</p>
        ) : (
          selectedShow && <ShowDetails 
          show={selectedShow} 
          goBack={() => setView('home')}
          setCurrentEpisode={setCurrentEpisode}
          user={session.user} />
        )}
         {currentEpisode && <AudioPlayer episode={currentEpisode} user={session.user} />}
      </>
    );
  }
}

export default App;