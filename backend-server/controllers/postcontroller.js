const Post = require('../models/post');
const cloudinary = require('../controllers/cloudenary');
const sharp = require('sharp');
const upload = require('../middleware.js/multer'); // Multer middleware for file upload
const User = require('../models/userModel'); // Multer middleware for file upload
const Comment = require('../models/comment');

// Create a post
const createPost = async (req, res) => {
  const { caption } = req.body;
  const imageFile = req.file; // Image uploaded by user
  const authorId = req.user.id;
  let cloud;

  if (!imageFile) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    // Step 1: Process the image with Sharp (resize, etc.)
    const processedImage = await sharp(imageFile.buffer)
      .resize(800, 800) // Resize to 800x800
      .jpeg({ quality: 90 }) // Convert image to JPEG format
      .toBuffer();

    // Step 2: Convert image buffer to base64 URI
    const fileuri = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

    // Step 3: Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(fileuri, {
      folder: 'profilephotos',
      resource_type: 'image',
    });

    // Step 4: Save the post in the database
    const newPost = await Post.create({
      caption,
      images: cloudinaryResponse.secure_url, // Cloudinary URL
      author: authorId,
    });
    // saving the user to the database
    const user = await User.findById(authorId)
    if (user) {
      user.posts.push(newPost._id)
      await user.save()
    }

    await newPost.populate({ path: "author", select: "-password" })

    return res.status(201).json({
      message: "post created succesfully",
      newPost,
      success: true
    })

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-password") // Exclude password from result
      .populate({ path: "author", select: "username profilePhoto" }) // Populate author details
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Sort comments by newest first
        populate: {
          path: "author",
          select: "username profilePhoto",
        },
      });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
      success: false,
    });
  }
};
const deletePost = async (req, res) => {
  const postId = req.params.id;
  const authorid = req.user.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }


    if (post.author.toString() !== authorid) {
      return res.status(404).json({ error: 'unloggined user cannot delete the post' });
    }
    await Post.findByIdAndDelete(postId);

    // remove the post id from the use schmea
    let user = await User.findById(authorid);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    // delete the associated comments;
    await Comment.deleteMany({ post: postId });
    res.status(200).json({ message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete the post and comments' });
  }
};

const getuserpost = async (req, res) => {
  try {
    const userid = req.user.id
    const posts = await Post.find({ author: userid })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-password") // Exclude password from result
      .populate({ path: "author", select: "username profilePhoto" }) // Populate author details
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Sort comments by newest first
        populate: {
          path: "author",
          select: "username profilePhoto",
        },
      });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
      success: false,
    });
  }
};
const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id
    const posts = await Post.findById(postId)
    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
      success: false,
    });
  }
};

const likepost = async (req, res) => {
  try {
    const userId = req.user.id; // Get authenticated user ID
    const postId = req.params.id; // Get post ID from route params

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "user id is not defined"
      })
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
      // Remove like
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      return res.status(200).json({ success: true, message: 'Like removed' });
    }


    // Add like
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });
    return res.status(200).json({
      success: true,
      message: "user liked successfully"
    })

  } catch (error) {
    console.error('Error in toggleLike:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while toggling like',
      error: error.message,
    });
  }
};
const dislikepost = async (req, res) => {
  try {
    const userId = req.user.id; // Get authenticated user ID
    const postId = req.params.id; // Get post ID from route params

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the user has already liked the post
    await post.updateOne({ $pull: { likes: userId } })
    await post.save();
    res.status(501).json({
      success: true,
      message: "user disliked successfully"
    })
  } catch (error) {
    console.error('Error in toggleLike:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while toggling like',
      error: error.message,
    });
  }
};
const addComment = async (req, res) => {
  try {
    const { text } = req.body; // Extract text from req.body
    const author = req.user?.id; // Authenticated user ID
    const postid = req.params.id; // Post ID from params

    // Validate text
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required."
      });
    }

    // Find the post
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "The post is not found. Try again later."
      });
    }

    // Validate user
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The user is not found. Try again later."
      });
    }

    // Create the comment object (subdocument in Post model)
    const comment = await Comment.create({
      text,
      author: user._id,
      post,
      createdAt: new Date()
    });

    post.comments.push(comment._id);

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
const getComments = async (req, res) => {
  try {
    const postId = req.params.id; // Extract post ID from params

    // Find the post with comments populated
    const post = await Post.findById(postId)
      .populate({
        path: 'comments',
        select: 'text author username createdAt', // Fields to include from comments
        populate: {
          path: 'author',
          select: 'username email profilePhoto' // Populate user details
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'The post is not found.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully.',
      comments: post.comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
const getAllComments = async (req, res) => {
  try {
    // Fetch all comments from the database
    const comments = await Comment.find().populate('author', 'username profilePhoto').populate('post', 'caption images');

    // Send success response
    res.status(200).json({
      message: "Comments retrieved successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error retrieving comments:", error);

    // Send error response
    res.status(500).json({
      message: "Server error while retrieving comments",
      success: false,
      error: error.message,
    });
  }
};
const addBookmark = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Fetch post and user
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the post is already bookmarked
    const alreadyBookmarked = user.bookmarks.includes(post._id);

    if (alreadyBookmarked) {
      await User.findByIdAndUpdate(userId, { $pull: { bookmarks: post._id } }, { new: true });
      return res.status(200).json({
        message: "Post removed from bookmarks",
        success: true,
      });
    }

    // Add the bookmark
    await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: post._id } }, { new: true });

    res.status(200).json({
      message: "Post bookmarked successfully",
      success: true,
    });
    await user.save()

  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getBookmarkedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user with populated bookmarks
    const user = await User.findById(userId).populate("bookmarks",);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, bookmarks: user.bookmarks });

  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


module.exports = { createPost, getAllPosts, getuserpost, addComment, getComments, deletePost, getAllComments, likepost, dislikepost, getSinglePost, addBookmark, getBookmarkedPosts };
