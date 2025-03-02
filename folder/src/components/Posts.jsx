import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import GetPost from '../hooks/getPost'
import { setPosts } from '../redux/postSlice'
import SideBa from './SideBa'



const Posts = () => {
   GetPost();
  const posts = useSelector((state)=> state.posts.posts);

  // Local state for filtered posts

  console.log(posts)
  return (
    <>
      <div className='w-2/6 justify-center items-center flex flex-col ml-96'>
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
