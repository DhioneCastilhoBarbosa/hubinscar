import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {Toaster} from 'sonner'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position='top-right'/>
    <App />
  </StrictMode>,
)
