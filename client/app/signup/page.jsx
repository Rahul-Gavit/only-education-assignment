"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import learningPic from "/public/learning.svg";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [signupMessage, setSignupMessage] = useState("");
  const [signupError, setSignupError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage("");
    setSignupError("");
    setLoading(true); // Start loading

    if (validateForm()) {
      try {
        const response = await axios.post("/api/signup", formData);

        if (response.status === 201) {
          setSignupMessage(response.data.message);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
          setFormErrors({});
          router.push("/login");
        } else {
          setSignupError(response.data.message || "Signup failed");
        }
      } catch (error) {
        setSignupError(
          error.response?.data?.message || "An unexpected error occurred."
        );
        console.error("Signup error:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setLoading(false); // stop loading if validation fails
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex justify-center items-center gap-x-12 p-8 bg-white rounded shadow-md">
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
            Sign Up
          </h2>
          {signupMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {/* <strong className="font-bold">Success!</strong> */}
              <span className="block sm:inline">{signupMessage}</span>
            </div>
          )}
          {signupError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {/* <strong className="font-bold">Error!</strong> */}
              <span className="block sm:inline">{signupError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-xs font-bold text-gray-700 mb-2"
              >
                First Name:
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={`w-full px-3 py-2 border focus:border-blue-500 border-gray-300 placeholder:text-xs focus:outline-none rounded-lg ${
                  formErrors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-xs font-bold text-gray-700 mb-2"
              >
                Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`w-full px-3 py-2 border focus:border-blue-500 border-gray-300 placeholder:text-xs focus:outline-none rounded-lg ${
                  formErrors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
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
              disabled={loading} // Disable button when loading
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="pt-4 space-x-2">
              <span className="text-sm ">Already have an account?</span>
              <Link href="/login">
                <span className="text-sm underline">Sign In</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
