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

//******  Initialize app ***************//
var app = express();

//***  session middleware ****/
app.use(cookieParser());
app.use(session({ secret: 'mySecretKey', resave: true, saveUninitialized: true }));

//******** include database ********//
var db = require('./config/database.js');

//******** include routes ********//
var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth');
var categoryRoute = require('./routes/category');

app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.set('layout', 'layouts/layout');

/**
 * middlewares
 */

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/nmd', express.static(path.join(__dirname, 'node_modules')));

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

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//*** use routes *****//
app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/category', categoryRoute);


//*** catch 404 and forward to error handler *****//
app.use(function(req, res, next) {
    res.status(404).render('error/404', { layout: 'layouts/layoutError', title: "Sorry, page not found" });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(res.locals.message, err);
    // render the error page
    res.status(err.status || 500);
    res.render('error/500');
});

module.exports = app;