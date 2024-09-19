# **Podcast Web Application**

A podcast platform built with **React** that allows users to browse podcasts, play episodes, and manage their favorite episodes. The app fetches podcast data from an external API and uses **Supabase** for user authentication and favorites management. Users can log in, listen to podcasts, and store their progress for seamless listening across sessions.

## **Table of Contents**

- [**Podcast Web Application**](#podcast-web-application)
  - [**Table of Contents**](#table-of-contents)
  - [**Features**](#features)
  - [**Installation**](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [**Usage**](#usage)
  - [**Technology Stack**](#technology-stack)
  - [**API Documentation**](#api-documentation)
  - [**Supabase Setup**](#supabase-setup)
    - [Setting up Supabase](#setting-up-supabase)
  - [**License**](#license)

---

## **Features**

- **Responsive Design**: Optimized for desktop and mobile (including iPhone SE).
- **Podcast Library**: Browse and filter through a variety of podcasts.
- **Podcast Details**: View detailed information about podcasts including seasons and episodes.
- **Episode Playback**: Listen to podcast episodes with a persistent audio player.
- **Favorites**: Mark episodes as favorites and access them later from a dedicated favorites page.
- **Authentication**: User authentication powered by Supabase (login via magic link).
- **Progress Saving**: Audio progress is saved to user accounts and synced across devices.
- **Carousel**: Display a list of recommended podcasts in a carousel format on the homepage.
- **Sorting & Searching**: Sort shows by title or date and search for podcasts via a fuzzy search.

---

## **Installation**

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jenique-Oosthuizen/JENOOS272_PTO2309_GroupA_Jenique_Oosthuizen_DWACapstone.git
   ```

2. **Install dependencies**:
   If you're using npm:
   ```bash
   npm install
   ```

   If you're using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root of your project and add the following environment variables:

     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. **Run the app locally**:
   If you're using npm:
   ```bash
   npm start
   ```

   If you're using yarn:
   ```bash
   yarn start
   ```

   The app should now be running at `http://localhost:3000`.

---

## **Usage**

1. **Homepage**:
   - Browse recommended podcasts displayed in the carousel.
   - Search for podcasts using the search bar.
   - Filter podcasts by genres and sort by title or date.

2. **Show Details**:
   - Click on a show to view its seasons and episodes.
   - Play an episode using the embedded audio player.
   - Add episodes to your favorites.

3. **Favorites**:
   - Access the "Favorites" page to view and manage your favorite episodes.

4. **User Account**:
   - Sign in via a magic link sent to your email (powered by Supabase).
   - View and manage your favorite episodes from any device.
   - Audio progress is synced between sessions.

---

## **Technology Stack**

- **React**: Frontend library for building user interfaces.
- **Supabase**: For user authentication, data storage, and audio progress synchronization.
- **Fuse.js**: Fuzzy search for filtering podcast shows.
- **Netlify**: Deployment and hosting platform.
- **API**: [Podcast API](https://podcast-api.netlify.app/) for fetching podcast data.

---

## **API Documentation**

This app uses the [Podcast API](https://podcast-api.netlify.app/) to fetch show data and episodes. The API has the following endpoints:

- **GET /shows**: Fetches all available shows.
- **GET /id/:showId**: Fetches details for a specific show, including seasons and episodes.

---

## **Supabase Setup**

This app uses **Supabase** for authentication and managing user-specific data such as favorite episodes and audio progress.

### Setting up Supabase

1. Sign up for a free [Supabase account](https://supabase.io/).
2. Create a new project and copy the API URL and ANON key into your `.env` file as described in the installation section.
3. Create the following tables in your Supabase project:

   - **user_audio_progress**:
     ```sql
     CREATE TABLE user_audio_progress (
       id serial PRIMARY KEY,
       user_id uuid REFERENCES auth.users(id),
       episode_id text NOT NULL,
       progress_time numeric NOT NULL DEFAULT 0,
       finished boolean DEFAULT false,
       updated_at timestamp NOT NULL DEFAULT NOW()
     );
     ```

   - **favourites**:
     ```sql
     CREATE TABLE favourites (
       id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id uuid REFERENCES auth.users ON DELETE CASCADE,
       episode_id text NOT NULL,
       episode_title text NOT NULL,
       show_id text NOT NULL,
       show_title text NOT NULL,
       season int NOT NULL,
       episode_number int NOT NULL,
       created_at timestamp DEFAULT now()
     );
     ```

4. Add the necessary row-level security (RLS) policies to allow users to manage their own data:
   ```sql
   -- Enable RLS
   ALTER TABLE user_audio_progress ENABLE ROW LEVEL SECURITY;
   ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

   -- Create policies for user-specific access
   CREATE POLICY "Allow user access to their progress" ON user_audio_progress
   FOR SELECT, INSERT, UPDATE, DELETE
   USING (auth.uid() = user_id);

   CREATE POLICY "Allow user access to their favourites" ON favourites
   FOR SELECT, INSERT, UPDATE, DELETE
   USING (auth.uid() = user_id);
   ```

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---