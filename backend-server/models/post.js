const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    caption: {
        type: String,
        trim: true,
    },
    images: [
        {
            type: String, // URL of images
            required: false
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
}, {
    timestamps: true // Automatically add createdAt and updatedAt
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
