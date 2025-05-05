"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => (
          <div key={u._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold">{u.name}</h3>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
