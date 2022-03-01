const mongoose = require('mongoose');
const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')
const Gym = require('../models/gym')

mongoose.connect('mongodb://localhost:27017/fithit', { useNewUrlParser: true });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Gym.deleteMany({});
    for(let i =0 ; i< 50 ; i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const gym = new Gym({
            author: "620e8db94206223a22b483ec",
            images: [
                {
                  url: 'https://res.cloudinary.com/dng3udoi7/image/upload/v1645724556/YelpCamp/w6bxtfjnzmdjs8eemb15.jpg',
                  filename: 'YelpCamp/w6bxtfjnzmdjs8eemb15',
                },
                {
                  url: 'https://res.cloudinary.com/dng3udoi7/image/upload/v1645724556/YelpCamp/nvzaqgzywhleaj7qx4sl.jpg',
                  filename: 'YelpCamp/nvzaqgzywhleaj7qx4sl',
                }
              ],
            location : `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti aliquam error nobis sit iusto id voluptates eligendi vitae. Libero accusamus optio blanditiis hic vitae assumenda maiores corporis rerum, error repellat?',
            price: price
        })
        await gym.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
});