const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const AssignProjectSchema = new Schema({
    project_id:{
        type: mongoose.Types.ObjectId,
        ref: 'projectcontents',
    },
    employee_id:{
        type: mongoose.Types.ObjectId,
        ref: 'usercontents',
    },
    details:{
      
    },
    assign_date:{
        type: Date,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    }

       
        
    
    
  });

module.exports = mongoose.model('assign_projectcontents', AssignProjectSchema);