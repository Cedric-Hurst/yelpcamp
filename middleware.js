const { campSchema, reviewSchema } = require('./schemas'); //from joi schema not form models
const AppError = require('./utils/AppError');
const Camp = require('./models/camp'); 
const Review = require('./models/review'); 

module.exports.isLoggedIn = (req, res, next) => { // checks to see if the user is logged in
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCamp = (req, res, next) => { 
    
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new AppError(400, msg);
    } else { 
        next();
    }
}
module.exports.isAuthor = async(req, res, next) => { 
    const { id } = req.params;
    const camp = await Camp.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/camps/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => { 
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/camps/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => { 
    
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new AppError(400, msg);
    } else { 
        next();
    }
}