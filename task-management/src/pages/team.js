import { useSelector } from 'react-redux';
import Layout from '../components/Layout';

export default function TeamPage() {
  const { user } = useSelector((state) => state.auth);

  // Mock team data (filtered to show only the logged-in user)
  const teamMembers = [
    {
      id: user?.id, // Assuming user.id is available from auth state
      name: user?.name || 'Unknown User',
      email: user?.email || 'unknown@example.com',
    },
  ].filter((member) => member.id === user?.id); // Show only the logged-in user

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="mt-2 text-sm text-gray-600">
              View your account details
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <li key={member.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            You
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                No user data available.
              </li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}