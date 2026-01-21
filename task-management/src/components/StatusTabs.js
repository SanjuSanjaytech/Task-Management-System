// components/StatusTabs.js
import { Bars3BottomLeftIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function StatusTabs({ currentFilter, onFilter }) {
  const tabs = [
    { status: 'all', label: 'All Tasks', icon: Bars3BottomLeftIcon },
    { status: 'pending', label: 'Pending', icon: ClockIcon },
    { status: 'completed', label: 'Completed', icon: CheckCircleIcon },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.status}
            onClick={() => onFilter(tab.status)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 mr-2 rounded-lg text-sm font-medium ${
              currentFilter === tab.status
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
