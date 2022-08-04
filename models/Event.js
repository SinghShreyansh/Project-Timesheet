const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: {
    type: String
  },
  image: {
    type: String
  },
  image_gallery: [{
    type: String
  }],
  desc: {
    type: String
  },
  starting_date: {
    type: Date
  },
  status: {
    type: String,
    default: 'active'
  },
  details: {
    type: {}
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number
    }],
    address: {
      type: String
    }
  }, // google will use lat,lng - while mongodb uses lng,lat
  map_img: {
    type: String
  },
  insta_link: {
    type: String
  },
  fb_link: {
    type: String
  },
  web_link: {
    type: String
  },
  age_limit: {
    type: String
  },
  time: {
    type: String
  },
  buy_ticket: {
    type: String
  },
  success: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.index({
  name: 'text'
});

eventSchema.index({
  location: '2dsphere'
});

module.exports = mongoose.model('Event', eventSchema);