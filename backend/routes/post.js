const express = require('express');
const router = express.Router();

const Redis = require('redis');
const redisClient = Redis.createClient();
const DEFAULT_EX = 3600; // time before redis cache clears

const Post = require('../models/post');
const User = require('../models/user');

// creating a new post
router.post('/', async (req, res) => {
	// make sure user exists prior to creating a post

	// NEED A TRY CATCH HERE!!!!!!
	const userRef = await User.findById(req.body.user);

	const post = new Post({
		user: userRef._id,
		title: req.body.title,
		content: req.body.content
	});

	try {
		const newPost = await post.save();

		// updating redis to store post with specified id
		redisClient.setex('post:' + newPost._id, DEFAULT_EX, JSON.stringify(newPost));

		res.status(201).json(newPost);
	} catch(err) {
		res.status(400).json({ message: err.message }); // bad data given to request
	}
});

// getting one specific post
router.get('/:postId', (req, res) => {
	return new Promise((resolve, reject) => {
    redisClient.get('post:' + req.params.postId, (error, data) => {
      if(error) return res.set(400).json({ message: error.message });;
			if(data != null) return res.json(JSON.parse(data));
    });
  })
});

// updating a specific subset of fields
router.patch('/:postId', (req, res) => {

});

module.exports = router;
