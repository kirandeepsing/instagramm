const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getuserpost, addComment, getComments, deletePost, getAllComments, likepost, dislikepost, getSinglePost, addBookmark, getBookmarkedPosts } = require('../controllers/postcontroller');
const upload = require('../middleware.js/multer'); // Multer middleware for file upload
const protect = require('../middleware.js/authenticated'); // Middleware for authentication

// Route to create a post
router.post('/create', protect, upload.single('image'), createPost);
router.get('/getallpost', getAllPosts);
router.get('/getsingleuser', getuserpost);
router.get('/getsinglpost/:id', getSinglePost);
router.put('/:id/like',protect, likepost);
router.post('/comment/:id',protect, addComment);
router.get('/getcomment/:id', getComments);
router.delete('/delete/:id',protect, deletePost);
router.get('/getallcomments', getAllComments);
router.put('/addbookmark/:id',protect,addBookmark);
router.get('/getbook',protect,getBookmarkedPosts);

module.exports = router;
