const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../model/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})

.then(() => {
    console.log('Mongo Connected..');
})
.catch((err) => {
    console.log('OOPs Mongo Connection Error!!');
    console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0;i < 300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30)+10;
        const camp = new Campground({
            author: '6022846d13858c4d88c11812',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod, vel ea! Labore, maiores aut nobis facilis molestiae dolorum magnam voluptatem et corrupti quia, dicta excepturi ea recusandae tempora, voluptate modi.',
            price,
            geometry: { 
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude 
                ]
            },
            images : [
                {
                  url: 'https://res.cloudinary.com/bhaveshd17/image/upload/v1613219870/yfblxnnjigjeu953pymq.jpg',
                  
                  filename: 'dbh73crkryr3wrtc71jl'
                },
                {
                  url: 'https://res.cloudinary.com/bhaveshd17/image/upload/v1613214691/lvbes0ffbj6umzpt1xiu.jpg',
                  filename: 'ou0sjct5crjx1ewbosd0'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})


