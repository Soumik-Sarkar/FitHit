const mongoose = require('mongoose');
const Review =  require('./review');
const user = require('./user')
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('upload','/upload/w_200');
});

const opts = { toJSON: { virtuals: true} };

const GymSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:  {
            type: [Number],
            required: true
        }
    },
    price: Number,
    contact: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

GymSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/gyms/${this._id}" >${this.title}</a></strong>`
});



GymSchema.pre('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in: doc.reviews
            }
        })
        await ImageSchema.remove({
            _id:{
                $in: doc.images
            }
        })
    }
})

module.exports = mongoose.model('Gym' , GymSchema)


