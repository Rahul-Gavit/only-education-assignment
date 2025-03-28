"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/"); // Redirect to the home page
  };

  return (
    <nav className="bg-white p-4 text-white flex justify-between items-center border-b">
      <span className="font-extrabold text-xl text-blue-500">
        ONLY EDUCATION
      </span>{" "}
      {/* App Name */}
      <div className="flex items-center space-x-6">
        {user && (
          <>
            <span className="text-sm font-medium text-blue-500">
              Welcome {user.firstName} {user.lastName} !
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </>
        )}
        <Link
          href="/leaderboard"
          className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
