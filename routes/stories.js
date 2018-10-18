const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {
    ensureAuthenticated,
    ensureGuess
} = require('../helpers/auth')

// Load Models
const Story = mongoose.model('stories')
const User = mongoose.model('users')

// Index
router.get('/', (req, res) => {
    Story.find({
            status: 'public'
        })
        .populate('user')
        .sort({
            date: 'desc'
        })
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        })

})

// Show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if (story.status == 'public') {
                res.render('stories/show', {
                    story: story
                })
            } else {
                if (req.user && req.user.id == story.user.id) {
                    res.render('stories/show', {
                        story: story
                    })
                } else {
                    res.redirect('/stories')
                }
            }
        })
})

// List stories from specific user
router.get('/user/:userId', (req, res) => {
    Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        })
})

// Logged in user stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
            user: req.user.id
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        })
})

// Add story form
router.get('/add', ensureAuthenticated, (req, res) => {

    res.render('stories/add')
})

// Process Add Story
router.post('/', (req, res) => {
    let allowComments;
    allowComments = req.body.allowComments ? true : false

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`stories/show/${story.id}`)
        })
})

// Edit Story
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories')
            } else {
                res.render('stories/edit', {
                    story: story
                })
            }

        })
})

// Handle Edit Put Request
router.put('/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            let allowComments;
            allowComments = req.body.allowComments ? true : false

            // Set New Vals
            story.title = req.body.title
            story.body = req.body.body
            story.status = req.body.status
            story.allowComments = allowComments

            story.save()
                .then(story => {
                    res.redirect('/dashboard')
                })
        })
})

// Delete Story
router.delete('/:id', (req, res) => {
    Story.remove({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard')
        })
})

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            // Push to comment array
            story.comments.unshift(newComment)

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`)
                })
        })
})


module.exports = router