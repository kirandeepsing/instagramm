import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import Posts from './Posts'
import Right from './Right'

const Home = () => {
  return (
    <>
    <div className="flex">
      <SideBar/>
     
      <Posts/>
      <Right/>
      
    </div>

    </>
  )
}

export default Home
