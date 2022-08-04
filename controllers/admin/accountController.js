const passport = require('passport');
const validator = require('validator')
const mongoose = require('mongoose');
const bcryptjs= require('bcryptjs')
const UserSchema = require('../../models/UserSchema');
const ProjectSchema = require('../../models/ProjectSchema');
const ClientSchema = require('../../models/ClientSchema');
const { session } = require('passport');
const { cookie } = require('request');
const e = require('connect-flash');
const AssignProjectSchema = require('../../models/AssignProjectSchema');
const Cryptr = require('cryptr');
const TrackerSchema = require('../../models/TrackerSchema');
const moment = require('moment');
const nodemailer = require("nodemailer");
const TimeSheetSchema = require('../../models/TimeSheetSchema');



const cryptr = new Cryptr('myNameisAtlantis');



exports.test = (req, res) => {
    return res.json({
        msg: 'success'
    })
};

// --------------------------------------login part code start here -------------------------------------------------
exports.login =  (async(req, res,next)=>{
    validator.isEmail(req.body.email);
   next();
}, passport.authenticate("local",{failureRedirect:"/"}))


exports.loginPage = async(req,res,next)=>{
    const params = {}
    res.status(200).render('login/login.pug', params);
}

exports.adminLogin =async(req,res,next)=>{
    const data = await UserSchema.findOne({"email":req.body.email});

    if(data){
        const passwordResult = await bcryptjs.compare(req.body.password, data.password)
        if(passwordResult){
            // const accountSid = 'ACb14c912ae67ae039dce6ce4a2392b6bc';
            // const authToken = '0af9247b91ef30849c66bfa841cff2a9';
            // const client = require('twilio')(accountSid, authToken);
            // console.log("message sending")
            // client.messages
            //     .create({
            //         body: 'hello again from app',
            //         messagingServiceSid: 'MGc47d0ada3c095a13eaef01c3651be898',
            //         to: '+917498063716'
            //     })
            //     .then(message => console.log(message.sid + "  message send"))
            //     .done();

                req.session.user = data;
                res.redirect('/account/dashboard')
        }else{
                  return res.status(401).json({
                "msg":"Plz enter correct password",
            })
        }
    }else{
        return res.status(401).json({
            "msg":"user not found",
        })
    }

}

// ------------------------------------dashboard api's starts here --------------------------------------------

exports.dashboard = async(req,res,next) =>{
    res.status(201).redirect('/account/dashboard')
}


exports.provideDashboard = async(req,res,next) =>{
    res.status(201).render('dashboard/dashboard.pug')
}


//---------------------------------------user page code starts here ---------------------------------------------

exports.user = async(req,res,next)=>{
    const arr =await UserSchema.find();



    res.status(200).render('user/user.pug',{userData: arr});
    // return res.status(200).json(arr)

}

exports.addUser = async(req,res,next)=>{

    res.render('addUser/addUser.pug');
    // return res.status(200).json(arr)

}

exports.checkAdminPassword = async(req,res,next)=>{
    try{


            const passwordResult = await bcryptjs.compare(req.body.password, req.session.user.password)

            if(passwordResult){
               return res.status(200).json({
                "type":"success"
               })
            }else{
                return res.status(200).json({
                    "type":"failure"
                })
            }


    }catch(err){
        return res.status(200).json({
            "type":"failure",
        })
    }

}

exports.getUserPassword = async(req,res,next)=>{

    try{
    const userPassword = await UserSchema.findById(req.body.id)
    let paswrd =  cryptr.decrypt(userPassword.dummy)

    if(paswrd){
       return res.status(200).json({
        "type":"success",
        "password":paswrd
       })
    }
   }catch(err){
        return res.status(200).json({
            "type":"failure",
        })
   }
}

exports.getEditUser = async(req,res,next)=>{

    if(req.session.user.role==2){
        return res.status(200).redirect('/account/user')
    }

    const userData = await UserSchema.findById(req.query.id);

    const newUserData = {
        "id":userData.id,
        "name":userData.name,
        "email":userData.email,
        "role": userData.role==1?"admin":"employee",
        "status":userData.status
    }

    return res.status(200).render('editUser/editUser.pug',{newUserData});
}

