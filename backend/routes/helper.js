// file that contains middlewear for updating and retrieving entries in the database

const Redis = require('redis');
const redisClient = Redis.createClient();
const DEFAULT_EX = 3600; // time before redis cache clears

const Post = require('../models/post');
const User = require('../models/user');

const createUpdateEntry = async (entry, res, type) => {
	try {
		const newEntry = await entry.save();
		
		const redisKey = '' + type + ':' + newEntry._id;

		// updating redis to store user with specified id
		redisClient.setex(redisKey, DEFAULT_EX, JSON.stringify(newEntry));

		return res.status(201).json(newEntry);
	} catch(err) {
		return res.status(400).json({ message: err.message }); // bad data given to request
	}
}

// function for retrieving a single redis entry
const getEntry = (res, id, type) => {
	redisClient.get(type + ':' + id, (error, data) => {
		if(error) return res.set(400).json({ message: error.message });;
		if(data != null) return res.set(200).json(JSON.parse(data));
		return res.set(404).json({ message: 'Entry not found' });
	});
}

// simply used for testing purposes to make sure mongodb was updating correctly
const getMongoPostEntry = async (res, id) => {
	try {
		entry = await Post.findById(id);
		return entry;
	} catch(err) {
		return res.status(404).json({ message: 'Post not found' });
	}
}

// simply used for testing purposes to make sure mongodb was updating correctly
const getMongoUserEntry = async (res, id) => {
	try {
		entry = await User.findById(id);
		return entry;
	} catch(err) {
		return res.status(404).json({ message: 'User not found' });
	}
}

module.exports = {
	createUpdateEntry: createUpdateEntry,
	getEntry: getEntry,
	getMongoPostEntry: getMongoPostEntry,
	getMongoUserEntry: getMongoUserEntry
}
