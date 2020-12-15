const mongoose = require('mongoose');
const config = require('config');
const dbDebug = require('debug')('dphub:db');


   mongoose.connect(config.get('hostname'), {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> dbDebug('Connecting to mongodb...'))
    .catch(err => console.error('Could not connect to mongoDb..', err))
   
