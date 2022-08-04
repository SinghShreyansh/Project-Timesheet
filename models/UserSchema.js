const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: Number,
        default:2
    },
    status:{
        type: String,
        required: true
    },
    dummy:{
        type: String,
        required: true
    },
    createdAt:{
         type: Date,
         default: Date.now
    },
    updatedAt:{
        type: Date,
         default: Date.now
    }
       
        
    
    
  });

module.exports = mongoose.model('usercontents', UserSchema);