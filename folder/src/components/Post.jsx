import React, { useEffect, useState } from 'react'   
import { CiMenuBurger } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { AiTwotoneLike } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import { FaBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setComment, setPosts } from '../redux/postSlice';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import getComment from '../hooks/getComment';
import GetPost from '../hooks/getPost';
import "./App.css"
import { Link } from 'react-router-dom';


const Post = ({post}) => {  
  if (!post) {
    return <p>Loading...</p>;  // Handle undefined post gracefully
  }
  getComment()
  GetPost();
 const posts = useSelector((state)=> state.posts.posts);
 console.log("here are the post related comments",posts.comments)
 const user = useSelector((state)=> state.user.user);
  const dispatch = useDispatch()
  const [text, settext] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setcomment] = useState([]);
  console.log("here is the comment ", comment)
  const [liked, setliked] = useState(post.likes.includes(user._id) || false);
  const [follow, setfollow] = useState(false);
    console.log(liked)
  const [likecounter, setlikecounter] = useState(post.likes.length)
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);
  const comments = useSelector((state)=> state.posts.comments)
  console.log(comments)

  const handlelikeanddislike = async() =>{
    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      console.log(token)
      const response = await axios.put(`https://instagramclone-23.onrender.com/${post._id}/like`,{},
       {  
         headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        withCredentials: true,
      }
      )
      console.log(response.data)
      console.log(response.data.message)
      if(response.data.success){
        if(liked){
          toast.success("user disliked successfully")
        }else{
          toast.success("user liked successfully")
        }
      const updatedlikes = liked ? likecounter-1 : likecounter+1;
      setlikecounter(updatedlikes);
      const postupdateddata = posts.map(p=>
        p._id === post._id ? {
          ...p,
          likes: liked ? p.likes.filter(id=> id !== user.id) : [...p.likes, user.id]
        } : p
      )
      dispatch(setPosts(postupdateddata))
      setliked(!liked)
      }
    } catch (error) {
      toast.error("error in like")
      console.error("Error in liking/disliking the post:", error.message);
    }
  }
  const handlefollowandunfollow = async() =>{
    try {
      const userToFollowId = post.author._id; // ID of the user to follow/unfollow
      const token = localStorage.getItem("token"); // Ensure token is stored
      console.log(token)
      const response = await axios.put(`https://instagramclone-23.onrender.com/follow/${userToFollowId}`,{},
       {  
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token
      },
        withCredentials: true,
      }
      )
      console.log(response.data)
      if(response.data.success){
        toast.success(response.data.message)
        setfollow(!follow)
      }
    } catch (error) {
      toast.error(error)
      console.error("Error in liking/disliking the post:", error.response?.data || error.message);
    }
  }
const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token"); // Ensure token is stored
    console.log(token)
    const response = await axios.delete(`https://instagramclone-23.onrender.com/delete/${post._id}`, {
      headers: {
        'Content-Type': 'application/json', // Ensure the request has the correct content type
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Include cookies or session data
    });
    // Handle successful response
    console.log('Post deleted successfully:', response.data);
    // Add logic to update your frontend state if needed
   
    // Correct way to filter out the deleted post
    const filteredPosts = posts.filter((p) => p._id !== post._id);

    dispatch(setPosts(filteredPosts));
  } catch (error) {
    // Handle errors
    console.error('Error deleting post:', error.response?.data || error.message);
  }
};
const handlecomment = async(e) =>{
  e.preventDefault();
  console.log(text)
  try {
    const token = localStorage.getItem("token"); // Ensure token is stored
    console.log(token)
    const response = await axios.post(`https://instagramclone-23.onrender.com/comment/${post._id}`,{text},{
      headers: {
        'Content-Type': 'application/json', // If you need to specify the content type
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Include cookies with cross-origin requests
    });
    console.log(response.data)
     // Check if the current user is the same as the comment author

    const updateddata = [...comments, response.data.comment];
    const newComment = response.data.comment;
    console.log( "here is new comment",newComment)
    setcomment(updateddata);
     const updatedPost = posts.map((p) => p._id === post._id ? { ...p, comments: [...p.comments, newComment] } : p)
     console.log("updated post date ", updatedPost)
     dispatch(setPosts(updatedPost)) 
    settext("")
    
  } catch (error) {
     // Handle errors (e.g., log error message or show a notification)
     console.error('Error submitting comment:', error);
     // Optionally display an error message to the user
  }
}

  return (
    <>
    <div className='flex'>
    <Link to={"/sidebar"} className='main hidden text-2xl'>
      main section
    </Link>
    <Link to={"/Suggested"} className='maini hidden text-2xl'>
      suggested user
    </Link>
    </div>
     <div className='post body mt-8  w-screen h-auto flex justify-center items-center flex-col text-lg font-semibold'>
      <ToastContainer/>
<div className='posting w-96 flex spacex-6'>
    <img className='imge h-10 rounded-full w-10' src={post.author.profilePhoto} alt="" />
    
    <p className='mt-12'>{post.author.username}</p>
    <div>
    <p className='ml-12 mt-5 text-gray'> caption:{post.caption}</p>
    {
    user.username === post.author.username &&  <button className='mt-12' onClick={handleDelete} type='submit'>delete</button>
    }
    </div>
   
    </div>
    <img className='imga h-96 mt-4 w-96' src={post.images[0]} alt="" />
    <div className=' flex  space-x-8 my-4'>
      <AiOutlineLike style={{color: liked ? "red" : "black", cursor:"pointer"}} onClick={handlelikeanddislike} className='cursor-pointer' size={30}/>
      <span>{likecounter}</span>
      <button onClick={handlefollowandunfollow} className='bg-gray border-2'>{follow ? "Unfollow" : "Follow"}</button>
      <FaRegComment onClick={handleOpen} size={30}/>
      <Dialog className='dialog' open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Write a Comment</DialogTitle>
        <DialogContent> 
          <div className=' flex w-full'>
            <div>
            <img className='h-96 w-96' src={post.images[0]} alt="" />
            </div>
            <div className='flex flex-col justify-between'>
            <div className='h-auto'>
            {
         post.comments.map((text,index)=>(
          <div key={index}>
       <h1>{text.text}</h1>
          </div>
         )
           )}
          </div>
          <div className='flex'>
          <TextField className='h-auto w-52 flex flex-col'
            value={text}
            onChange={(e)=>settext(e.target.value)}
            variant="outlined"
            placeholder="Type your comment here..."
          />
          <button onClick={handlecomment} type="submit" className='border-2 text-center w-20 rounded-mdsm bg-blue-200 ml-20 text-blue-600 font-bold'>Post</button>
          </div>
            </div>
          
          </div>
        
        </DialogContent>
       </Dialog>
      <div>
        <FaBookmark className='ml-48' size={27}/>
      </div>
     <div></div>
     </div>
    </div>
    </>
  )
}

export default Post
