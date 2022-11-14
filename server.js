const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const db = require('./db');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

// import route modules
const homeRoute = require('./routes/home.routes');
const notesRotue = require('./routes/notes.routes');
const loginRoute = require('./routes/login.routes');
const logoutRoute = require('./routes/logout.routes');
const signupRoute = require('./routes/signup.routes');

// ejs middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware - static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware - parametre decoder
app.use(express.urlencoded({ extended: true }));

// save session to postgres database
app.use(
    session({
        secret: "web2-lab2",
        resave: false,
        store: new pgSession({ pool: db.pool }),
        saveUninitialized: true,
    })
)


// define routes
app.use('/', homeRoute);
app.use('/notes', notesRotue);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/signup', signupRoute);

// start server on port 3000
app.listen(3000);