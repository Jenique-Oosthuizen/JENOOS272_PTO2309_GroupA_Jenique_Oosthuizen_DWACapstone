import { useState, useEffect, useRef } from 'react';
import { supabase } from '../UserAccount/supabaseClient';

/**
 * AudioPlayer component for playing and tracking audio progress.
 * 
 * This component allows users to play audio for a given episode, tracks progress, 
 * stores audio progress in a Supabase table, and persists it across sessions.
 * 
 * @component
 * @param {Object} props - Props passed to the component
 * @param {Object} props.episode - The episode object containing episode details (like audio file URL).
 * @param {string} props.episode.id - The unique ID of the episode.
 * @param {string} props.episode.file - The URL of the audio file for the episode.
 * @param {Object} props.user - The user object containing user details.
 * @param {string} props.user.id - The unique ID of the user.
 * 
 * @returns {JSX.Element|null} - The rendered AudioPlayer component.
 */
const AudioPlayer = ({ episode, user }) => {
  // States
  const [isPlaying, setIsPlaying] = useState(false); // Controls whether audio is playing or paused
  const [progressTime, setProgressTime] = useState(0); // Tracks the current time of the audio (in seconds)
  const [duration, setDuration] = useState(0); // Stores the duration of the audio file (in seconds)

  // Reference to the HTML audio element
  const audioRef = useRef(null);

  /**
   * useEffect to fetch and set the user's saved progress for the episode.
   * If progress data exists, it will set the progress in the audio player.
   * This runs every time the `episode` or `user.id` changes.
   */
  useEffect(() => {
    if (episode) {
      const fetchProgress = async () => {
        const { data, error } = await supabase
          .from('user_audio_progress')
          .select('progress_time, finished')
          .eq('user_id', user.id)
          .eq('episode_id', episode.id)
          .single();

        if (data) {
          setProgressTime(data.progress_time); // Set the saved progress time
          if (audioRef.current) {
            audioRef.current.currentTime = data.progress_time; // Update audio currentTime
          }
        } else if (error) {
          console.error('Error fetching progress:', error.message);
        }
      };
      fetchProgress();
    }
  }, [episode, user.id]);

  /**
   * Updates the audio's `currentTime` when `progressTime` state changes.
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = progressTime; // Sync the audio element's current time with progressTime state
    }
  }, [progressTime]);

   /**
   * Handles the time update event of the audio element.
   * This function is called as the audio plays and updates the progress.
   * The new time is saved in both the state and Supabase.
   */
  const handleTimeUpdate = async () => {
    const newTime = audioRef.current.currentTime;
    setProgressTime(newTime); // Update progressTime state with current audio time
    // Save progress in the Supabase database
    await supabase
      .from('user_audio_progress')
      .upsert({
        user_id: user.id,
        episode_id: episode.id,
        progress_time: newTime,
      }, { onConflict: ['user_id', 'episode_id'] });
  };

  /**
   * Toggles between playing and pausing the audio.
   * Updates the `isPlaying` state accordingly.
   */
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause audio
    } else {
      audioRef.current.play(); // Play audio
    }
    setIsPlaying(!isPlaying); // Toggles play state
  };

  /**
   * Event listener for handling the 'beforeunload' event.
   * Prompts the user with a confirmation dialog if the audio is playing
   * when they try to close or refresh the page.
   * 
   * @param {Event} event - The beforeunload event
   */
  const handleBeforeUnload = (event) => {
    if (isPlaying) {
      event.preventDefault();
      event.returnValue = ''; // Some browsers show a confirmation dialog
    }
  };

  /**
   * Resets the audio progress both locally and in the Supabase database.
   * Sets the audio back to the start (0 seconds).
   */
  const resetProgress = async () => {
    setProgressTime(0); // Reset progressTime state
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to the start
    }
    // Delete the user's progress from Supabase
    await supabase
      .from('user_audio_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('episode_id', episode.id);
  };

  // Add/remove the `beforeunload` event listener when `isPlaying` changes
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  // Return null if there's no episode loaded
  if (!episode) return null;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={episode.file} // The source of the audio file
        onTimeUpdate={handleTimeUpdate} // Updates progress as audio plays
        onLoadedMetadata={() => setDuration(audioRef.current.duration)} // Set duration once audio metadata is loaded
      />
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'} {/* Display 'Play' or 'Pause' button */}
      </button>
      <div className="progress">
        {/* Display progress and duration in minutes and seconds */}
        <span className="timestamps">
          {Math.floor(progressTime / 60)}:{Math.floor(progressTime % 60).toString().padStart(2, '0')} / 
          {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <button onClick={resetProgress}>Reset Progress</button> {/* Button to reset progress */}
    </div>
  );
};

export default AudioPlayer;