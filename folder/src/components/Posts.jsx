import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import GetPost from '../hooks/getPost'
import { setPosts } from '../redux/postSlice'
import SideBa from './SideBa'
import { Link } from 'react-router-dom'



const Posts = () => {
   GetPost();
  const posts = useSelector((state)=> state.posts.posts);

  // Local state for filtered posts

  console.log(posts)
  return (
    <>
   
      <div className='w-2/6 justify-center items-center flex flex-col ml-96'>
      <div className='h-20 w-[880px] text-center text-4xl bg-slate-800'>
      <h1 className='text-red-50'>instagram</h1>
    </div>
    
      <div className='flex border'>
        <Link to={"/sidebar"} className='main  sm:hidden sm:text-black text-5xl'>
          main section
        </Link>
        <Link to={"/Suggested"} className='maini ml-8 sm:hidden  text-5xl'>
          suggested user
        </Link>
      </div>
      {
        posts.map((p, index)=>{
          return(
            <div key={index}>
              <div><Post post={p} /></div>
            </div>
          )
        })
      }
       <div className=' border-2 flex-col'>
  
    </div>
    </div>
    </>
  
  )
}

export default Posts
