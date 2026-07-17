import { Route, Routes,Navigate } from "react-router-dom"
import Home from "./pages/home"
import Signup from "./pages/signup"
import Login from "./pages/login"
import { useContext } from "react"
import { userDataContext } from "./context/UserContext"
import Network from "./pages/network"
import Profile from "./pages/profile"
import Notification from "./pages/notification"

function App() {
let {userData} = useContext(userDataContext)
  return (
   <Routes>
    <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />}/>
    <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup />}/>
    <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />}/>
    <Route path="/network" element={userData ? <Network /> : <Navigate to="/login" />}/>
    <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/login" />}/>
    <Route path="/notification" element={userData ? <Notification /> : <Navigate to="/login" />}/>
   </Routes>
  )
}

export default App
