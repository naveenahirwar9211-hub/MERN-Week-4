const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Database Connection
mongoose.connect('mongodb+srv://testuser:testpass@cluster0.mongodb.net/socialdb?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log(err));

// Post Schema (Database Structure)
const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [String]
});
const Post = mongoose.model('Post', PostSchema);

// --- APIs ---

// 1. Get all Posts
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({_id: -1}); // Show newest first
    res.json(posts);
});

// 2. Create a new Post
app.post('/api/posts', async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json(newPost);
});

// 3. Like a Post
app.post('/api/posts/:id/like', async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
});

// 4. Add a Comment
app.post('/api/posts/:id/comment', async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.comments.push(req.body.comment);
    await post.save();
    res.json(post);
});

// Start Server
app.listen(5000, () => console.log('Social Media Backend running on port 5000'));
