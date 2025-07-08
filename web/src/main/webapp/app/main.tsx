import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'

// Add fontawesome CSS (you would need to install and import this in a real project)
// This is a mock comment to indicate that fontawesome would be imported here
// import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)