export default function TaskCard({ task }) {
    return (
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <p>{task.description}</p>
        <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        <p className="text-sm">Status: {task.status}</p>
      </div>
    );
  }
  