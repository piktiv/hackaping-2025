import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';

// Import the pages
import Dashboard from '../components/dashboard/Dashboard';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import ScheduleView from '../components/schedule/ScheduleView';
import ScheduleChangeForm from '../components/requests/ScheduleChangeForm';
import SettingsForm from '../components/settings/SettingsForm';
import Layout from '../components/layout/Layout';

// Import CSS
import '../index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/employees',
    element: <Layout><EmployeeList /></Layout>,
  },
  {
    path: '/employees/new',
    element: <Layout><EmployeeForm /></Layout>,
  },
  {
    path: '/employees/:employeeNumber',
    element: <Layout><EmployeeForm /></Layout>,
  },
  {
    path: '/schedule',
    element: <Layout><ScheduleView /></Layout>,
  },
  {
    path: '/requests',
    element: <Layout><ScheduleChangeForm /></Layout>,
  },
  {
    path: '/settings',
    element: <Layout><SettingsForm /></Layout>,
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard
        </a>
      </div>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);