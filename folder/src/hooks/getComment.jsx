import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setComment, setPosts } from '../redux/postSlice'


const getComment = () => {
  const dispatch = useDispatch();
useEffect(() => {
    const getComments = async()=>{
      const token = localStorage.getItem("token"); // Ensure token is stored
        console.log(token)
        try {
          const response = await axios.get("https://instagramclone-23.onrender.com/getallcomments", {
            headers: {
              'Content-Type': 'application/json', // Example header
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Allows cookies to be sent with the request
          });
          console.log(response.data.comments)
          dispatch(setComment(response.data.comments));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
    }
 getComments();
}, [])

}

export default getComment
