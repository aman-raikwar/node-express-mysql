// Import mysql module
var mysql = require('mysql');

/**
 * Create database connection
 */

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node-express',
    multipleStatements: true,
});

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