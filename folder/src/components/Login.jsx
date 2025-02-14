import React, { useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";


const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
        const response = await axios.post("https://instagramclone-sxrf.onrender.com/api/users/login",formData,{
            headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true, // Include cookies or tokens
        });
        console.log(response.data.user)
        dispatch(setUser(response.data.user))
        if(response.data.message){
            toast.success("user login succesfully")
          setTimeout(() => {
            navigate("/home")
          }, 2000);
        }
        
    } catch (error) {
        console.log("error user is not registred ")
        if(error){
            toast.error("there is problem in registering the user")
        }
        
    }
    // Add API call for registration here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
           <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <Link className="ml-40 mt-8" to={"/"}>Register</Link>
      </form>
    </div>
  );
};

export default Register;
