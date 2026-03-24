# Movie Explorer — CPSC 349 Homework 3

A React app that fetches movies from the TMDB API and lets you search, sort, and paginate through them.

## Setup

### 1. Get a TMDB API Key
- Sign up at https://www.themoviedb.org/
- Go to Settings → API → Request an API Key
- Copy your **API Key (v3 auth)**

### 2. Add your API Key
Open `src/App.js` and replace `YOUR_TMDB_API_KEY` with your actual key:
```js
const API_KEY = 'your_actual_key_here';
```

Or better — use an environment variable:
- Create a `.env` file in the project root:
  ```
  REACT_APP_TMDB_KEY=your_actual_key_here
  ```
- Update `App.js`:
  ```js
  const API_KEY = process.env.REACT_APP_TMDB_KEY;
  ```

### 3. Install & Run
```bash
npm install
npm start
```
Open http://localhost:3000 in Chrome.

### 4. Build for Deployment
```bash
npm run build
```
Deploy the `build/` folder to Netlify, Vercel, or GitHub Pages.

## Features
- 🎬 Fetches 20 movies per page from TMDB (now playing / search)
- 🔍 Search movies by title
- 📅 Sort by release date (asc/desc) or rating (asc/desc)
- ⬅️ ➡️ Previous / Next pagination with current page number