exports.editUser = async(req,res,next)=>{


    const newUserData = {
        "name":req.body.name,
        "email":req.body.email,
        "role": req.body.role=="1"?1:2,
        "status":req.body.status
    }

    await UserSchema.findByIdAndUpdate(req.body.id,newUserData,(err,result)=>{
        if (err){
            return res.status(500).json({
                "msg":"error occured after updating value"
            });
        }
        else{
            return res.status(200).redirect('/account/user');

        }

    })

}

// ----------------------------------------- add user page code starts here ----------------------------------------

exports.addUserData = async(req,res,next)=>{


    // 1. validate
    // 2. password hash
    let paswrdHash = await bcryptjs.hash(req.body.password,10)

    //crypting password
    const crytedPassword =  cryptr.encrypt(req.body.password)

    const newData = {
        "name":req.body.name,
        "email": req.body.email,
        "password": paswrdHash,
        "role": req.body.role,
        "status": req.body.status,
        "dummy": crytedPassword,
        "createdAt":Date.now(),
        "updatedAt": Date.now(),
    };

    await UserSchema.create(newData,(err,result)=>{

       if(err){
            return res.status(401).json({
                "msg": err
            })
       }


       return res.status(201).redirect('/account/user')

    })
    // 3. data base add kardo
    // 4. render
    return;

}

//------------------------------------------ project page code starts here -------------------------------------------

exports.provideProjects = async(req,res,next)=>{
    const project =await ProjectSchema.find().populate({
        path:"client_id",
        select: "name"
    });


    res.status(200).render('project/project.pug',{ProjectData: project});
    // return res.status(200).json(arr)

}

// ----------------------------------------- Add Project page code starts here ---------------------------------------

exports.addProject = async(req,res,next)=>{

    const clientData = await ClientSchema.find({},{
        "name":1,
    });




    res.render('addProject/addProject.pug', {clientData});
    // return res.status(200).json(arr)

}


exports.addProjectData = async(req,res,next)=>{


        await ProjectSchema.create(req.body,(err,result)=>{


            if(err){
                 return res.status(401).json({
                     "msg": err
                 })
            }


            return res.status(201).redirect('/account/project')

         })


}

// ----------------------------------------  Assign Project page code starts here -----------------------------------

exports.addAssignProject= async(req,res,next)=>{

    const employee = await UserSchema.find({}, {
       "name":1
    })

    const projectData = await ProjectSchema.find({},{
        "name":1,
    })


    res.render('assignProject/assignProject.pug',{employee,projectData})
}

exports.addAssignProjectData= async(req,res,next)=>{


    const newData = {
        "project_id": req.body.project_id,
        "employee_id":req.body.employee_id,
        "details":req.body.details,
        "assign_date": req.body.assign_date,
        "createdAt": Date.now(),
        "updatedAt": Date.now()
    }

    await AssignProjectSchema.create(newData,async (err,result)=>{
        if(err){
            res.status(401).json({
                "msg": err
            })
        }
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'singhssingh152@gmail.com',
              pass: 'chxdxdhlfqzzhhev'
            }
        });

        var mailOptions = {
            from: 'singhssingh152@gmail.com',
            to: '2020.shreyansh.singh@ves.ac.in',
            subject: 'Sending Email using Node.js',
            text: 'That was easy! from shreyansh'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).redirect('/account/project');

    })


   return ;
}

// ------------------------------------------  Tracker page code starts here ---------------------------------------

