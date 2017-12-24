// Import mysql module
var mysql = require('mysql');
var dbconfig = require('../config/config');

/**
 * Create database connection
 */

dbconfig.connection.database = dbconfig.database;
var connection = mysql.createConnection(dbconfig.connection);

/**
 * Check for error in database connection
 */

connection.connect(function(error, res) {
    if (error) {
        res.json({ "Error": true, "Message": "Could not connect to Database!" });
    } else {
        console.log("Connected!");
    }
});

module.exports.connection = connection;