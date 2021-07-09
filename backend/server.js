require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 5000; // desired port

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('connected to db'))
	.catch(error => console.error(error));

app.use(express.json());

// uses the router files for both user and post
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

const postRouter = require('./routes/post');
app.use('/api/post', postRouter);

app.listen(port, () => console.log('App listening on port ' + port));
