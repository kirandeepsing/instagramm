import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate()
     const [bio, setbio] = useState("")
     const [gender, setgender] = useState("")
     const [image, setimage] = useState(null)
     const imagehandler=(e)=>{
        const file = e.target.files[0];
        if(file){
            setimage(file)
        }
     }
     // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to send both image and caption
    const formData = new FormData();
    formData.append('bio',bio );
    formData.append('gender',gender );
    if (image) {
      formData.append('profilePhoto', image); // Append the image file to FormData
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      console.log(token)
      // Replace with your backend API URL
      const response = await axios.put('https://instagramclone-sxrf.onrender.com/api/posts/edit', formData, {
        headers: {
        },
        withCredentials: true, // Include credentials (cookies/tokens) with the request
        Authorization: `Bearer ${token}`,
      });
      // Handle the response (e.g., show success message)
      console.log('Post created:', response.data);
       if(response.data.message){
                toast.success("prfile updated successfully")
                setTimeout(() => {
                  navigate("/home");
                }, 2000); // 2000ms (2 seconds) delay
            }
    } catch (err) {
      console.error('Error uploading post:', err);
    }
  };
     
  return (
 <>
 <form onSubmit={handleSubmit} action="">
 <div className="container flex items-center justify-center flex-col m-4 h-96 border-2 w-96">
    <input className='border-2 h-12 '
     type="text" 
     placeholder='enter your bio here'
     onChange={(e)=>setbio(e.target.value)}
      />
    <input className='border-2 h-12 '
     type="text"
    placeholder='enter you gender here' 
    onChange={(e)=>setgender(e.target.value)}
    />
   
    <input className='border-2 h-12 ' 
    type="file" accept='image*/'
     placeholder='enter you gender here'
     onChange={imagehandler} />
      <button type='submit' className='border-2 bg-white' >submit</button>
 </div>

 </form>
 
 </>
  )
}

export default EditProfile
