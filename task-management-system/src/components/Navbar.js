"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">Task Manager</div>
      {token && (
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/tasks" className="hover:underline">Tasks</Link>
          <Link href="/users" className="hover:underline">Users</Link>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      )}
    </nav>
  );
}
