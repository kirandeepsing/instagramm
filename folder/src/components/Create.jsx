import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const   Create = () => {
    const navigate = useNavigate()
  // State to hold the selected image and caption
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  // Handle the image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
     setImage(file)
  };
  }
   // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to send both image and caption
    const formData = new FormData();
    formData.append('caption', caption);
    if (image) {
      formData.append('image', image); // Append the image file to FormData
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      console.log(token)
      // Replace with your backend API URL
      const response = await axios.post('https://instagramclone-sxrf.onrender.com/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to send the content type as form-data
          Authorization: `Bearer ${token}`,

        },
        withCredentials: true, // Include credentials (cookies/tokens) with the request
      });
      // Handle the response (e.g., show success message)
      console.log('Post created:', response.data);
       if(response.data.message){
                toast.success("user registered successfully")
                setTimeout(() => {
                  navigate("/home");
                }, 2000); // 2000ms (2 seconds) delay
            }
    } catch (err) {
      console.error('Error uploading post:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
          placeholder="Enter caption"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 p-2"
        />
      </div>

      {image && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image Preview</label>
          <img
            src={image}
            alt="Image Preview"
            className="mt-2 max-w-full h-auto rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Post
      </button>
    </form>
  );
};

export default Create
