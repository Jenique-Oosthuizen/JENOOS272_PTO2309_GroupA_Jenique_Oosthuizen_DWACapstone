import { useState } from "react";
import { supabase } from "../UserAccount/supabaseClient";

/**
 * ShowDetails component for displaying detailed information about a specific podcast show.
 * 
 * This component allows users to select a season, view the list of episodes, and play an episode.
 * It also provides a 'Go Back' button to return to the previous view.
 * 
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {Object} props.show - The show object containing details about the podcast show.
 * @param {string} props.show.title - The title of the podcast show.
 * @param {string} props.show.image - The URL of the image representing the podcast show.
 * @param {string} props.show.description - The description of the podcast show.
 * @param {Array<Object>} props.show.seasons - An array of seasons where each season contains an array of episodes.
 * @param {Function} props.goBack - Callback function to handle the 'Go Back' button click.
 * @param {Function} props.setCurrentEpisode - Callback function to set the currently playing episode.
 * 
 * @returns {JSX.Element} - The rendered ShowDetails component.
 */
export default function ShowDetails({ show, goBack, setCurrentEpisode, user }) {
    const [selectedSeason, setSelectedSeason] = useState(1);

    // Get the list of seasons from the show object, or an empty array if no seasons are available
    const seasons = show?.seasons || [];

    // Get the currently selected season's details
    const currentSeason = seasons[selectedSeason - 1];

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    const handlePlayClick = (episode) => {
        console.log('Play button clicked for episode:', episode);
        setCurrentEpisode(episode);
    };

    if (!currentSeason) {
        return <p>No episodes available for this season.</p>;
    }

    return (
        <div className="show-details-container">
            <button className="goBack-button" onClick={goBack}>Go Back</button>
            <div className="show-details-header">
                <h4 className="show-details-title">{show.title}</h4>
                <img className="show-details-image" src={show.image} alt={show.title} />
                <p className="show-description">{show.description}</p>

                {seasons.length > 0 ? (
                    <div>
                        <label>Select Season </label>
                        <select value={selectedSeason} onChange={handleSeasonChange}>
                            {seasons.map((_, index) => (
                                <option key={index} value={index + 1}>
                                    Season {index + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <p>No seasons available.</p>
                )}
            </div>

            <div className="episodes-list">
                {currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
                    <div className="episodes-list">
                        {currentSeason.episodes.map((episode, index) => (
                            <div key={index} className="episode-card">
                                <p className="episode-number">Episode {episode.episode}</p>

                                {/* Favourite button */}
                                <button
                                    className="episode-fav-button"
                                    onClick={async () => {
                                        try {
                                            const { error } = await supabase
                                                .from('favourites')
                                                .insert({
                                                    user_id: user.id,               // Make sure this value is correct
                                                    episode_id: episode.episode,    // Use episode number as episode_id
                                                    episode_title: episode.title,   // Optional: Add title if needed
                                                    show_id: show.id,               // Ensure you're passing show ID correctly
                                                    show_title: show.title,         // Optional: Add show title if needed
                                                    season: selectedSeason,         // Pass the selected season
                                                    episode_number: episode.episode // Ensure episode number is passed correctly
                                                });
                                        
                                            if (error) throw error;

                                            console.log("Episode added to favourites successfully");
                                        } catch (error) {
                                            console.error('Error adding to favourites:', error.message);
                                        }
                                    }}
                                >
                                    <svg
                                        className="fav-button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        width="30"
                                        height="30"
                                    >
                                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"/>
                                    </svg>
                                </button>

                                <h3>{episode.title}</h3>
                                <p>{episode.description}</p>

                                {/* Play button for the episode */}
                                <button className="play-button" onClick={() => handlePlayClick(episode)}>
                                    Play
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No episodes available for this season.</p>
                )}
            </div>
        </div>
    );
}