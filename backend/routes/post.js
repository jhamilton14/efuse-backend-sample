const express = require('express');
const router = express.Router();

const Post = require('../models/post');

// creating a new post
router.post('/', (req, res) => {

});

// getting one specific post
router.get('/:postId', (req, res) => {

});

// updating a specific subset of fields
router.patch('/:postId', (req, res) => {

});

module.exports = router;
