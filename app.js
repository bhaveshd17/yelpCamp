if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMateEngine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const AppError = require('./utils/AppError');
const User = require('./model/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')(session);

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/review');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

    .then(() => {
        console.log('Mongo Connected..');
    })
    .catch((err) => {
        console.log('OOPs Mongo Connection Error!!');
        console.log(err);
    })

app.engine('ejs', ejsMateEngine)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeagoodsecret';
const store = new MongoStore({
    url:dbURL,
    secret,
    touchAfter:24*60*60
})
store.on("error", function(e) {
    console.log("Session stored error")
})

const sessionConfig = {
    store,
    name:"session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig))
app.use(flash());




app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new AppError('Not Found!!', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong'
    res.status(status).render('error', { err });
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening On Port ${port}`)
})