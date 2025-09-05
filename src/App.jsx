import {Navigate, Route, Routes} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/home/Home";
import './index.css';
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Resumes from "./pages/resumes/Resumes.jsx";
import CreateResume from "./pages/createResume/CreateResume.jsx";

function App() {
  const { authUser, loading } = useAuth();

  // While auth status is being checked
  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={authUser? <Navigate to={"/"}/> : <Login />}></Route>
        <Route path="/signup" element={authUser? <Navigate to={"/"}/> : <Signup />}></Route>
        <Route path="/your-resumes" element={authUser? <Resumes />: <Navigate to={"/login"} />}></Route>
        <Route path="/create-resume" element={<CreateResume />}></Route>
      </Routes>
    </div>
  )
}

export default App
