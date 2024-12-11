const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Admin login page
const adminLogin = (req, res) => {
    const message = req.query.message; 
    res.render('Admin/adminLogin', {
        title: 'Admin Login',
        message, 
    });
};

// Handle admin login
const handleadminLogin = async (req, res) => {
    const { adminUsername, adminPassword } = req.body;

    try {
        const admin = await Admin.findOne({ adminname: adminUsername });
        if (!admin) {
            return res.redirect('/admin/adminlogin?message=Admin%20not%20found');
        }

        const isPasswordMatch = await bcrypt.compare(adminPassword, admin.password);
        if (isPasswordMatch) {
            req.session.admin = admin; 
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/admin/adminlogin?message=Invalid%20password');
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        res.redirect('/admin/adminlogin?message=An%20error%20occurred%20during%20login');
    }
};

// Admin dashboard page (show users)
const adminDashboard = async (req, res) => {
    const message = req.query.message; 
    try {
        const users = await User.find(); 
        res.render('Admin/dashboard', {
            title: 'Admin Dashboard',
            admin: req.session.admin, 
            users: users.length > 0 ? users : null, 
            message, 
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.redirect('/admin/dashboard?message=Server%20error%20occurred');
    }
};

// Handle creating a new user
const handleCreateUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name: username, email, password: hashedPassword });

        await newUser.save();
        res.redirect('/admin/dashboard?message=User%20created%20successfully');
    } catch (error) {
        console.error("Error creating user:", error);
        res.redirect('/admin/dashboard?message=Error%20creating%20user');
    }
};

// Handle editing a user
const handleEditUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const updatedUser = {
            name: username,
            email,
        };

        if (password) {
            updatedUser.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(id, updatedUser);
        res.redirect('/admin/dashboard?message=User%20updated%20successfully');
    } catch (err) {
        console.error("Error updating user:", err);
        res.redirect('/admin/dashboard?message=Error%20updating%20user');
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.redirect('/admin/dashboard?message=User%20deleted%20successfully');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.redirect('/admin/dashboard?message=Error%20deleting%20user');
    }
};

// Admin logout
const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect('/admin/dashboard?message=Error%20during%20logout');
        }
        res.redirect('/admin/adminlogin?message=Logged%20out%20successfully');
    });
};

// Handle creating a new admin
const handleCreateAdmin = async (req, res) => {
    const { adminUsername, adminPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new Admin({ adminname: adminUsername, password: hashedPassword });

        await newAdmin.save();
        res.redirect('/admin/adminLogin?message=Admin%20created%20successfully');
    } catch (error) {
        console.error("Error creating admin:", error);
        res.redirect('/admin/adminLogin?message=Error%20creating%20admin');
    }
};

// Handle user search (search by username or email)
const searchUser = async (req, res) => {
    const { query } = req.query;

    try {
        const users = await User.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
            ],
        });

        res.render('Admin/dashboard', {
            title: 'Admin Dashboard',
            admin: req.session.admin,
            users: users.length > 0 ? users : null,
            message: users.length > 0
                ? `Found ${users.length} user(s) matching "${query}"`
                : `No users found matching "${query}"`,
        });
    } catch (error) {
        console.error("Error searching user:", error);
        res.redirect('/admin/dashboard?message=Error%20searching%20user');
    }
};

module.exports = {
    adminLogin,
    handleadminLogin,
    adminDashboard,
    adminLogout,
    handleCreateUser,
    handleEditUser,
    deleteUser,
    handleCreateAdmin,
    searchUser,
};
