import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { GameProvider } from './providers/ContextProvider.tsx'
import { AudioPlayerProvider } from './providers/AudioPlayerProvider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <GameProvider>
      <AudioPlayerProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AudioPlayerProvider>
    </GameProvider>
 
 
)
