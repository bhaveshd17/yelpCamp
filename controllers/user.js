const User = require('../model/user')
module.exports.renderRegisterPage = (req, res) => {
    res.render('user/register')
}
module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        req.logIn(registerUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.renderLoginPage = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = (req, res) => {
    const redirectPath = req.session.returnTo || '/campgrounds'
    req.flash('success', 'Welcome Back!!')
    res.redirect(redirectPath)
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'Good Bye!!')
    res.redirect('/campgrounds')
}