"use client";
import React, { useState } from "react";
import Image from "next/image";
import learningPic from "/public/learning.svg";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (validateForm()) {
      try {
        const response = await axios.post("/api/login", formData); // Assuming /api/login

        if (response.status === 200) {
          // Store token and user data (if needed)
          localStorage.setItem("token", response.data.token); // Store token
          localStorage.setItem("user", JSON.stringify(response.data.user)); //store user data
          router.push("/dashboard"); // Redirect to dashboard
        } else {
          setLoginError(response.data.message || "Login failed");
        }
      } catch (error) {
        setLoginError(
          error.response?.data?.message || "An unexpected error occurred."
        );
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex justify-center items-center gap-x-12 bg-white p-8 rounded shadow-md">
        <div>
          <Image
            src={learningPic}
            alt="Picture of the author"
            width={350}
            automatically
            provided
            height={350}
          />
        </div>
        <div className="w-72 bg-white md:w-80">
          <h2 className="text-xl text-blue-500 font-extrabold mb-4 text-center">
            Login
          </h2>
          {loginError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{loginError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-700 mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border focus:border-blue-500 border-gray-300 placeholder:text-xs focus:outline-none rounded-lg ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border focus:border-blue-500 border-gray-300 placeholder:text-xs focus:outline-none rounded-lg ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`bg-blue-600 w-full font-bold text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
            <div className="pt-4 space-x-2">
              <span className="text-sm ">Don't have an account?</span>
              <Link href="/signup">
                <span className="text-sm underline">Sign up</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