exports.getTracker= async(req,res,next)=>{

    const TrackerProj = await TrackerSchema.find({employee_id:req.session.user._id,day:moment().format('YYYY-MM-DD')}).populate({
        path:"project_id",
        select:"name"
    })

    const Allotedproject =await AssignProjectSchema.find({employee_id:req.session.user._id},{
        project_id:1,employee_id:1
    }).populate({
        path:"project_id",
        select: "name"
    });

    if(TrackerProj.length){
        let TotalTrackerUserHour=0;
        let arr=[];
        let trackerIsOnOrOff;
        let trackerIsOnArr = [];
        let trackerProjArr = [];
        TrackerProj.map((data)=>{
            if(data.hours&&!data.re_start){
                let a = data.hours.split(':')
                let milliseconds = (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
                TotalTrackerUserHour+=milliseconds;
                trackerProjArr.push(data)
                arr.push(milliseconds)
            }else if(data.re_start&&data.active==1){
               trackerIsOnOrOff = "on";
               let a = data.hours.split(':')
               let milliseconds = (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
               TotalTrackerUserHour+=milliseconds;
               trackerIsOnArr.push(data.project_id.name)
               trackerProjArr.push(data)
               arr.push(0000)
            }else if(data.re_start&&data.active==0){
               let a = data.hours.split(':')
               let milliseconds = (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
               TotalTrackerUserHour+=milliseconds;
               trackerProjArr.push(data)
               arr.push(milliseconds)
            }else{
               trackerIsOnOrOff = "on";
               TotalTrackerUserHour+= moment(new Date()).diff(moment(data.start_time));
               trackerIsOnArr.push(data.project_id.name)
               arr.push(0000)
            }

        })


        Promise.all(arr)
            .then((arr)=>{
                let totalDur = moment.duration(TotalTrackerUserHour,'milliseconds');
                let totalTrackerCurrUserTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60);
                res.status(200).render('tracker/tracker.pug',{
                    Allotedproject,
                    TrackerProj:trackerProjArr,
                    TotalTrackerUserHour:totalTrackerCurrUserTime,
                    TodayDate:new Date().toISOString().substring(0, 10),
                    TrackerIsOnOrOff : trackerIsOnOrOff,
                    TrackerIsOnArr : trackerIsOnArr
                });
            })
    }else{

        res.status(200).render('tracker/tracker.pug',{
            Allotedproject,
            TrackerProj:[],
            TotalTrackerUserHour:'00:00:00',
            TodayDate:new Date().toISOString().substring(0, 10),
            TrackerIsOnOrOff : null ,
            TrackerIsOnArr : []
        });
    }

    // res.status(200).render('tracker/tracker.pug');
}

exports.startTracker = async (req, res, next) => {

    if (req.body.project_id.length) {
        let arr = [];

        for (let proj of req.body.project_id) {

            let getTodayTracker = await TrackerSchema.findOne( {
                employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                project_id: mongoose.Types.ObjectId(proj),
                day:moment().format('YYYY-MM-DD')
            })

            let tracker;
            if(getTodayTracker){
                tracker = await TrackerSchema.findOneAndUpdate({
                    employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                    project_id: mongoose.Types.ObjectId(proj),
                    day:moment().format('YYYY-MM-DD')
                },{
                   re_start:new Date(),
                   active:1
                })

                arr.push(tracker);
            }else{
                tracker = await TrackerSchema.create({
                    employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                    project_id: mongoose.Types.ObjectId(proj),
                    start_time: new Date(),
                    active: 1,
                    day:moment().format('YYYY-MM-DD')
                });

                await TimeSheetSchema.create({
                    employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                    project_id: mongoose.Types.ObjectId(proj),
                    day:moment().format('YYYY-MM-DD')
                })
                arr.push(tracker);
            }
        }

        Promise.all(arr)
            .then(() => {
                return res.status(200).json({
                    msg: 'success',
                    type:'success',
                    code: 200
                })
            })
            .catch(err => {
                console.log('ERR in trackerrr------->');
                console.log(err);
                return res.status(401).json({
                    msg: err,
                    type:'failure',
                    code: 401
                })
            })
    }
}

exports.stopTracker=async (req,res,next)=>{

    let updateArr = [];
    let lengthOfProjectArr = req.body.project_id.length;

    if(lengthOfProjectArr>0){
        let startedProject = await TrackerSchema.find({
            employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
            day:moment().format('YYYY-MM-DD'),
            active: 1,
        })

        let timesheetData = await TimeSheetSchema.find({
            employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
            day:moment().format('YYYY-MM-DD')
        })

        let ReStartProject=[];
        let FirstTimeStartedProject=[];
        startedProject.map(data=>{
            if(data.re_start) ReStartProject.push(data)
            else FirstTimeStartedProject.push(data)
        })

         // deal with start project
        if(ReStartProject.length){
               ReStartProject.map(async(data)=>{
                let a = data.hours.split(':')
                var lastTimesDur = (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
                var totalTime = moment.utc(moment(new Date(),"DD/MM/YYYY HH:mm:ss").diff(moment(data.re_start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                var totalDur = moment.duration(
                    (((totalTime.slice(0,2)*3600000)+(totalTime.slice(3,5)*60000)+(totalTime.slice(6,8)*1000))/lengthOfProjectArr)+lastTimesDur,'milliseconds');
                var totalProjTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60)

                let tracker = await TrackerSchema.findByIdAndUpdate(data._id,{
                    hours: totalProjTime,
                    active: 0,
                })

                await TimeSheetSchema.findOneAndUpdate({
                    employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                    project_id : data.project_id,
                    day:moment().format('YYYY-MM-DD')
                },{
                    hours: totalProjTime,
                })

                updateArr.push(tracker);
               })
        }
         // deal with started project
         // recent totalTime is equally divided in all
         if(FirstTimeStartedProject.length){
            var startTime,totalTime,totalDur,eachProjTime

            startTime = FirstTimeStartedProject[0].start_time;
            totalTime = moment.utc(moment(new Date(),"DD/MM/YYYY HH:mm:ss").diff(moment(startTime,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
            totalDur = moment.duration(
               ((totalTime.slice(0,2)*3600000)+(totalTime.slice(3,5)*60000)+(totalTime.slice(6,8)*1000))/lengthOfProjectArr,'milliseconds');
            eachProjTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60)

            FirstTimeStartedProject.map(async(data)=>{

                let tracker = await TrackerSchema.findByIdAndUpdate( data._id,{
                   hours: eachProjTime,
                   active: 0,
               })

               await TimeSheetSchema.findOneAndUpdate({
                employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
                project_id : data.project_id,
                day:moment().format('YYYY-MM-DD')
                },{
                    hours: eachProjTime,
               })

                updateArr.push(tracker);
            })
         }



         Promise.all(updateArr)
         .then(async(updateArr) => {
             return res.status(200).json({
                 msg: 'success',
                 type: 'success',
                 code: 200,
                 data:updateArr
             })
         })
         .catch(err => {
             console.log('ERR in trackerrr------->');
             console.log(err);
             return res.status(401).json({
                 msg: err,
                 type:'failure',
                 code: 401
             })
         })

         return


    }

    // let time = await TrackerSchema.findOne( {
    //     employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
    //     project_id: mongoose.Types.ObjectId(req.body.project_id[0]),
    //     day:moment().format('YYYY-MM-DD')
    // })
    // var totalTime,lastTimesDur;
    // if(time.re_start){
    //     console.log("Aaj ka re_start wala stop kiya")

    //      let a = time.hours.split(':')
    //      lastTimesDur = (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
    //      totalTime = moment.utc(moment(new Date(),"DD/MM/YYYY HH:mm:ss").diff(moment(time.re_start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    //      console.log(time.hours)

    // }else{
    //     console.log("aaj ka pehli baar start huaa project stop kiya")
    //      totalTime = moment.utc(moment(new Date(),"DD/MM/YYYY HH:mm:ss").diff(moment(time.start_time,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")

    // }
    // var totalDur = moment.duration(
    //     (((totalTime.slice(0,2)*3600000)+(totalTime.slice(3,5)*60000)+(totalTime.slice(6,8)*1000))/lengthOfProjectArr)+(lastTimesDur?lastTimesDur:0),'milliseconds');
    // console.log(totalDur.asMilliseconds());
    // console.log(lastTimesDur);

    // var eachProjTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60)


        // for (let proj of req.body.project_id) {
        //     let query = {
        //         employee_id: mongoose.Types.ObjectId(req.body.employee_id.trim()),
        //         project_id: mongoose.Types.ObjectId(proj),
        //         day:moment().format('YYYY-MM-DD')
        //     }
        //     let newData = {
        //         hours: eachProjTime,
        //         active: 0,
        //     };

        //     let tracker = await TrackerSchema.findOneAndUpdate(query,newData)

        //     updateArr.push(tracker);
        // }

    return
}

exports.getSelectDateTracker= async(req,res,next)=>{

    const TrackerProj = await TrackerSchema.find({
        employee_id:mongoose.Types.ObjectId(req.body.employee_id.trim()),
        day: req.body.day=="today"? moment().format('YYYY-MM-DD'):req.body.day,
        active:0
    })
    .populate({
        path:"project_id",
        select:"name"
    })

    let arr=[];
    let idArr=[];

    TrackerProj.map(data=>{
        if(data.hours){
            let time = data.hours.split(':')
            const newData = [
                data.project_id.name,
                data.start_time.toLocaleString(),
                (+time[0])=='0'?((+time[1])=='0'?(+time[2])+" secs":(+time[1])+" mins \n "+(+time[2])+" secs"):((+time[1])=='0'?(+time[0])+"hours ":(+time[0])+"hours \n "+(+time[1])+" mins")
            ]
            arr.push(newData)
            idArr.push(data._id);
        }

    })

    Promise.all(arr)
        .then((arr)=>{
            let DayMatch;
            if(req.body.day=='today'){
                DayMatch = true;
            }else{
                DayMatch= moment(req.body.day).format('YYYY-MM-DD').toString()===moment().format('YYYY-MM-DD').toString()

            }
            res.status(200).json({
                "type":"success",
                data:arr,
                idData:idArr,
                currDate:DayMatch,
            })
        })
        .catch(()=>{
            res.status(200).json({
                "type":"failure",
                data:[]
            })
        })

    // console.log("Again call ------>")
    // console.log(TrackerProj);

    //     res.status(200).json({
    //         "type":"success",
    //         data:TrackerProj
    //     })

}


exports.editTrackerHour = async(req,res,next)=>{
    let changeResponse = await TrackerSchema.findByIdAndUpdate(req.body.project_id,
        {
            hours:req.body.hours
        })

        if(changeResponse){
            res.status(200).json({
                type:"success"
            })
        }else{
            res.status(200).json({
                type:"failure"
            })
        }

}

//------------------------------------------- Time Sheet REST APIs starts here ----------------------------------

exports.getTimeSheet = async(req,res,next)=>{
    return res.status(200).render('timesheet/timesheet.pug')
}

exports.getCurrWeekTimeSheet = async(req,res,next)=>{

    let timesheet = await TimeSheetSchema.aggregate([
            {$match:{
                "day":{$gte:moment().startOf('week').add(1,"days").format("YYYY-MM-DD")
                    ,$lte:moment().endOf('week').add(1,"days").format("YYYY-MM-DD")}
            }},
            { $lookup: { from: "projectcontents", localField: "project_id", foreignField: "_id", as: "projectcontents" }},
            { $unwind: "$projectcontents" },
            { $sort: {'projectcontents.name': 1,'day':1}}
     ]);

         /**  Taking all project names from timesheet data**/
          var ProjectNameSet = new Set();
          timesheet.forEach(data=>{
            ProjectNameSet.add(data.projectcontents.name);
          })

          /*** Now Extracting Each days hours of every Project  ***/
          var GroupOfWeeklyTimeOfEachProject=[];
          var totalEachTimeInMilli=[];
          ProjectNameSet.forEach(data=>{

                var groupDataByName = timesheet.filter(timedata=>{
                    return timedata.projectcontents.name==data;
                })

                var DataByNameAndDay =[];
                var totalProjHourInMilli=0 ;
                for(var i=1;i<8;i++){
                    groupDataByName.map(data=>{
                        if(data.day==moment().startOf('week').add(i,"days").add(req.body.number,"week").format("YYYY-MM-DD")){
                            DataByNameAndDay.push(data.hours);
                            let a = data.hours.split(':')
                            totalProjHourInMilli += (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
                        }
                    })
                    if(!DataByNameAndDay[i-1]) DataByNameAndDay.push('0:0:0')
                }
                // adding weekly timesheet to array
                GroupOfWeeklyTimeOfEachProject.push(DataByNameAndDay);
                // converting millisecond to HH:MM:SS
                let totalDur = moment.duration(totalProjHourInMilli,'milliseconds');
                let totalTrackerCurrUserTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60);
                // adding totaltime to array
                totalEachTimeInMilli.push(totalTrackerCurrUserTime)
             });

    return res.status(200).json({
        "type":"success",
        "startDate":moment().startOf('week').add(1,"days").format("DD/MM/YYYY"),
        "endDate": moment().endOf('week').add(1,"days").format("DD/MM/YYYY"),
        "timesheet":GroupOfWeeklyTimeOfEachProject,
        "projectName":[...ProjectNameSet],
        "totalTime" : totalEachTimeInMilli
    })
}

exports.getPreAndNextWeekTimeSheet = async(req,res,next)=>{
    /**-------------------------- Previous week Time Sheet ----------------------------------------------- */
    if(req.body.number<1){
            let timesheet = await TimeSheetSchema.aggregate([
                {$match:{
                    "day":{$gte:moment().startOf('week').add(1,"days").add(req.body.number,"week").format("YYYY-MM-DD")
                        ,$lte:moment().endOf('week').add(1,"days").add(req.body.number,"week").format("YYYY-MM-DD")}
                }},
                { $lookup: { from: "projectcontents", localField: "project_id", foreignField: "_id", as: "projectcontents" }},
                { $unwind: "$projectcontents" },
                { $sort: {'projectcontents.name': 1,'day':1}}
            ]);

             /**  Taking all project names from timesheet data**/
              var ProjectNameSet = new Set();
              timesheet.forEach(data=>{
                ProjectNameSet.add(data.projectcontents.name);
              })

              /*** Now Extracting Each days hours of every Project  ***/
              var GroupOfWeeklyTimeOfEachProject=[];
              var totalEachTimeInMilli=[];
              ProjectNameSet.forEach(data=>{
                    var groupDataByName = timesheet.filter(timedata=>{
                        return timedata.projectcontents.name==data;
                    })

                    var DataByNameAndDay =[];
                    var totalProjHourInMilli=0 ;
                    for(var i=1;i<8;i++){
                        groupDataByName.map(data=>{
                            if(data.day==moment().startOf('week').add(i,"days").add(req.body.number,"week").format("YYYY-MM-DD")){
                                DataByNameAndDay.push(data.hours);
                                let a = data.hours.split(':')
                                totalProjHourInMilli += (+a[0])*3600000+(+a[1])*60000+(+a[2])*1000;
                            }
                        })
                        if(!DataByNameAndDay[i-1]) DataByNameAndDay.push('0:0:0')
                    }
                    GroupOfWeeklyTimeOfEachProject.push(DataByNameAndDay);
                    // converting millisecond to HH:MM:SS
                    let totalDur = moment.duration(totalProjHourInMilli,'milliseconds');
                    let totalTrackerCurrUserTime = Math.floor(totalDur.asHours()%12)+":"+Math.floor(totalDur.asMinutes()%60)+":"+Math.floor(totalDur.asSeconds()%60);
                    // adding totaltime to array
                    totalEachTimeInMilli.push(totalTrackerCurrUserTime)
                 });


            return res.status(200).json({
                "type":"success",
                "startDate":moment().startOf('week').add(1,"days").add(req.body.number,"week").format("DD/MM/YYYY"),
                "endDate": moment().endOf('week').add(1,"days").add(req.body.number,"week").format("DD/MM/YYYY"),
                "timesheet":GroupOfWeeklyTimeOfEachProject,
                "projectName":[...ProjectNameSet],
                "totalTime" : totalEachTimeInMilli
            })
        }

        /**-------------------------current week timesheet ------------------------------------------------**/

    return res.status(200).json({

        "type":"success",
        "startDate":moment().startOf('week').add(1,"days").add(req.body.number,"week").format("DD/MM/YYYY"),
        "endDate": moment().endOf('week').add(1,"days").add(req.body.number,"week").format("DD/MM/YYYY")
    })
}


// -------------------------------------------- Logout code is here ---------------------------------------------

exports.logOut = async(req,res,next)=>{
    req.session.user = null;

    res.status(200).redirect('/account/login');

}



