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
  { icon: <FaHome className='size-24' />,  label: "" },
  { icon: <BsCameraReelsFill className='size-20' />, label: "" },
];  

const SideBa = () => {
  const navigate = useNavigate()
  const user = useSelector((state)=> state.user.user)
  console.log(user)
  const create = ()=>{
  navigate("/createpost")
  }
 
  return (
<>
<div className="sideba sticky bottom-0 h-[100px] border-red-950 bg-white w-[900px] text-3xl flex justify-between  border-2 sm:!hidden">
      {logos.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div>{item.icon}</div>
          <span className="">{item.label}</span>
        </div>
      ))}
      <div className='flex'>
      <MdOutlineCreateNewFolder  onClick={create} className='size-24'/>
      <h2 className=''></h2>
      </div>
      <div className='flex'>
      <ImProfile onClick={()=>navigate(`/profile/${user.id}`)} className='size-20' />
      <h2  className='ml-3 mb-10 text-lg cursor-pointer font-bold'></h2>
      </div>
    </div>
</>
 
  );
};

export default SideBa;
