import "./App.css";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for ToastContainer
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {!user ? <LoginPage /> : <HomePage />}
      <ToastContainer /> {/* Include ToastContainer here */}
    </div>
  );
}

export default App;
