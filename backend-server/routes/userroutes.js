const express = require('express');
const { registerUser,loginUser,logoutUser, getProfile, toggleFollow,editProfile,getprofile,suggesteduser, getdynamicprofile} = require('../controllers/usercontroller');
const protect = require("../middleware.js/authenticated");
const upload = require('../middleware.js/multer');
const router = express.Router();


router.post('/register',registerUser); // Register a new user
// Login Route
router.post('/login',loginUser);
// Logout Route
router.post('/logout', logoutUser);
router.get('/getProfile/:id', getProfile);
router.put('/follow/:id',protect, toggleFollow);
router.put('/edit',protect,upload.single("profilePhoto"), editProfile);
router.get('/getuser',protect, getprofile);
router.get('/getusers/:id',protect, getdynamicprofile);
router.get('/suggesteduser',protect, suggesteduser);

module.exports = router;