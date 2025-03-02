import React, { useEffect } from 'react';
import GetUser from '../hooks/getUser';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import singleUser from '../hooks/singleUser';

const Right = () => {
  // Calling the custom hook to fetch user data
  GetUser();
  
  const navigate = useNavigate();
  // Accessing the suggested user data from the Redux store
  const suggestedUser = useSelector((state) => state.user.suggestedUser);
  const user = useSelector((state) => state.user.user);


  return (
    <>
     <div className='right w-screen text-center'>
     <h1 className='mb-10 font-bold underline'>suggested users</h1>
  
      {/* Check if suggestedUser is an array */}
      {Array.isArray(suggestedUser) && suggestedUser.length > 0 ? (
        suggestedUser.map((user, index) => (
          <div className='font-bold flex' key={index}>
             <img onClick={()=>navigate(`/profile/${user._id}`)} className='size-12 rounded-full' src={user.profilePhoto} alt="" />
            <p className='ml-10 text-sm'>{user.username}</p>
            {/* Add more fields as needed */}
          </div>
        ))
      ) : (
        <p>No users found.</p> // Handle empty or undefined data
      )}
    </div>
    </>
   
  );
};

export default Right;
