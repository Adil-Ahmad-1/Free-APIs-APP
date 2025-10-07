import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Weather from './pages/Weather.jsx'
import Metals from './pages/Metals.jsx'
import Movies from './pages/Movies.jsx'
import Quotes from './pages/Quotes.jsx'
import Holidays from './pages/Holidays.jsx'

// Minimal error boundary so GH Pages 404s don’t show the red screen
function RouteError() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Page not found</h1>
      <p>Sorry, we couldn’t find that page. Try the Home page.</p>
      <a href="/Free-APIs-APP/" style={{ color: '#0ea5e9' }}>Go to Home</a>
    </div>
  )
}

const router = createBrowserRouter(
  [
    { path: '/', element: <App />, errorElement: <RouteError /> },
    { path: '/weather', element: <Weather /> },
    { path: '/metals', element: <Metals /> },
    { path: '/movies', element: <Movies /> },
    { path: '/quotes', element: <Quotes /> },
    { path: '/holidays', element: <Holidays /> },
    // Optional explicit catch-all:
    { path: '*', element: <RouteError /> },
  ],
  {
    basename: '/Free-APIs-APP', // <-- IMPORTANT on GitHub Pages
  }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
