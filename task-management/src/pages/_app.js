import '../styles/globals.css';
import { Provider, useDispatch } from 'react-redux';
import store from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setUser, logout } from '../redux/slices/authSlice';

const SESSION_DURATION = 60 * 60 * 1000; 

function SessionHandler() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const expiryTime = localStorage.getItem('expiryTime');
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (expiryTime && Date.now() > Number(expiryTime)) {
        // Session expired
        dispatch(logout());
        router.replace('/login');
      } else if (token && user) {
        dispatch(setUser({ user, token }));
      }
    };

    checkSession();

    const extendSession = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const newExpiryTime = Date.now() + SESSION_DURATION;
        localStorage.setItem('expiryTime', newExpiryTime.toString());
      }
    };

    
    const events = ['click', 'mousemove', 'keydown', 'scroll'];
    events.forEach((event) => window.addEventListener(event, extendSession));

    return () => {
      events.forEach((event) => window.removeEventListener(event, extendSession));
    };
  }, [dispatch, router]);

  return null; 
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SessionHandler />
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}

export default MyApp;
