import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global CSS

// Import ClerkProvider
import { ClerkProvider } from '@clerk/clerk-react';

// Get your publishable key from environment variables
// For Vite:
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// For Create React App:
// const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Throw an error if the key is not set, good for debugging
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from Clerk. Make sure to set VITE_CLERK_PUBLISHABLE_KEY (or REACT_APP_CLERK_PUBLISHABLE_KEY) in your .env file.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      // Optional: Specify where to redirect after sign-in/sign-up/sign-out
      // You can also manage these in your Clerk dashboard settings
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);