const Camp = require('../models/camp'); 
const Review = require('../models/review'); 

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Camp.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', `Review created for ${camp.title}!`);
    res.redirect(`/camps/${camp.id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Camp.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Review deleted from ${camp.title}!`);
    res.redirect(`/camps/${id}`)
}