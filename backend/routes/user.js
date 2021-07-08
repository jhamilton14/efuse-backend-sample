const express = require('express');
const router = express.Router();

const Redis = require('redis');
const redisClient = Redis.createClient();
const DEFAULT_EX = 3600; // time before redis cache clears

const User = require('../models/user');

// creating a new user
router.post('/', async (req, res) => {
	const user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username
	});

	try {
		const newUser = await user.save();

		// updating redis to store user with specified id
		redisClient.setex('user:' + newUser._id, DEFAULT_EX, JSON.stringify(newUser));

		res.status(201).json(newUser);
	} catch(err) {
		res.status(400).json({ message: err.message }); // bad data given to request
	}
});

// getting one specific user
router.get('/:userId', (req, res) => {
	return new Promise((resolve, reject) => {
    redisClient.get('user:' + req.params.userId, (error, data) => {
      if(error) return res.set(400).json({ message: error.message });;
			if(data != null) return res.json(JSON.parse(data));
    });
  })
});

// updating a specific subset of fields
router.patch('/:userId', (req, res) => {
	const userRef;
	try {
		userRef = await User.findById(req.params.userId);

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

		try {
			const updatedUser = await userRef.save();
			// updating redis to store user with specified id
			redisClient.setex('user:' + updatedUser._id, DEFAULT_EX, JSON.stringify(updatedUser));

			res.status(201).json(updatedUser);
		} catch (err) {

		}


	} catch (err) {
		res.status(500).json({ message: err.message }); // bad data given to request
	}
});

// POTENTIALLY CREATE SOME MIDDLEWEAR TO FIND USER BY ID AND THEN IN GET REQUEST YOU CAN CALL IF IT IS NOT CACHED
// AND THEN IN PATCH IT WOULD WORK AS WELL


module.exports = router;
