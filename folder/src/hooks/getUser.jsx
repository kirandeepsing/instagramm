import React, { useEffect } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux';
import { setsuggestedUser } from '../redux/userSlice';

const GetUser = () => {
  const dispatch = useDispatch()
    useEffect(() => {
      const getUser = async () => {
        try {
          const token = localStorage.getItem("token"); // Ensure token is stored
        console.log(token)
          const response = await axios.get(
            "https://instagramclone-sxrf.onrender.com/api/users/suggesteduser",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // Include cookies or tokens
            }
          );
          console.log(response.data.user); // Log the response data
          dispatch(setsuggestedUser(response.data.user))
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      getUser(); // Call the function inside useEffect
    }, []); // Empty dependency array to run the effect once on mount
  
    return <div>Check the console for user data.</div>; // Basic return statement
  };
  
  export default GetUser;
