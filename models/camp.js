const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: String,
    url: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200');
})
const opts = { toJSON: { virtuals: true } };
const CampSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);
CampSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title,
        location: this.location,
        price: this.price
    };
})

// Delete middleware removes all reviews when a camp is deleted using the findOneAndDelete
CampSchema.post('findOneAndDelete', async function (camp) {
    if (camp) {
        await Review.deleteMany({
            _id: {
                $in: camp.reviews // any Id in camp that matches a review id in Review gets deleted
            }
        })
    }
});

module.exports = mongoose.model('Camp', CampSchema);