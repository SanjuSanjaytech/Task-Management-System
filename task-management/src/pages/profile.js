import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout'; // Adjust path as needed

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserName(parsedUser.name || '');
        setUserEmail(parsedUser.email || '');
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-50 sm:px-6 sm:py-6 md:py-25">
        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-gray-800">👤 User Profile</h2>
          <div className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">{userName || 'N/A'}</p>
              </div>
            </div>
            {/* Email */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <EnvelopeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">{userEmail || 'N/A'}</p>
              </div>
            </div>
          </div>
          {/* Decorative Line */}
          <div className="mt-6 sm:mt-10 border-t border-dashed border-gray-300"></div>
          {/* Footer */}
          <p className="mt-4 sm:mt-6 text-xs text-gray-400 text-center">Your profile details are private and secure 🔒</p>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;