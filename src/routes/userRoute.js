const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const userAuth = require('../middleware/userAuthenticated');

// Login routes
router.get('/login',userAuth.userUnAuthenticated, userController.login);
router.post('/login', userController.handleloginUser);

// Signup routes
router.get('/signup',userAuth.userUnAuthenticated, userController.signup);
router.post('/signup', userController.handlesignupUser);

// Home route (protected)
router.get('/home', userAuth.userAuthenticated, (req, res) => {
    res.render('Users/Homepage', { user: req.session.user });
});

// Logout route
router.get('/logout', userController.handleLogout);

module.exports = router;
