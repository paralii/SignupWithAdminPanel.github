const adminAuthenticated = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (req.session && req.session.admin) {
        return next(); 
    } else {
        res.redirect('/admin/adminlogin?message=Please%20login%20to%20continue');
    }
};

const adminUnAuthenticated = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (!req.session.admin) {
        return next();
    } else {
        res.redirect('/admin/dashboard');
    }
};

module.exports = 
    {adminAuthenticated,
    adminUnAuthenticated}
 ;
