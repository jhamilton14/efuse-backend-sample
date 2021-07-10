# efuse-backend-sample
Backend work sample for eFuse.

Run Instructions
------------
To run the dockerized environment, type the following commands:
```
$ cd backend
$ docker-compose docker-compose up -d --build
```
When testing endpoints, use <b>port 5000</b>.

### Endpoints:
User:
* POST /api/user - Adds a new user record to the database
* GET /api/user/:userId - Retrieve a user record for the given userId
* GET /api/user/:userId/posts - Return posts for a user
* PATCH /api/user/:userId- Update a subset of fields for a given user
User object: { 
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	createdAt: Date
}

Post:
* POST /api/post - Adds a new post record to the database
* GET /api/post/:postId - Retrieve a post record for the given postId
* PATCH /api/post/:postId- Update a subset of fields for a given post
Post object: {
	user: <ref:user._id>,
	title: String,
	content: String,
	createdAt: Date
}

Design Desicions
------------
### General structure:
* Since this is a fairly small app, I likely could have fit most of the logic into server.js, but I find it easier to split it into separate router files. This way you can have a good separation of concerns and also not worry about adding more to the app later.
* Helper file: When working on my user and post routers, I realized that the code for grabbing entries and creating/updating entries would be almost identical in both. I decided to create a helper file with these two functions in order to not repeat any code unnecessarily. This proved useful for me.

### Redis:
* I decided to use the hash capabilities in redis for storing my data. This data structure seemed to be the most straightforward and the most similar to a db like mongo. It was also easy to list out all the values associated with a key and return entries when needed.
* Could have improved my endpoint for grabbing posts of a specified user. Currently it uses mongoose to find out which posts are associated with the user and then goes through those posts and does a get request in redis. This feels a little redundant, as I could have just sent back the posts I got from the Post.find() function.
	* I could have used the KEYS * command in redis, but according to the documentation this would have been expensive in a bigger application and I would have had to create a few workarounds to make it function properly. I decided to go with what I thought would be a little better in a large scale production environment, although I don't think it's perfect.
* Overall impressions: For this being my first time using redis, I actually liked it quite a bit. It really speeds up response times so I may try to use it in some of my projects.

Given More Time
------------
* I would have created more error checking throughout the application to ensure all of the data in mongodb and redis matched.
* Would have added a few caveats, such as making usernames and emails be unique - didn't think it was necessary in this small sample.
* Created a timeout for items in the cache if they were sitting there for too long untouched.
* Added capability to pull from mongo instead of redis if the necessary data was not saved in redis.
