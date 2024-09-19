import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './account.css';

/**
 * Account component for managing the user's profile.
 * 
 * This component allows users to view and update their profile information, including username, website, 
 * and avatar URL. It also provides the functionality to sign out.
 * 
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {Object} props.session - The session object that contains information about the currently authenticated user.
 * 
 * @returns {JSX.Element} - The rendered Account component.
 */
export default function Account({ session }) {
  /**
   * Loading state to indicate whether the profile data is being fetched or updated.
   * 
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true)

  /**
   * State for storing the user's username.
   * 
   * @type {[string, Function]}
   */
  const [username, setUsername] = useState(null)

  /**
   * State for storing the user's website URL.
   * 
   * @type {[string, Function]}
   */
  const [website, setWebsite] = useState(null)

  /**
   * State for storing the user's avatar URL.
   * 
   * @type {[string, Function]}
   */
  const [avatar_url, setAvatarUrl] = useState(null)

  /**
   * useEffect hook to fetch the user's profile data when the component mounts or when the session changes.
   * The profile data includes the username, website, and avatar URL, which are retrieved from the Supabase database.
   */
  useEffect(() => {
    let ignore = false
    /**
     * Fetches the user's profile information from the 'profiles' table in Supabase.
     */
    async function getProfile() {
      setLoading(true)
      const { user } = session

      // Fetch the profile data from the 'profiles' table based on the user's ID
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error) // Log any errors
        } else if (data) {
          // Set the profile data in state
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    // Cleanup to ignore setting state if the component is unmounted
    return () => {
      ignore = true
    }
  }, [session])

  /**
   * Handles the form submission to update the user's profile information in Supabase.
   * 
   * @param {Object} event - The form submit event.
   * @param {string} avatarUrl - The updated avatar URL for the user's profile.
   */
  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    // Prepare the updates for the user's profile
    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    // Update the user's profile in the 'profiles' table
    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message) // Display any errors
    } else {
      setAvatarUrl(avatarUrl) // Update the avatar URL in state
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
         {/* Display the user's email, which is fetched from the session object and is disabled for editing */}
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        {/* Input field for updating the username */}
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        {/* Input field for updating the website URL */}
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
         {/* Button for submitting the profile update */}
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        {/* Button for signing out of the session */}
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}