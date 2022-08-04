// const User = require('../../models/User');
// const Feed = require('../../models/Feed');
// const Store = require('../../models/Store');
// const Tag = require('../../models/Tag');

// exports.getDashboard = async (req, res, next) => {
  // const userPromise = User.countDocuments();
  // const feedPromise = Feed.countDocuments();
  // const storePromise = Store.countDocuments();
  // const tagPromise = Tag.countDocuments();

  // const [userCount, feedCount, storeCount, tagCount] = await Promise.all([userPromise, feedPromise, storePromise, tagPromise]);

  // res.render('admin/dashboard', {
  //   title: 'Dashboard',
  //   userCount,
  //   feedCount,
  //   storeCount,
  //   tagCount
  // });
//   return;
// };

const UserSchema = require('../../models/UserSchema');
const response = require('../../handlers/response')


exports.addUser = async(req,res,next)=>{
  // console.log(req)

  // let role = req.body.role==="admin"?1:2;

  const userData = {
    "name":req.body.name,
    "email":req.body.email,
    "password":req.body.password,
    "role":req.body.role,
    "status":req.body.status,

  }
     UserSchema.create(userData,(err, data) => {
      if(err){
          //internal server error 
          res.status(500).send(err)
      }else {
          
          res.status(200).json(response.responseSuccess('New User Created',data,200))

      }
  })


  
   
   
}