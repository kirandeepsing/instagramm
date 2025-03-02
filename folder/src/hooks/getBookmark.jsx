import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBookmarks, setComment, setPosts } from '../redux/postSlice'


const getBookmark = () => {
  const dispatch = useDispatch();
useEffect(() => {
    const getBook = async()=>{
      const token = localStorage.getItem("token"); // Ensure token is stored
        console.log(token)
        try {
          const response = await axios.get("http://localhost:5000/api/posts/getbook", {
            headers: {
              'Content-Type': 'application/json', // Example header
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Allows cookies to be sent with the request
          });
          console.log(response.data.bookmarks)
          dispatch(setBookmarks(response.data.bookmarks));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
    }
 getBook();
}, [])

}

export default getBookmark
