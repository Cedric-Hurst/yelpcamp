const mongoose = require('mongoose');
const Camp = require('../models/camp');
const cities = require('./cities');
const seedHelpers = require('./seedHelpers');

mongoose.set('strictQuery', true);
main().catch(err => {
    console.log('ERROR #*#*#*#*#*#*#*#*#*#*#**#*#*#*#*');;
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/camps2');
    console.log('connection to server established');
}

const seedDB = async () => { 
    await Camp.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const randCity = cities[(Math.floor(Math.random() * 1000))];
        const randDis = seedHelpers.descriptors[(Math.floor(Math.random() * seedHelpers.descriptors.length))]
        const randPlace = seedHelpers.places[(Math.floor(Math.random() * seedHelpers.places.length))]
        const price = ((Math.random() * 30) + 10).toFixed(2);
        const addRandCamp = new Camp({
            author: '63cec503ff98d3585fd81942',
            location: `${randCity.city}, ${randCity.state}`,
            title: `${randDis} ${randPlace}`,
            geometry: {
                type: 'Point',
                coordinates: [randCity.longitude, randCity.latitude]
            },
            images: [
                {
                url: 'https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
                filename: 'default'
                }
            ],
            description: 'please add in a description of the campsite',
            price
        })
        await addRandCamp.save();
        
    }

}
seedDB().then(() => { 
    mongoose.connection.close();
});