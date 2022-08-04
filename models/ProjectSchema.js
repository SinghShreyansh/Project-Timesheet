const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    client_id:{
        type: mongoose.Types.ObjectId,
        ref: 'clientcontents',
    },
    details:{
        
    }
       
        
    
    
  });

module.exports = mongoose.model('projectcontents', ProjectSchema);