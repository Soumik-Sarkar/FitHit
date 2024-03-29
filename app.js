if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const user = require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');


const userRoutes = require('./routes/users');
const gymRoutes = require('./routes/gyms');
const reviewRoutes = require('./routes/reviews');
const {MongoStore} = require("connect-mongo");
const MongoDBStore = require("connect-mongo")(session);


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/fithit';
//mongodb://localhost:27017/fithit
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'secret';

const store = new MongoDBStore({
    url : dbUrl,
    secret ,
    touchAfter : 24 * 60 * 60
})

const sessionConfig ={
    store,
    name: 'session',
    secret ,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/',userRoutes);
app.use('/gyms', gymRoutes);
app.use('/gyms/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})