import { useEffect, useState } from 'react';
import { supabase } from '../UserAccount/supabaseClient';

export default function Favourites({ user }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavourites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favourites')
        .select('episode_id, show_title, episode_title, season, episode_number')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favourites:', error.message);
      } else {
        setFavourites(data);
      }
      setLoading(false);
    };

    if (user) {
      loadFavourites();
    }
  }, [user]);

  if (loading) return <p>Loading favourites...</p>;

  return (
    <>
      <h3 className="fav-title">Favourite Episodes</h3>
      <div className="favourites-list">
        {favourites.length === 0 ? (
          <p>No favourites yet.</p>
        ) : (
          favourites.map((fav) => (
            <div key={fav.episode_id} className="favourite-item">
              <h4>{fav.show_title} - {fav.episode_title}</h4>
              <p>Season {fav.season}, Episode {fav.episode_number}</p>
              <button
                onClick={async () => {
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