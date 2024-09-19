import { createClient } from '@supabase/supabase-js'

/**
 * The URL of the Supabase project, which is pulled from the environment variables.
 * 
 * @constant {string}
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * The public anonymous key for the Supabase project, also pulled from the environment variables.
 * This key allows access to the Supabase API for public operations.
 * 
 * @constant {string}
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * The Supabase client, initialized with the project URL and the anonymous key.
 * This client is used to interact with Supabase services such as authentication, database, and storage.
 * 
 * @constant {Object}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)