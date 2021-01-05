const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
 
const schema = new mongoose.Schema({
  "type": {
    "type": "String"
  },
  "crs": {
    "type": {
      "type": "String"
    },
    "properties": {
      "name": {
        "type": "String"
      }
    }
  },
  "features": {
    "type": [
      "Mixed"
    ]
  }

});

const Statistic = mongoose.model('Statistic', schema);

module.exports.Statistic = Statistic;
