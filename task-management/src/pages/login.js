import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, user, error } = useSelector((state) => state.auth);

  // Grid animation
  const [grid, setGrid] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }

    // Initialize grid animation
    const createGrid = () => {
      const columns = Math.floor(window.innerWidth / 50);
      const rows = Math.floor(window.innerHeight / 50);
      return Array.from({ length: columns * rows }).map((_, i) => ({
        id: i,
        active: false
      }));
    };

    setGrid(createGrid());

    const handleResize = () => {
      setGrid(createGrid());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login attempt failed:', error);
      toast.error(error || 'Login failed');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const activateGridItem = (id) => {
    setGrid(grid.map(item => 
      item.id === id ? { ...item, active: true } : item
    ));
    setTimeout(() => {
      setGrid(grid.map(item => 
        item.id === id ? { ...item, active: false } : item
      ));
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      onClick={(e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const col = Math.floor(x / 50);
          const row = Math.floor(y / 50);
          const columns = Math.floor(rect.width / 50);
          const id = row * columns + col;
          if (grid[id]) activateGridItem(id);
        }
      }}
    >
      {/* Modern top control bar */}
      <div className={`w-full py-3 px-6 flex justify-end items-center border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                ☀️
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                🌙
              </motion.div>
            )}
          </button>
          <div className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            TaskManager
          </div>
        </div>
      </div>

      {/* Interactive grid background */}
      <div className="absolute inset-0 grid grid-cols-auto-fill-50 grid-rows-auto-fill-50 pointer-events-none -z-10 rounded-2xl overflow-hidden">
        {grid.map((item) => (
          <div 
            key={item.id}
            className={`border ${
              isDarkMode 
                ? item.active 
                  ? 'border-purple-500' 
                  : 'border-gray-800'
                : item.active
                  ? 'border-blue-300'
                  : 'border-gray-100'
            } transition-colors duration-700`}
          />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${
            isDarkMode 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                TaskManager
              </span>
            </h1>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <div className="text-2xl">📊</div>
            </div>
          </div>

          <p className={`mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Streamline your workflow with our intelligent task management system
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 mb-6 rounded-lg flex items-center ${
                isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}
            >
              <span className="mr-2">⚠️</span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className={`absolute left-0 bottom-0 h-0.5 w-full ${
                activeField === 'email' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : isDarkMode 
                    ? 'bg-gray-600' 
                    : 'bg-gray-200'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                placeholder=" "
                className={`w-full p-4 bg-transparent outline-none ${
                  isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-300'
                }`}
                required
              />
              <label className={`absolute left-4 top-4 transition-all duration-300 pointer-events-none ${
                email || activeField === 'email'
                  ? '-translate-y-7 text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'
                  : isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}>
                Work Email
              </label>
            </div>

            <div className="relative">
              <div className={`absolute left-0 bottom-0 h-0.5 w-full ${
                activeField === 'password' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : isDarkMode 
                    ? 'bg-gray-600' 
                    : 'bg-gray-200'
              }`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField(null)}
                placeholder=" "
                className={`w-full p-4 bg-transparent outline-none ${
                  isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-300'
                }`}
                required
              />
              <label className={`absolute left-4 top-4 transition-all duration-300 pointer-events-none ${
                password || activeField === 'password'
                  ? '-translate-y-7 text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'
                  : isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}>
                Password
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-medium flex items-center justify-center ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
              } shadow-lg transition-all disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Launch Dashboard
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <Link href="/register" className={`text-sm font-medium ${
              isDarkMode 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-blue-600 hover:text-blue-500'
            } transition-colors`}>
              Create new account
            </Link>
  
          </div>
        </motion.div>
      </div>
    </div>
  );
}