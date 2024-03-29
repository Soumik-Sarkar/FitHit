const Gym = require('../models/gym');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success','Created New Review');
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id , reviewId} = req.params;
    await Gym.findByIdAndUpdate(id, {$pull: { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/gyms/${id}`)
}