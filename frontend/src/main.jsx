import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Configure axios base URL for production
if (import.meta.env.PROD) {
    axios.defaults.baseURL = import.meta.env.VITE_API_TARGET || 'https://arodoc-backend.onrender.com'
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
