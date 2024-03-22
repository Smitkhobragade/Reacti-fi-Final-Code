import React, { useState, useRef, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [user] = useAuthState(auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutModalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutModalRef.current && !logoutModalRef.current.contains(event.target)) {
        setShowLogoutModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [logoutModalRef]);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        toast.success("Successfully signed out");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  return (
    <header className="flex items-center justify-between p-8 bg-white shadow-lg">
      <h1 className="text-3xl font-bold">My Todo App</h1>
      {user && (
        <div className="relative" ref={logoutModalRef}>
          <img
            src={user?.photoURL}
            alt="profile"
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={toggleLogoutModal}
          />
          {showLogoutModal && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-10">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 border"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
