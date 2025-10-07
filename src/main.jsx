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


const router = createBrowserRouter([
{ path: '/', element: <App /> },
{ path: '/weather', element: <Weather /> },
{ path: '/metals', element: <Metals /> },
{ path: '/movies', element: <Movies /> },
{ path: '/quotes', element: <Quotes /> },
{ path: '/holidays', element: <Holidays /> },
])


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<RouterProvider router={router} />
</React.StrictMode>
)