import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter} from 'react-router-dom'
import { GameProvider } from './providers/ContextProvider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  //<GameProvider>
     <React.StrictMode>
      <App />
    </React.StrictMode>,
  //</GameProvider>
 
)
