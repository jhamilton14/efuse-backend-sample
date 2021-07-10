const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');

const Helper = require('./helper.js');

// creating a new post
router.post('/', async (req, res) => {
	try {
		const userRef = await User.findById(req.body.user);

		const post = new Post({
			user: userRef._id,
			title: req.body.title,
			content: req.body.content
		});

		Helper.createUpdateEntry(post, res, 'post');
	} catch(err) {
		res.status(404).json({ message: 'User not found' }); // bad data given to request
	}
	
});

// getting one specific post
router.get('/:postId', async (req, res) => {
  return res.set(200).json(await Helper.getEntry(res, req.params.postId, 'post'));
});

// updating a specific subset of fields
router.patch('/:postId', async (req, res) => {
	try {
		// grabs the desired user first then updates necessary fields
		const postRef = await Post.findById(req.params.postId);

		if(postRef === null) {
			return res.status(404).json({ message: 'Post not found' });
		}

		if(req.body.user) {
			postRef.user = req.body.firstName;
		}
		if(req.body.title) {
			postRef.title = req.body.title;
		}
		if(req.body.content) {
			postRef.content = req.body.content;
		}

		Helper.createUpdateEntry(postRef, res, 'post');

	} catch (err) {
		res.status(404).json({ message: 'Post not found' }); // bad data given to request
	}
});

module.exports = router;
