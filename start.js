/**
 * Module dependencies.
 */

 const mongoose = require('mongoose');

 // import environmental variables from our variables.env file
 require('dotenv').config({
   path: 'variables.env'
 });
 
 // Connect to our Database and handle any bad connections
 mongoose.connect("mongodb+srv://shreyansh:WKv8gJans6YHosoK@cluster0.d9dm4uo.mongodb.net/node?retryWrites=true&w=majority", {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useUnifiedTopology: true
 }).then(() => {
   console.log('Connected to MongoDB Database...')
 });
 
 mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
 mongoose.connection.on('error', (err) => {
   console.error(`🚫 🚫 🚫 🚫 → ${err.message}`);
 });
 
 // Import all our models
 
 
 // Start our app!
 const app = require('./app');
 app.set('port', process.env.PORT || 8787);
 const server = app.listen(app.get('port'), () => {
   console.log(`Express is running → PORT ${server.address().port}`);
 });
