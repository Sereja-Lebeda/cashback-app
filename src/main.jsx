import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { init } from '@telegram-apps/sdk'
import './index.css'
import App from './App.jsx'

// Инициализация Telegram SDK при открытии из Mini App
if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
  init()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
