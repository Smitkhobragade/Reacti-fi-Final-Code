import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const signInUser = (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then(() => {
        toast.success("Successfully signed in");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Todo App</h1>
      <button
        onClick={signInUser}
        className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginPage;
