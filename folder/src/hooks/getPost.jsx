import React, { useEffect } from 'react'
import axios from "axios"
import { useDispatch, } from 'react-redux';
import { setPosts } from '../redux/postSlice';

const GetPost= () => {
    const dispatch = useDispatch();  // To dispatch actions
    useEffect(() => {
      const getpost = async () => {
        const token = localStorage.getItem("token"); // Ensure token is stored
        console.log(token)
        try {
          const response = await axios.get(
            "https://your-backend-service.onrender.com/api/posts/getallpost",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // Include cookies or tokens
            }
          );
          console.log(response.data.posts); // Log the response data
          dispatch(setPosts(response.data.posts))
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      getpost(); // Call the function inside useEffect
    }, []); // Empty dependency array to run the effect once on mount
  
    return <div>Check the console for user data.</div>; // Basic return statement
  };
  
  export default GetPost;
