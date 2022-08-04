const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../../../handlers/errorHandlers');
const {isAuthenticated} = require('../../../handlers/passport');
const accountController = require('../../../controllers/admin/accountController');
// const { catchErrors } = require('../../../handlers/errorHandlers');



router.get('/user',isAuthenticated,
  accountController.user
);

router.get('/adduser',isAuthenticated,
  accountController.addUser
);

router.post('/adduser',
  accountController.addUserData
);



router.get('/dashboard',isAuthenticated,
accountController.provideDashboard)

router.get('/login',
 accountController.loginPage)


router.post('/login',
  accountController.adminLogin
);


router.get('/project',isAuthenticated,
accountController.provideProjects)

// ----------------------------------- Add Project page route starts here -----------------------------------

router.get('/addproject',isAuthenticated,
accountController.addProject)

router.post('/addproject',isAuthenticated,
accountController.addProjectData)

// ------------------------------------------ assign project route starts here --------------------------------

router.get('/add_assign_project',isAuthenticated,
accountController.addAssignProject)

router.post('/add_assign_project',isAuthenticated,
accountController.addAssignProjectData)

// ------------------------------------------ user page route start here --------------------------------------

router.post('/checkpassword',
accountController.checkAdminPassword)

router.post('/getUserPassword',
accountController.getUserPassword)

router.get('/getedituser?',
accountController.getEditUser)

router.post('/edituser?',
accountController.editUser)

// -------------------------------------- tracker route start -------------------------------------

router.get('/tracker',
accountController.getTracker)

router.post('/start_tracker',
accountController.startTracker)

router.post('/stop_tracker',
accountController.stopTracker)

router.post('/getSelectDateTracker',
accountController.getSelectDateTracker)

router.post('/tracker/edithour',
accountController.editTrackerHour)

//--------------------------------------- timesheet router start -------------------------------


router.get('/timesheet',
accountController.getTimeSheet)

router.post('/getCurrWeekData',
accountController.getCurrWeekTimeSheet)

router.post('/getPreWeekData',
accountController.getPreAndNextWeekTimeSheet)


router.get('/logout',isAuthenticated,
 accountController.logOut)


module.exports = router;