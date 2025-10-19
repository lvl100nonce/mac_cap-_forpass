import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ChangePassword from './ChangePassword.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChangePassword />} />
        <Route path="/change" element={<ChangePassword />} />
        <Route path="/welcome" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
