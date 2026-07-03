import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthHeader from './authComponenets/Header.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    < AuthHeader/>
    < App />
  </StrictMode>,
)
