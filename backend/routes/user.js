const express = require('express');
const router = express.Router();

const User = require('../models/user');

// creating a new user
router.post('/', (req, res) => {

});

// getting one specific user
router.get('/:userId', (req, res) => {
	res.send('poop loop');
});

// updating a specific subset of fields
router.patch('/:userId', (req, res) => {

});

module.exports = router;
