import React, { useEffect } from 'react'
import axios from "axios"
import { useDispatch, } from 'react-redux';
import { setProfile, } from '../redux/userSlice';
import { useParams } from 'react-router-dom';

const singleUser = () => {
  const dispatch = useDispatch()
  const { userId } = useParams()
  console.log("User ID from URL:", userId); // Debugging

    useEffect(() => {
      const getProfile = async () => {
        const token = localStorage.getItem("token"); // Ensure token is stored
        console.log(token)
        try {
          const response = await axios.get(
            ` http://localhost:5000/api/users/getProfile/${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // Include cookies or tokens
            }
          );
          console.log("Fetched User Data:", response.data.user); // Debugging
          dispatch(setProfile(response.data.user))
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      getProfile(); // Call the function inside useEffect
    }, [userId,dispatch]); // Empty dependency array to run the effect once on mount
  
    return <div>Check the console for user data.</div>; // Basic return statement
  };
  
  export default singleUser;
