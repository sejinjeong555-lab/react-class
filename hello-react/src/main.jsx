import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import{ BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

import Login from './login.jsx'
import App from './App.jsx'
import Grade from './Grade.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route
      Path="/"
      element={<Login />}
      />
      <Route
      path="/profile" 
      element={<App/>}
      />
      <Route
      path="/grade"
      element={<Grade/>}
      />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
