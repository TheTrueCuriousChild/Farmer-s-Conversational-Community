const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");

// ✅ Create a new post
router.post("/createPost", async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({ message: "Content and author are required" });
    }

    const newPost = new CommunityPost({ content, author });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all posts (latest first)
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "name email") // shows basic user info
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Like a post
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body; // userId of liker
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // if already liked, remove (toggle like)
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
