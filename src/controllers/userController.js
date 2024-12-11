const User = require('../models/User');
const bcrypt = require('bcrypt');

// Display the login page
const login = (req, res) => {
    const message = req.query.message || null;
    console.log("Message for login page:", message);
    res.render('Users/login', { title: 'Login Page', message });
};

// Display the signup page
const signup = (req, res) => {
    const message = req.query.message || null;
    console.log("Message for signup page:", message);
    res.render('Users/signup', { title: 'Signup Page', message });
};

// Handle user signup
const handlesignupUser = async (req, res) => {
    const { signupUsername, signupEmail, signupPassword } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({
            $or: [{ name: signupUsername }, { email: signupEmail }]
        });

        if (existingUser) {
            return res.redirect('/user/signup?message=Username%20or%20Email%20already%20exists.%20Please%20try%20a%20different%20one.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(signupPassword, 10);

        // Create a new user
        const newUser = new User({
            name: signupUsername,
            email: signupEmail,
            password: hashedPassword
        });

        // Save the new user
        await newUser.save();

        // Redirect to login with a success message
        res.redirect('/user/signup?message=Signup%20successful!%20You%20can%20now%20login.');
    } catch (error) {
        console.error('Error during signup:', error);
        res.redirect('/user/signup?message=An%20error%20occurred.%20Please%20try%20again.');
    }
};

// Handle user login
const handleloginUser = async (req, res) => {
    const { loginUsername, loginPassword } = req.body;

    try {
        // Find the user by username or email
        const existingUser = await User.findOne({
            $or: [{ name: loginUsername }, { email: loginUsername }]
        });

        if (!existingUser) {
            return res.redirect('/user/login?message=User%20not%20found');
        }

        // Compare the password with the hashed one in the database
        const isPasswordMatch = await bcrypt.compare(loginPassword, existingUser.password);
        if (isPasswordMatch) {
            // Set up session for the logged-in user
            req.session.user = { id: existingUser._id, name: existingUser.name, role: existingUser.role };
            res.redirect("/user/home");
            console.log("User logged in:", existingUser.name);
        } else {
            res.redirect('/user/login?message=Invalid%20password');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.redirect('/user/login?message=An%20error%20occurred%20during%20login');
    }
};

// Handle user logout
const handleLogout = async (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
                return res.redirect('/user/home?message=Logout%20failed');
            }

            // Manually clear session from MongoDB if needed
            const sessionStore = req.sessionStore;
            sessionStore.destroy(req.sessionID, (error) => {
                if (error) {
                    console.error('Error removing session from store:', error);
                } else {
                    console.log('Session successfully removed from MongoDB');
                }
            });

            // Clear the cookie
            res.clearCookie('connect.sid'); 
            res.redirect('/user/login?message=Successfully%20logged%20out');
        });
    } catch (error) {
        console.log('Error during logout:', error);
        res.redirect('/user/home?message=Logout%20failed');
    }
};

module.exports = {
    login,
    handleloginUser,
    signup,
    handlesignupUser,
    handleLogout
};
