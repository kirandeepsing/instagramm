const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post reference is required']
    },
    text: {
        type: String,
        required: [true, 'Content is required']
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
