var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var expressValidator = require('express-validator');
var flash = require('express-flash');

var passport = require('passport');
require('./config/passport')(passport);

//******  Initialize app ***************//
var app = express();

//***  session middleware ****/
app.use(cookieParser());
app.use(session({ secret: 'aman9425388641raikwar', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//******** include database ********//
var db = require('./config/database.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

/**
 * middlewares
 */

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Enable CORS from client-side
 */

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

//*** express validator middleware *****//
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) { formParam += '[' + namespace.shift() + ']'; }
        return { param: formParam, msg: msg, value: value };
    }
}));

//********************************//
//******** Front Routes ********//
//********************************//
var frontSiteRoute = require('./routes/front/site');

//********************************//
//******** Admin Routes ********//
//********************************//
var adminIndexRoute = require('./routes/admin/index');
var adminAuthRoute = require('./routes/admin/auth');
var adminCategoryRoute = require('./routes/admin/category');
var adminSkillRoute = require('./routes/admin/skill');
var adminUserRoute = require('./routes/admin/user');


//********************************//
//******** Front Use Routes ********//
//********************************//
app.use('/', frontSiteRoute);

//********************************//
//******** Admin Use Routes ********//
//********************************//
app.use('/admin', adminIndexRoute);
app.use('/admin/auth', adminAuthRoute);
app.use('/admin/category', adminCategoryRoute);
app.use('/admin/skill', adminSkillRoute);
app.use('/admin/users', adminUserRoute);


app.route('/').get(function(req, res, next) {
    res.locals.layout = "front/layouts/layout";
    next();
});
app.route('/admin*').get(function(req, res, next) {
    res.locals.layout = "admin/layouts/layout";
    next();
});

app.all('/admin*', function(req, res, next) {
    console.log("req.user=>>>", req.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        next();

    // if they aren't redirect them to the sign-in page
    res.redirect('/admin/auth/sign-in');
});


//*** catch 404 and forward to error handler *****//
app.use(function(req, res, next) {
    res.status(404).render('admin/error/404', { layout: 'admin/layouts/layoutError', title: "Sorry, page not found" });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(res.locals.message, err);
    // render the error page
    res.status(err.status || 500);
    res.render('admin/error/500');
});

module.exports = app;