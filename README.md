# HelloIndian - AI Trip Planner

**Demo Video**: [Watch the Demo Video](https://drive.google.com/file/d/1acYnOpCbX9gNbpPkvia7_0qUPZ_HROuO/view?usp=share_link)

A premium, interactive, day-by-day AI travel itinerary planner focusing on travel destinations in India. Users can describe their dream Indian vacation in free-form text, configure filters (duration, travel vibe, destination), and receive a highly detailed, stateful timeline. The app allows users to interactively expand, edit, add, delete, and reorder stops via click actions or drag-and-drop.

Built using **React (functional components, hooks)**, **Express**, and **Groq (Llama 3.3 70B)** with native JSON mode.

---

## Technical Features

1. **Secure API Key Management**: The model calls are routed through a secure Express backend. No API keys are shipped to the browser, preventing credential exposure.
2. **Strict Structured JSON Schema**: Uses the Gemini API's native `responseSchema` configuration. This guarantees that the AI output always returns in the correct JSON format, eliminating common layout breakage or parsing crashes.
3. **Resilient Failure Handling**:
   - Captures invalid API key states and reports setup instructions.
   - Cleans markdown fences (` ```json `) automatically in case of minor model formatting anomalies.
   - Handles network timeouts (aborts requests taking longer than 35 seconds).
4. **Race Condition Prevention**: Employs an `AbortController` and requests IDs. If a user triggers a second itinerary request before the first returns, the stale request is cancelled immediately. Older responses can never overwrite a newer state.
5. **Interactive Itinerary Mutations**:
   - **Expand/Collapse**: Details like description, tips, and direct Google Maps search links are toggleable.
   - **Edit Inline**: Edit stop title, time, duration, cost, category, description, and tips directly.
   - **Reorder Stops**: Move stops up/down within a day, or drag-and-drop to place them at a specific position.
   - **Move Between Days**: Instantly migrate any stop to another day using a simple drop-down target.
   - **Add/Delete**: Add custom activities or remove stops.
6. **Local Trip History**: Saves current and past itineraries in browser `localStorage`, allowing users to build a collection of plans.
7. **Premium Glassmorphic UI**: High-end dark theme styling with backdrop blurs, neon gradients, micro-animations, custom scrollbars, and full responsive alignment for mobile screens.

---

## Project Setup & Running

### Prerequisites
- Node.js (version 18 or higher recommended; v22.17.0 is validated)
- A Groq API Key from [Groq Console](https://console.groq.com/)

### 1. Install Dependencies
Run the following command at the root of the project to install all dependencies for both the React frontend and the Express backend:
```bash
npm install
```

### 2. Configure API Key
Create a `.env` file in the root directory `/Users/abhinavbhadoriya/HelloIndian` and add your Groq API Key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the Application
Start the frontend and backend servers in parallel with a single command:
```bash
npm run dev
```
- **React Frontend (Vite)**: Runs on `http://localhost:5173`
- **Express Backend**: Runs on `http://localhost:3001` (all API requests are automatically proxied via Vite config).

To build the client bundle for production, run:
```bash
npm run build
```

---

## AI-Usage Note
This project uses **Groq Llama 3.3 70B** (via `api.groq.com` REST endpoint). 
During development, the AI was used for:
- Mapping the custom JSON schema layout parameters.
- Drafting initial UI styling structures and glassmorphism themes.
- Generating creative travel-themed quotes for the loading state spinner.

---

## Known Limitations & Edge Cases
1. **API Rate Limits**: The Groq API free tier has rate limits. Frequent queries may return a rate limit error. The UI handles this error and displays it gracefully.
2. **Browser Storage Caps**: Local storage allows ~5MB of data. While itineraries are light, keeping dozens of detailed multi-day trips might hit storage limits.
3. **No Database Sync**: Trip changes are saved locally in the user's browser. If the browser cache is cleared, saved trips will be lost.

---

## Time Spent
- **Total Time Spent**: ~4.5 hours
  - *Backend Setup & Gemini API Structured Output Integration*: 1.5 hours
  - *State Mutation Handlers (Reorder, Day Migration, Inline Edits)*: 1.5 hours
  - *UI Layout & Vanilla Glassmorphic CSS Styling*: 1.0 hours
  - *Failure State Verification & Race Condition Testing*: 0.5 hours
