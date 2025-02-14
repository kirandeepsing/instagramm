const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("../controllers/cloudenary")
const getdatauri = require("../datauri")


// ✅ Register User
const registerUser = async (req, res) => {
    try {
        const { username, email, password, followers, following, posts, profilePhoto,gender,bio } = req.body;

        // 🔹 Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, Email, and Password are required.' });
        }

        // 🔹 Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // 🔹 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔹 Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            followers: followers || [], // Default to empty array
            following: following || [], // Default to empty array
            posts: posts || [],         // Default to empty array
            profilePhoto: profilePhoto || 'https://via.placeholder.com/150',
            gender:gender,
            bio:bio,
        });
        await newUser.save()

        // 🔹 Respond with user details (exclude password)
        res.status(201).json({
            message:"user registered successfully",
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePhoto: newUser.profilePhoto,
            gender:gender,
            bio:bio,
            createdAt: newUser.createdAt
        });

    } catch (error) {
        console.error('Error in registerUser:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Compare password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create JWT token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the JWT token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Can't be accessed from JavaScript (for security reasons)
            maxAge: 3600 * 1000, // 1 hour
        });

        res.status(200).json({
            token,
            message: 'Login successful',
            user: {
                token:token,
                id:user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
        },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
// Logout User
const logoutUser = (req, res) => {
    // Clear the JWT token from the cookie
    res.cookie('token', '', {
        httpOnly: true,  // Ensures the cookie can't be accessed via JavaScript
        expires: new Date(0),  // Set an expired date to remove the cookie
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

const getProfile = async(req,res)=>{
try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("bookmarks")
    .select("-password")
    .populate({path:"posts", select:"author caption images likes comments",})
    return res.status(200).json({
        message:"user retireived successfully",
        success:true,
        user:{
            userid:user.id,
            username:user.username,
            useremail:user.email,
            profilePhoto: user.profilePhoto,
            posts:user.posts,
            bio:user.bio,
            gender:user.gender,
            userbookmarks:user.bookmarks
        }
    })
} catch (error) {
    console.log(error.message)
}
}
// suggeteed user 
const suggesteduser = async(req,res) =>{
    try {
        const userId = req.user.id;
    if(!userId){
        res.status(401).json({
            message:"userid is no defined"
        })
    }
    const user = await User.find({
        _id:{$ne:userId}
    }).select("-password");


res.status(200).json({
    message:"suggested user fethced successfully",
    user
})
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message:"suggested user not found",
        })
    }
    
}
const toggleFollow = async(req,res) =>{
    try {
        const maikhud = req.user.id;
        const jiskofollowkrunga = req.params.id;


    if (maikhud === jiskofollowkrunga) {
        return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }
 
    if(!maikhud){
        return res.status(400).json({ success: false, message: "You are khud not found" });
    }
    if(!jiskofollowkrunga){
        return res.status(400).json({ success: false, message: "params wala user nahi mila" });
    }
    const currentuser = await User.findById(maikhud);
    let dusrauser = await User.findById(jiskofollowkrunga);
     const alreadyfollowing = await currentuser.following.includes(jiskofollowkrunga);
     if(alreadyfollowing){
       await User.findByIdAndUpdate(maikhud,{
            $pull:{following:jiskofollowkrunga}
        });
       await User.findByIdAndUpdate(jiskofollowkrunga,{
            $pull:{followers:maikhud}
        }) 
        return  res.status(200).json({
            success:true,
            message:"the user have been removed "
         })
     }else{
       await User.findByIdAndUpdate(maikhud,{
            $addToSet:{following:jiskofollowkrunga}
        })
       await User.findByIdAndUpdate(jiskofollowkrunga,{
            $addToSet:{followers:maikhud}
        })
     }

     return res.status(200).json({
        success:true,
        message:"the user have been followed"
     })
        
    } catch (error) {
        console.log(error, "there is and internal server error")
    }

}
  const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, gender } = req.body;
        const profilePhoto = req.file;
          // Find the user by ID
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
        let cloudresponse;
 
        // Handle profile photo upload to Cloudinary
        if (profilePhoto) {
            try {
                const fileuri = getdatauri(profilePhoto);
                cloudresponse = await cloudinary.uploader.upload(fileuri,{
                    folder:"profile photos",
                    resource_type:"image"
                });
                console.log('Cloudinary Upload Response:', cloudresponse);
                console.log('Cloudinary Config:', cloudinary.config());

            } catch (cloudError) {
                console.error('Cloudinary Upload Error:', cloudError);
                return res.status(500).json({
                    message: 'Failed to upload profile photo to Cloudinary',
                    error: cloudError.message,
                });
            }
        }

        // Update user fields if provided
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePhoto && cloudresponse?.secure_url) user.profilePhoto = cloudresponse.secure_url;

        // Save updated user
        await user.save();

        console.log('Updated User:', user);

        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            user: {
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                bio: user.bio,
                gender: user.gender,
            },
        });

    } catch (error) {
        console.error('Edit Profile Error:', error);
        return res.status(500).json({
            message: 'Something went wrong while updating the profile',
            error: error.message,
        });
    }
};
const getprofile = async(req,res) =>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("posts" ).populate("bookmarks");
        res.status(200).json({
            message:"user retrieved successfully",
            user:{
                id:user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                bio: user.bio,
                gender: user.gender,
                followers:user.followers,
                following:user.following,
                bookmarks:user.bookmarks
                
            }
        })
        
    } catch (error) {
        console.error('Edit Profile Error:', error);
        return res.status(500).json({
            message: 'Something went wrong while updating the profile',
            error: error.message,
        });
    }

}
const getdynamicprofile = async(req,res) =>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate("posts" );
        res.status(200).json({
            message:"user retrieved successfully",
            user:{
                id:user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                bio: user.bio,
                gender: user.gender,
                followers:user.followers,
                following:user.following
            }
        })
        
    } catch (error) {
        console.error('Edit Profile Error:', error);
        return res.status(500).json({
            message: 'Something went wrong while updating the profile',
            error: error.message,
        });
    }

}


module.exports = {registerUser,loginUser,logoutUser,getProfile,toggleFollow,editProfile,getprofile,suggesteduser,getdynamicprofile};