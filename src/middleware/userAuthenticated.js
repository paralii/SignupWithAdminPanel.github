const userAuthenticated = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (req.session.user) {
        next(); 
    } else {
        res.redirect('/user/login?message=Please%20login%20to%20continue');
    }
};
const userUnAuthenticated = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (!req.session.user) {
        next(); 
    } else {
        res.redirect('/user/home');
    }
};

module.exports =  { userAuthenticated,userUnAuthenticated };
