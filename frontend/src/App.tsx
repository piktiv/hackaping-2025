import React from 'react';
import { Link, outlet, createBrowserRouter } from 'react-router';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import SchedulePage from './pages/SchedulePage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';

export const router = createBrowserRouter({
  path: '/',
  element: <outlet />,
  children: [
    {
      path: '/',
      element: <DashboardPage />
    },
    {
      path: '/employees',
      element: <EmployeesPage />
    },
    {
      path: '/employees/new',
      element: <EmployeeFormPage />
    },
    {
      path: '/employees/:employeeNumber',
      element: <EmployeeFormPage />
    },
    {
      path: '/schedule',
      element: <SchedulePage />
    },
    {
      path: '/requests',
      element: <RequestsPage />
    },
    {
      path: '/settings',
      element: <SettingsPage />
    },
    {
      path: '*',
      element: (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="mb-4">The page you're looking for doesn't exist.</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Dashboard
          </Link>
        </div>
      )
    }
  ]
});