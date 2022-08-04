const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const TrackerSchema = new Schema({
    employee_id:{
        type: mongoose.Types.ObjectId,
        ref: 'usercontents',
    },
    project_id:{
        type: mongoose.Types.ObjectId,
        ref: 'projectcontents',
    },
    start_time:{
        type: Date,
    },
    hours:{
        type: String,
    },
    re_start:{
        type: Date,
    },
    active:{
        type:Number,
        required:true,
    },
    day:{
        type: String,
    }




  });

module.exports = mongoose.model('tracker', TrackerSchema);