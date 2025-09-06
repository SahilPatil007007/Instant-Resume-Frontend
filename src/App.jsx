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
  const { user, loading } = useAuth();

  // While auth status is being checked
  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={user? <Navigate to={"/"}/> : <Login />}></Route>
        <Route path="/signup" element={user? <Navigate to={"/"}/> : <Signup />}></Route>
        <Route path="/your-resumes" element={user? <Resumes />: <Navigate to={"/login"} />}></Route>
        <Route path="/create-resume" element={user? <CreateResume />: <Navigate to={"/login"} />}></Route>
        <Route path="/edit-resume/:id" element={user? <CreateResume />: <Navigate to={"/login"} />}></Route>
      </Routes>
    </div>
  )
}

export default App
