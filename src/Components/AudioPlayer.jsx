import { useState, useEffect, useRef } from 'react';
import { supabase } from '../UserAccount/supabaseClient';

/**
 * AudioPlayer component is responsible for rendering and controlling the playback of an audio episode.
 * It manages audio progress, playback state, and stores user progress in Supabase.
 *
 * @component
 * @param {Object} episode - The currently selected episode object to be played.
 * @param {string} episode.id - The unique identifier for the episode.
 * @param {string} episode.file - The URL of the audio file for the episode.
 * @param {Object} user - The authenticated user object from Supabase.
 * @param {string} user.id - The unique identifier for the authenticated user.
 * 
 * @example
 * const episode = {
 *   id: '1',
 *   file: 'https://example.com/audiofile.mp3'
 * };
 * const user = {
 *   id: 'user-123'
 * };
 * <AudioPlayer episode={episode} user={user} />
 * 
 * @returns {JSX.Element} The rendered AudioPlayer component.
 */
export default function AudioPlayer({ episode, user }) {
  const audioRef = useRef(null); // Ref to the audio element

  // State to manage whether the audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);

  // State to indicate if audio progress is being loaded
  const [loadingProgress, setLoadingProgress] = useState(true);

  // State to track the current progress time (in seconds) of the audio
  const [progressTime, setProgressTime] = useState(0);

  // State to store the total duration of the audio
  const [duration, setDuration] = useState(0);

  // State to handle and display any errors during playback or fetching progress
  const [error, setError] = useState(null);

  // State to store a success message when the progress is reset
  const [resetMessage, setResetMessage] = useState(null);

  // Disable actions when progress is being loaded
  const disableActions = loadingProgress;

  /**
   * Fetches the user's progress for the current episode from Supabase and updates the progressTime state.
   * The function is triggered when the component mounts or when `episode` or `user` changes.
   */
  useEffect(() => {
    if (episode && episode.id && user) {
      console.log('Fetching progress for episode:', episode); 
      
      const fetchProgress = async () => {
        try {
          const { data, error } = await supabase
            .from('user_audio_progress')
            .select('progress_time, finished')
            .eq('user_id', user.id)
            .eq('episode_id', episode.id)
            .single();
  
          if (data) {
            console.log('Fetched progress:', data);
            setProgressTime(data.progress_time);
            if (audioRef.current) {
              audioRef.current.currentTime = data.progress_time;
            }
          }
        } catch (error) {
          setError('Error fetching progress. Please try again.');
          console.error('Error fetching progress:', error.message);
        } finally {
          setLoadingProgress(false); // Ensure loading is set to false
        }
      };
      
      fetchProgress();
    } else {
      setLoadingProgress(false); // No episode or user, so stop loading
    }
  }, [episode, user]);

  /**
   * Updates the audio's currentTime when `progressTime` changes.
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = progressTime;
    }
  }, [progressTime]);

  /**
   * Debounced function that saves the user's progress to Supabase every 10 seconds.
   */
  useEffect(() => {
    if (!audioRef.current) return;

    const saveProgress = setTimeout(async () => {
      try {
        await supabase
          .from('user_audio_progress')
          .upsert({
            user_id: user.id,
            episode_id: episode.id,
            progress_time: audioRef.current.currentTime,
          }, { onConflict: ['user_id', 'episode_id'] });
      } catch (error) {
        console.error('Error saving progress:', error.message);
      }
    }, 10000); // Save progress every 10 seconds

    return () => clearTimeout(saveProgress);
  }, [progressTime, episode, user]);

  /**
   * Toggles play/pause for the audio. Prevents interaction while loading.
   */
  const handlePlayPause = () => {
    if (disableActions) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /**
   * Warns the user when they attempt to close the window while audio is playing.
   * This is added to prevent accidental closing of the page.
   */
  const handleBeforeUnload = (event) => {
    if (isPlaying) {
      event.preventDefault();
      event.returnValue = ''; // Trigger browser confirmation
    }
  };

  /**
   * Resets the user's progress for the current episode both in the player and in Supabase.
   * Clears the progress from the player and shows a success message.
   */
  const resetProgress = async () => {
    setProgressTime(0);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }

    try {
      await supabase
        .from('user_audio_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('episode_id', episode.id);
      setResetMessage('Progress has been successfully reset.');
    } catch (error) {
      setError('Error resetting progress. Please try again.');
    }

    setTimeout(() => {
      setResetMessage(null);
    }, 3000);
  };

  /**
   * Adds an event listener to prevent the user from closing the page while audio is playing.
   */
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  /**
   * Handles the loading of audio metadata (duration) and updates the duration state.
   */
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  return (
    <div className="audio-player">
      {error && <p className="error-message">{error}</p>}
      {loadingProgress && <div className="loading-spinner">Loading audio...</div>}
      {resetMessage && <p className="success-message">{resetMessage}</p>}

      {!loadingProgress && (
        <>
          <audio
            controls
            ref={audioRef}
            src={episode.file}
            onTimeUpdate={() => setProgressTime(audioRef.current.currentTime)}
            onLoadedMetadata={handleLoadedMetadata}
          />
          <button onClick={handlePlayPause} disabled={disableActions}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="progress">
            <span className="timestamps">
              {Math.floor(progressTime / 60)}:{Math.floor(progressTime % 60).toString().padStart(2, '0')} / 
              {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button onClick={resetProgress} disabled={disableActions}>Reset</button>
        </>
      )}
    </div>
  );
}