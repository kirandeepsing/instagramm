import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import GetPost from '../hooks/getPost'
import { setPosts } from '../redux/postSlice'
import SideBa from './SideBa'
import { Link } from 'react-router-dom'
import Story from './Story'



const Posts = () => {
   GetPost();
  const posts = useSelector((state)=> state.posts.posts);

  // Local state for filtered posts

  console.log(posts)
  return (
    <>
   
      <div className='w-2/6 justify-center items-center flex flex-col ml-96'>
      <div className='h-20 w-[880px] text-center text-4xl sm:hidden hidden bg-slate-800'>
      <h1 className='text-red-50 hidden sm:hidden'>instagram</h1>
    </div>
    <Story/>
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
    <SideBa/>
    </div>
  
    </>
  
  )
}

export default Posts
