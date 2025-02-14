import React, { useState } from 'react'
import singleUser from '../hooks/singleUser'
import { useSelector } from 'react-redux';
import GetPost from '../hooks/getPost';
import { Link } from 'react-router-dom';

const Profile = () => {
  GetPost();
  singleUser();

  const userProfile = useSelector((state)=> state.user.userProfile);
  const suggestedUser = useSelector((state)=> state.user.suggestedUser);
   const posts = useSelector((state)=> state.posts.posts);
     // State for tracking active tab
  const [activeTab, setActiveTab] = useState("posts");
   console.log([posts].length)
  console.log(userProfile)


  return (
    <>
        <div className=' flex sm:flex-col md:flex-row lg:flex-row justify-center items-center space-y-5 border-2 border-b-orange-500
        
           '
           >
      <div className='border-4 rounded-full h-40 w-40 flex justify-between items-center border-lime-200 bg-gray-400'>
      <img src={userProfile?.profilePhoto} alt="" />
      </div>
      <h2 className='font-bold sm:mr-36 md:text-2xl text-2xl ml-40'>{userProfile?.username}</h2>
      <div>
      </div>
      <button className='bg-gray-200 lg:h-16 w-20 text-2xl h-10 w-20 ml-4 rounded-md'>follow</button>
      <button className='bg-gray-200 lg:h-16 w-20 text-2xl h-10 w-20 ml-4 rounded-md'>mesage</button>
      <Link to={"/editProfile"} className='bg-gray-200 sm:h-20 md:h-16 lg:h-16 w-20 text-2xl h-10 text-center w-20 ml-4 rounded-md'>edit Profile</Link>
      </div>
      <div className='flex sm:flex-col text-2xl space-y-8 mt-10 md:flex-row lg:flex-row  ml-60 font-bold '>
      <div>
      <h2 className='ml-8'>posts {posts.length}</h2>
      </div>
      <h2 className='ml-8'> <span>followers</span>{suggestedUser?.followers?.length}</h2>
      <h2 className='ml-8'> <span>following</span> {suggestedUser?.following?.length}</h2>
      </div>
      <div className='ml-96  flex sm:flex-col text-2xl  mt-6'>
      <h2>bio:{userProfile?.bio}</h2>
      <h2>gender:{userProfile?.gender}</h2>  
      </div>
      <hr />
      <div className='flex sm:text-2xl  font-bold'>
        <h1 onClick={()=> setActiveTab("posts")} className={`ml-6 cursor-pointer ${activeTab === "posts" ? "text-blue-500" : "" }`}>posts</h1>
        <h1 onClick={()=> setActiveTab("reels")} className={`ml-6 cursor-pointer ${activeTab === "reels" ? "text-blue-500" : "" }`}>reels</h1>
        <h1 onClick={()=> setActiveTab("bookmarked")} className={`ml-6 cursor-pointer ${activeTab === "bookmarked" ? "text-blue-500" : "" }`}>bookmarked</h1>
      </div>
      <div className='mt-4'>
      {
  activeTab === "posts" && (
    <div className='flex sm:text-2xl'>
      {userProfile?.posts?.length > 0 ? (
        userProfile.posts.map((post, index) => (
          <div key={index}>
            <div>{post.caption}</div>
            <div><img className='h-60 w-60' src={post.images[0]} alt="" /></div>
          </div>
        ))
      ) : (
        <h2>No Posts Available</h2>
      )}
    </div>
  )
}
        {activeTab === "reels" &&
         <div className='ml-96 text-blue-500 flex items-center mt-40 text-3xl font-bold'>the user have no reels please go back !
          </div>}
        {activeTab === "bookmarked" && 
        <div className='ml-96 text-blue-500 flex items-center mt-40 text-3xl font-bold'>Show User Bookmarked Items Here !
          </div>}
      </div>
    </>

  
  )
}

export default Profile
