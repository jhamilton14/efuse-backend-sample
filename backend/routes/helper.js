// file that contains middlewear for updating and retrieving entries in the database

const Redis = require('redis');
const redisClient = Redis.createClient();

const Post = require('../models/post');
const User = require('../models/user');

// creates or updates a post/user entry in mongo and redis
const createUpdateEntry = async (entry, res, type) => {
	try {
		const newEntry = await entry.save();
		
		// key varies based on type of entry
		const redisKey = '' + type + ':' + newEntry._id;

		// creates a redis hash set for desired entry
		if(type === 'post') {
			redisClient.hmset(redisKey, [
				'_id', String(newEntry._id),
				'user', String(newEntry.user),
				'title', newEntry.title,
				'content', newEntry.content,
				'createdAt', newEntry.createdAt
			]);
		} else if(type === 'user') {
			redisClient.hmset(redisKey, [
				'_id', String(newEntry._id),
				'firstName', newEntry.firstName,
				'lastName', newEntry.lastName,
				'email', newEntry.email,
				'username', newEntry.username,
				'createdAt', newEntry.createdAt
			]);
		}

		return res.status(201).json(newEntry);
	} catch(err) {
		return res.status(400).json({ message: err.message }); // bad data given to request
	}
}

// function for retrieving a single redis entry
const getEntry = async (res, id, type) => {
	return new Promise((resolve, reject) => {
		redisClient.hgetall(type + ':' + id, (error, data) => {
			if(error) return reject(error);
			if(data != null) return resolve(data);
			return res.set(404).json({ message: 'Entry not found' });
		});
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
