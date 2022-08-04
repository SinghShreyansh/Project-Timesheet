const UserSchema = require('../../models/UserSchema');


exports.usersData = async (req,res,next)=>{
    var arr = [];
    UserSchema.find({}, function (err, docs) {
        // console.log(docs.details);

        docs.forEach(doc =>{
            const data = {
                "name":doc.name,
                "email":doc.email,
                "role":doc.role==1?"admin":"user",
                "status":doc.status
            }

            arr.push(data)
            // console.log(doc.name);
        })
        // console.log(arr);

        return res.json(arr);
        // return;
    });
}