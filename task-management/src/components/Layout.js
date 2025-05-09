import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { logout } from '../redux/slices/authSlice';
import { FiLogOut, FiUser, FiSettings, FiBell, FiPlus, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  // Mock notifications data
  const notifications = [
    { id: 1, text: 'Task "Design Review" is due tomorrow', read: false },
    { id: 2, text: 'You have 3 incomplete tasks', read: true },
    { id: 3, text: 'New feature added: Team Collaboration', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Logo and main nav */}
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">TM</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800 hidden sm:inline">TaskManager</span>
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <NavLink href="/dashboard" currentPath={router.pathname}>
                  Dashboard
                </NavLink>
                <NavLink href="/tasks" currentPath={router.pathname}>
                  Tasks
                </NavLink>
              </div>
            </div>

            {/* Right side - User controls */}
            <div className="flex items-center space-x-4">
              {/* Quick Add Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                onClick={() => router.push('/tasks')}
                aria-label="Add new task"
              >
                <FiPlus className="w-5 h-5" />
              </motion.button>


              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user && user.name ? user.name : "Guest"}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                    >
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiUser className="mr-2" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiLogOut className="mr-2" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden ml-2">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  aria-label="Main menu"
                >
                  {isMenuOpen ? (
                    <FiX className="w-5 h-5" />
                  ) : (
                    <FiMenu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-sm"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink href="/dashboard" currentPath={router.pathname} onClick={toggleMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink href="/tasks" currentPath={router.pathname} onClick={toggleMenu}>
                  Tasks
                </MobileNavLink>
                <MobileNavLink href="/profile" currentPath={router.pathname} onClick={toggleMenu}>
                  Profile
                </MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main content with padding to avoid overlap with fixed navbar */}
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

// Reusable NavLink component for desktop
function NavLink({ href, currentPath, children }) {
  const isActive = currentPath === href;
  return (
    <Link href={href} passHref>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer ${
          isActive
            ? 'text-blue-600 border-b-2 border-blue-500'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        {children}
      </motion.div>
    </Link>
  );
}

// Reusable NavLink component for mobile
function MobileNavLink({ href, currentPath, onClick, children }) {
  const isActive = currentPath === href;
  return (
    <Link href={href} passHref>
      <div
        onClick={onClick}
        className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        {children}
      </div>
    </Link>
  );
}