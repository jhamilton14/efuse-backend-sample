const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const Helper = require('./helper.js');

const Redis = require('redis');
const redisClient = Redis.createClient();
const DEFAULT_EX = 3600; // time before redis cache clears

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
router.get('/:userId', (req, res) => {
  return Helper.getEntry(res, req.params.userId, 'user');
});

// getting all posts from a specific user
router.get('/:userId/posts', async (req, res) => {
	Post.find( { user: req.params.userId }, function (err, posts) {
		if (err) return res.status(404).json({ message: 'User has no posts' });

		return res.set(200).json(posts);
		/*
		var data = [];
		var i;
		for(i = 0; i < posts.length; i++) {
			// Helper.getEntry(res, posts[i]._id, 'post');

			const posts = retrieveData(posts[i]._id);
			console.log(posts);
		}
		*/
	});
});

// updating a specific subset of fields
router.patch('/:userId', async (req, res) => {
	try {
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

// middlewear for returning a single instance and sending no response
const retrieveData = async (id) => {
	return new Promise((resolve, reject) => {
    redisClient.get('post:' + id, (error, data) => {
			
			if(error) return reject(error); // res.set(400).json({ message: error.message });
			console.log(data);
			return resolve(JSON.parse(data));
			//if(data != null) return JSON.parse(data);
		});
  });
}

module.exports = router;
