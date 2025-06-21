import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from "./app";
import Home from './home/home';
import Authentication from './security/authentication';
import PasswordResetStart from './security/passwordReset-start';
import PasswordResetComplete from './security/passwordReset-complete';
import Error from './error/error';


export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        { path: '', element: <Home /> },
        { path: 'login', element: <Authentication /> },
        { path: 'passwordReset/start', element: <PasswordResetStart /> },
        { path: 'passwordReset/complete', element: <PasswordResetComplete /> },
        { path: 'error', element: <Error /> },
        { path: '*', element: <Error /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
