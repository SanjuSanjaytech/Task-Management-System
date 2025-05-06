import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboard } from '../redux/slices/taskSlice';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasksAssigned, tasksCreated, overdueTasks, loading, error } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  }, [error]);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assigned Tasks Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Assigned Tasks</h2>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{tasksAssigned.length}</p>
                  <p className="text-sm text-gray-500">Tasks assigned to you</p>
                </div>
              </div>
            </div>

            {/* Created Tasks Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Created Tasks</h2>
                  <p className="text-2xl font-bold text-green-600 mt-1">{tasksCreated.length}</p>
                  <p className="text-sm text-gray-500">Tasks you created</p>
                </div>
              </div>
            </div>

            {/* Overdue Tasks Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Overdue Tasks</h2>
                  <p className="text-2xl font-bold text-red-600 mt-1">{overdueTasks.length}</p>
                  <p className="text-sm text-gray-500">Tasks past due date</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}