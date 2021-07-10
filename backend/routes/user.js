const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const Helper = require('./helper.js');

const Redis = require('redis');

// creating a new user
router.post('/', async (req, res) => {
	const user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username
	});

	Helper.createUpdateEntry(user, res, 'user');
});

// getting one specific user
router.get('/:userId', async (req, res) => {
	return res.set(200).json(await Helper.getEntry(res, req.params.userId, 'user'));
});

// getting all posts from a specific user
router.get('/:userId/posts', async (req, res) => {
	Post.find( { user: req.params.userId }, async (err, posts) => {
		if (err) return res.status(404).json({ message: 'User has no posts' });

		var data = []
		var i;
		for(i = 0; i < posts.length; i++) {
			data.push(await Helper.getEntry(res, posts[i]._id, 'post'));
		}

		return res.set(200).json(data);
	});
});

// updating a specific subset of fields
router.patch('/:userId', async (req, res) => {
	try {
		// grabs the desired user first then updates necessary fields
		const userRef = await User.findById(req.params.userId);

		if(userRef === null) {
			return res.status(404).json({ message: 'User not found' });
		}

		if(req.body.firstName) {
			userRef.firstName = req.body.firstName;
		}
		if(req.body.lastName) {
			userRef.lastName = req.body.lastName;
		}
		if(req.body.email) {
			userRef.email = req.body.email;
		}
		if(req.body.username) {
			userRef.username = req.body.username;
		}

		Helper.createUpdateEntry(userRef, res, 'user');
	} catch (err) {
		res.status(404).json({ message: 'User not found' }); // bad data given to request
	}
});

module.exports = router;
