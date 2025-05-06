import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from '../redux/slices/authSlice';

export default function Layout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!user && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed navbar with modern styling */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition">
            TaskManager
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/dashboard"
              className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                router.pathname === '/dashboard' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                router.pathname === '/tasks' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              Tasks
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700 font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                  router.pathname === '/dashboard' ? 'font-bold text-blue-600' : ''
                }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/tasks"
                className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                  router.pathname === '/tasks' ? 'font-bold text-blue-600' : ''
                }`}
                onClick={toggleMenu}
              >
                Tasks
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content with padding to avoid overlap with fixed navbar */}
      <main className="pt-20">{children}</main>
    </div>
  );
}