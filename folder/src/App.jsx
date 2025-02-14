import React from 'react'
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
const App = () => {
  return (
   <>
   <Router>
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
