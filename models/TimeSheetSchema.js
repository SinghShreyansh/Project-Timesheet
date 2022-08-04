const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const TimeSheetSchema = new Schema({
    employee_id:{
        type: mongoose.Types.ObjectId,
        ref: 'usercontents',
    },
    project_id:{
        type: mongoose.Types.ObjectId,
        ref: 'projectcontents',
    },
    hours:{
        type: String,
    },
    day:{
        type: String,
    }

  });

module.exports = mongoose.model('timesheet', TimeSheetSchema);