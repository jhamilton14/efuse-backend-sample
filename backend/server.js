require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 5000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('connected to db'))
	.catch(err => console.error(error));

/*
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log('connected to db'));
*/

app.use(express.json());

const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

const postRouter = require('./routes/post');
app.use('/api/post', postRouter);

app.get('/', (req, res) => {
    res.send('Hello world\n');
});

app.listen(port, () => console.log('App listening on port ' + port));
