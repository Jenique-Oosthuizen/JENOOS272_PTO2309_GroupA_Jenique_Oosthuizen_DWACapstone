import { useState } from 'react'
import { supabase } from './supabaseClient'
import './auth.css';

/**
 * Auth component for handling user login via email using Supabase's magic link (OTP).
 * 
 * This component provides a form where users can enter their email and receive a magic link to log in.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Auth component.
 */
export default function Auth() {
  /**
   * State to track the loading status of the login request.
   * 
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(false)
  /**
   * State to store the user's email input.
   * 
   * @type {[string, Function]}
   */
  const [email, setEmail] = useState('')

  /**
   * Handles the form submission for logging in via email.
   * 
   * This function triggers Supabase's `signInWithOtp` method to send a magic link to the provided email address.
   * It also handles the loading state and displays appropriate messages based on the success or failure of the login attempt.
   * 
   * @async
   * @function handleLogin
   * @param {Object} event - The form submission event object.
   */
  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message) // Display the error message if there's an issue
    } else {
      alert('Check your email for the login link!') // Notify the user to check their email
    }
    setLoading(false) // Stop loading after the login attempt
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via magic link with your email below</p>
        {/* Form for email input */}
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            {/* Email input field */}
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)} // Update email state when user types
            />
          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}