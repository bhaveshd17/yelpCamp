const Campground = require('../model/campground');
const Review = require('../model/reviews');

module.exports.createReview = async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success','Successfully Added Review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReviews = async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully Delete Review')
    res.redirect(`/campgrounds/${id}`)
}