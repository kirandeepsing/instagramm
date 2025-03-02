import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes , Route} from "react-router-dom"
import Home from './components/Home'
import Posts from './components/Posts'
import Post from './components/Post'
import Register from './components/Register'
import Login from "./components/Login"
import Create from './components/Create'
import Profile from './components/Profile'
import EditProfile from './components/editProfile'
import SideBa from './components/SideBa'
import SuggestedUse from './components/SuggestedUse'
import socket from "./socket";
const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    socket.on("receiveNotification", (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);
  return (
   <>
   <Router>
    {/* Navbar with Notification Bell */}
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "white" }}>
          <h2>My App</h2>

          {/* Notification Bell */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {notifications.length > 0 && (
              <span style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "5px",
                fontSize: "12px",
              }}>
                {notifications.length}
              </span>
            )}
          </div>
        </nav>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div style={{
            position: "absolute",
            top: "50px",
            right: "20px",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            width: "250px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}>
            <h4>Notifications</h4>
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((msg, index) => (
                <div key={index} style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
                  {msg}
                </div>
              ))
            )}
          </div>
        )}

    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/home' element={<Posts/>}/>
      <Route path='/' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/createpost' element={<Create/>}/>
      <Route path='/profile/:userId' element={<Profile/>}/>
      <Route path='/editProfile' element={<EditProfile/>}/>
      <Route path='/sidebar' element={<SideBa/>}/>
      <Route path='/Suggested' element={<SuggestedUse/>}/>
      
    </Routes>
   </Router>
   
   
   
   </>
  )
}

export default App
