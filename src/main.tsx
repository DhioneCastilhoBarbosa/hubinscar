import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {Toaster} from 'sonner'
import ReactGA from 'react-ga4';
import '@fontsource/roboto';


ReactGA.initialize('G-01JR9K3H3Z');


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position='top-right'/>
    <App />
  </StrictMode>,
)
