const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    details:{
        type:{}
    }
        
    
  });

module.exports = mongoose.model('clientcontents', ClientSchema);