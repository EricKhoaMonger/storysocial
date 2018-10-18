module.exports = {
    ensureAuthenticated : function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } 
        res.redirect('/')
    },
    ensureGuess : function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }    
    }
}