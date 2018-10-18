const express = require('express')
const mongoose = require('mongoose')
const Story = mongoose.model('stories')
const router = express.Router()
const {
    ensureAuthenticated,
    ensureGuess
} = require('../helpers/auth')

router.get('/', ensureGuess, (req, res) => {
    res.render('index/welcome')
})
router.get('/about', (req, res) => {
    res.render('index/about')
})
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({
            user: req.user.id
        })
        .then(stories => {
            res.render('index/dashboard', {
                stories: stories.sort((a,b) => b.date - a.date)
            })
        })

})

module.exports = router