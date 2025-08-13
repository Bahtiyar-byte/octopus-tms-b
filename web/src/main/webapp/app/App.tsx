import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import router from './routes'
import './App.css'

function App() {

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#22c55e', // Green background for success
            },
          },
          error: {
            style: {
              background: '#ef4444', // Red background for errors
            },
            duration: 4000,
          }
        }}
      />
    </ErrorBoundary>
  )
}

export default App