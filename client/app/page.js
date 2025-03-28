import React from "react";
import Link from "next/link";
import onlineTest from "/public/online_test.svg";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-col md:flex-row justify-center items-center gap-y-8 md:gap-x-16 bg-white p-8 md:p-12 rounded-xl shadow-lg w-full md:w-4/5 max-w-4xl">
        <div className="flex-shrink-0 hidden md:block">
          <Image
            src={onlineTest}
            alt="Online Test Illustration"
            width={300}
            height={300}
            className=""
          />
        </div>
        <div className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 md:mb-8 leading-tight">
            Formalize Your Learning with Structured Quizzes
          </h1>
          <p className="text-gray-700 mb-8 md:mb-10 leading-relaxed">
            Engage in meticulously designed quizzes to enhance your knowledge
            and analytical skills. Our platform provides a professional
            environment for intellectual growth and development.
          </p>
          <div className="flex flex-col sm:flex-row justify-start gap-y-4 sm:gap-x-6">
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out w-full sm:w-auto">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out w-full sm:w-auto">
                Sign Up
              </button>
            </Link>
          </div>
          <div className="mt-8 md:mt-12">
            <p className="text-sm text-gray-500">
              Join our community to pursue structured learning and intellectual
              rigor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
