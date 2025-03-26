import React from 'react';
import { Outlet, RouterProvider } from 'react-router';
import { router } from './App';
import './index.css';

export default function Root() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export function ClientEntry() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export function ServerEntry() {
  return <Outlet />;
}