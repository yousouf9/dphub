const mongoose = require('mongoose');
const config = require('config');
const dbDebug = require('debug')('dphub:db');



const options = {
   useNewUrlParser: true,
   useCreateIndex: true,
   autoIndex: true, //this is the code I added that solved it all
   keepAlive: true,
   poolSize: 10,
   bufferMaxEntries: 0,
   connectTimeoutMS: 10000,
   socketTimeoutMS: 45000,
   family: 4, // Use IPv4, skip trying IPv6
   useFindAndModify: false,
   useUnifiedTopology: true
 }
   mongoose.connect(config.get('hostname'), options)
    .then(()=> dbDebug('Connecting to mongodb...'))
    .catch(err => console.error('Could not connect to mongoDb..', err))
   
