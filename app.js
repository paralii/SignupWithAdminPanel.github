const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const userRoute = require('./src/routes/userRoute.js');
const adminRoutes = require('./src/routes/adminRoutes.js');

const app = express();

//set nocache
const nocache = require('nocache');
app.use(nocache());
app.use((req, res, next) => {
    if (req.path.startsWith('/user/homepage') || req.path.startsWith('/admin/login')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
})

//session handling
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/Login',
            collectionName: 'session'
        }),
        cookie: { 
            secure: false, 
            maxAge: 60 * 60 * 1000 
        }
    })
);


//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting the view engine 
app.set('views',path.join(__dirname,'src/views'));
app.set('view engine','ejs');

//deafult route
app.get('/', (req, res) => {
    res.redirect('/user/signup');
});

//Routes
app.use('/user', userRoute);
app.use('/admin', adminRoutes);

// error route
app.use('*', (req, res) => {
    res.status(404).render('error', {
        title:'Page not found',
        message:'Sorry, the page is not available',
        errorCode:404
    });
});

//connect DataBase
const connect = mongoose.connect("mongodb://localhost:27017/Login");
connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Can't connect to the Database!")
});

//port
const port =process.env.PORT || 3069;

//starting the serever
app.listen(port,() => console.log(`Server Started on http://localhost:${port}`));