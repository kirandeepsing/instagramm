const multer = require('multer');

// Set up Multer storage configuration
const upload = multer({
   storage:multer.memoryStorage()
})  // Stores the file in memory as a buffer
module.exports = upload