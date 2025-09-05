import {Navigate, Route, Routes} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/home/Home";
import './index.css';

function App() {
  // const { authUser, loading } = useAuth();

  // // While auth status is being checked
  // if (loading) {
  //   return <p>Loading...</p>; 
  // }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        {/* <Route path="/login" element={authUser? <Navigate to={"/"}/> : <Login />}></Route>
        <Route path="/signup" element={authUser? <Navigate to={"/"}/> : <Signup />}></Route>
        <Route path="/your-resumes" element={authUser? <Resumes />: <Navigate to={"/login"} />}></Route>
        <Route path="/create-resume" element={authUser? <Create />: <Navigate to={"/login"} />}></Route> */}
      </Routes>
    </>
  )
}

export default App
