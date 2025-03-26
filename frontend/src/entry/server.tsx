import React from 'react';
import { createStaticHandler, createStaticRouter } from 'react-router';
import { Outlet } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';
import isbot from 'isbot';

// Import the same routes as client
import Dashboard from '../components/dashboard/Dashboard';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import ScheduleView from '../components/schedule/ScheduleView';
import ScheduleChangeForm from '../components/requests/ScheduleChangeForm';
import SettingsForm from '../components/settings/SettingsForm';
import Layout from '../components/layout/Layout';

const routes = [
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
];

export async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const { query, dataRoutes } = createStaticHandler(routes);

  const context = await query(request);

  const router = createStaticRouter(dataRoutes, context);

  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <React.StrictMode>
        <Outlet />
      </React.StrictMode>,
      {
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html');
          resolve(
            new Response(
              `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employee Scheduling</title>
  <link rel="stylesheet" href="/build/index.css">
</head>
<body>
  <div id="root"></div>
  <script src="/build/client.js"></script>
</body>
</html>`,
              {
                headers: responseHeaders,
                status: responseStatusCode,
              }
            )
          );
        },
        onShellError(error) {
          console.error(error);
          reject(
            new Response('Internal Server Error', {
              status: 500,
              headers: { 'Content-Type': 'text/html' },
            })
          );
        },
      }
    );
  });
}
