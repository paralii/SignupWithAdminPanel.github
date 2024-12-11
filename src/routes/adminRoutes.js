// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const  {adminAuthenticated,adminUnAuthenticated }  = require('../middleware/adminAuthenticated');

// Route to get the admin dashboard
router.get('/dashboard', adminAuthenticated, adminController.adminDashboard);

// Route to create a new user
router.post('/add-user', adminAuthenticated, adminController.handleCreateUser);

// Route to update a user
router.post('/update-user/:id', adminAuthenticated, adminController.handleEditUser);

// Route to delete a user
router.post('/delete-user/:id', adminAuthenticated, adminController.deleteUser);

// Route to search for users
router.get('/search-user',  adminController.searchUser);

// Admin login and logout
router.get('/adminlogin', adminUnAuthenticated,adminController.adminLogin);
router.post('/adminlogin', adminController.handleadminLogin);
router.get('/logout', adminController.adminLogout);

//Create Admin
router.get('/createAdmin',  (req, res) => {
    res.render('admin/createAdmin', { title: 'Create Admin' });
});
router.post('/createAdmin', adminController.handleCreateAdmin);


module.exports = router;
