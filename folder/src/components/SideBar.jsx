import React from 'react';
import { FaHome, FaSearch } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { MdExplore, MdOutlineCreateNewFolder } from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { LuMessageSquare } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { IoLogOut } from "react-icons/io5";
import CreatePost from './Create';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Profile from './Profile';

const logos = [
  { icon: <FaInstagramSquare size={50} />, label: "Instagram" },
  { icon: <FaHome />, label: "Home" },
  { icon: <FaSearch />, label: "Search" },
  { icon: <MdExplore />, label: "Explore" },
  { icon: <BsCameraReelsFill />, label: "Reels" },
  { icon: <LuMessageSquare />, label: "Messages" },
  { icon: <IoLogOut />, label: "Logout" },
];  

const SideBar = () => {
  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.user)
  console.log(user)
  const create = ()=>{
  navigate("/createpost")
  }
 
  return (
<>
<div className=" bg-red-600 hidden mt-36 sm:fixed sm:mt-0 text-red-50 sm:!block md:block sm:bg-black md:bg-green-300 h-screen    border-r border-gray-400 w-80 flex-col space-y-6 p-4">
      {logos.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div>{item.icon}</div>
          <span className="text-lg font-medium">{item.label}</span>
        </div>
      ))}
      <div className='flex'>
      <MdOutlineCreateNewFolder/>
      <h2 onClick={create} className='ml-3 text-3xl sm:text-lg md:text-lg sm:text-green-200 cursor-pointer font-bold'>create</h2>
      </div>
      <div className='flex'>
      <ImProfile className='' />
      <h2  onClick={()=>navigate(`/profile/${user.id}`)} className='ml-3 text-2xl sm:text-lg bg-slate-400 sm:bg-orange-400  mb-10 cursor-pointer font-bold'>Profile</h2>
      </div>
      <h2 className=" sm:text-4xl md:text-2xl md:bg-slate-500 sm:bg-red-400">authencticted:
        <br /> {user.username} </h2>
    </div>
</>
 
  );
};

export default SideBar;
