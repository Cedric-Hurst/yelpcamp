if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// npm
const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const User = require('./models/user');

const AppError = require('./utils/AppError');

const app = express();
const path = require('path');

// routes
const campRoutes = require('./routes/camps');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const dbUrl = 'mongodb://127.0.0.1:27017/camps2';

mongoose.set('strictQuery', true);// suppress deprecation warnings

main().catch(err => {
    console.log('ERROR #*#*#*#*#*#*#*#*#*#*#**#*#*#*#*');;
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
    console.log('connection to server established');
}

app.engine('ejs', ejsMate);
app.set('view engine', path.join(__dirname, 'views')); // connect views dir
app.set('view engine', 'ejs'); // to use ejs flies

app.use(express.urlencoded({extended:true}));// needed for getting request body
app.use(methodOverride('_method'))// needed for updating data and deleting
app.use(express.static(path.join(__dirname, 'public')));// needed for serving static files from public dir

const secret = process.env.SECRET || 'thiswillbeabettersecret';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on('error', (err) => {
    console.log('session store error',err);
})
// Session
const sessionConfig = {
    name: '#%C%$J.ses',
    secret,
    resave: false, // deprecation suppression
    saveUninitialized: true, // deprecation suppression
    cookie: {
        httpOnly: true, // extra security so user can not use cross-site scripting to access cookie
        //secure: true, // only works when in production mode, cookies can only be configured over https
        expires: Date.now() + 1000 * 24 * 60 * 60 * 7, // milliseconds, hrs, mins, seconds, and days (one week in milliseconds)
        maxAge: 1000 * 24 * 60 * 60 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());// needed for connect-flash
app.use(mongoSanitize());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dnz2ickgt/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dnz2ickgt/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dnz2ickgt/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dnz2ickgt/" ];
 
app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/dnz2ickgt/",
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
                mediaSrc   : [ "https://res.cloudinary.com/dnz2ickgt/" ],
                childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
); // security stuff

app.use(passport.initialize()); // needed for passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


//globals
// middleware that allows the use of chosen keywords for flash on all view pages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');// set res.locals.(chosen keyword) to use on view = flash(keyword 'success')
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// routes
app.use('/', userRoutes);
app.use('/camps', campRoutes);
app.use('/camps/:id/reviews', reviewRoutes);


// home
app.get('/', function (req, res) {
    res.render('index');
});


// Catch all unknown site requests
app.all('*', (req, res, next) => { 
    next(new AppError(404,'page not found'))
})
// Error handler
app.use((err, req, res, next) => { 
    const { status = 500, message = 'uh oh something not right', stack} = err;
    res.status(status).render('error', { message, status, stack});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('connection to port established');
});