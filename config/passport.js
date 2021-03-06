// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('./database.js');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        var sql = "SELECT tbl_users.id, username, email, CONCAT(first_name, ' ', last_name) as full_name, first_name, last_name, about_me, position, phone, location FROM tbl_users JOIN tbl_users_profile ON tbl_users.id=tbl_users_profile.user_id WHERE tbl_users.id = ?";
        db.connection.query(sql, [id], function(err, rows) {
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, function(req, username, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        var sql = "SELECT * FROM tbl_users WHERE username = ?";
        db.connection.query(sql, [username], function(err, rows) {
            if (err)
                return done(err);

            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
                var sql = "SELECT * FROM tbl_users WHERE email = ?";
                var email = req.body.email;
                db.connection.query(sql, [email], function(err, rows) {
                    if (err)
                        return done(err);

                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = { username: username, email: email, password: bcrypt.hashSync(password, null, null) };
                        var insertQuery = "INSERT INTO tbl_users ( username, email, password ) values (?,?,?)";

                        db.connection.query(insertQuery, [newUserMysql.username, newUserMysql.email, newUserMysql.password], function(err, rows) {
                            newUserMysql.id = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    }
                });
            }
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, function(req, username, password, done) {
        // callback with email and password from our form
        db.connection.query("SELECT * FROM tbl_users WHERE username = ?", [username], function(err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        });
    }));
};