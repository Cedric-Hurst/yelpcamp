const User = require('../models/user');

module.exports.registerPage = (req, res) => {
    res.render('users/register');
}
module.exports.createUser = async (req, res, next) => { 
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => { 
            if (e) next(e);
            req.flash('success', 'Welcome to YelpCamp');
            return res.redirect('/camps');
        })
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('register');
    }
}
module.exports.loginPage = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/camps'; // allows user to continue where left off when they were asked to login
    delete req.session.returnTo; // deletes the session after its been saved to a new variable;
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res, next) => {
    req.logout(function (err) { // needed a callback function
        if (err) { return next(err); } 
        req.flash('success', 'goodbye');
        res.redirect('login');
    });
}
