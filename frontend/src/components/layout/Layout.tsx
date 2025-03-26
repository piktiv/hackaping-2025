import React, { ReactNode } from 'react';
import { Link } from 'react-router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Employee Scheduling System</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:underline">Dashboard</Link>
                </li>
                <li>
                  <Link to="/employees" className="hover:underline">Employees</Link>
                </li>
                <li>
                  <Link to="/schedule" className="hover:underline">Schedule</Link>
                </li>
                <li>
                  <Link to="/requests" className="hover:underline">Requests</Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:underline">Settings</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-100 text-center py-4 border-t">
        <p className="text-gray-600 text-sm">
          Employee Scheduling System &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Layout;