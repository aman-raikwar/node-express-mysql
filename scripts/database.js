var mysql = require('mysql');
var dbconfig = require('../config/config');
var migration = require('../config/migration');
var seeder = require('../config/seeder');

/* Get Database and Table Prefix */
var databaseName = dbconfig.database;
var tablePrefix = dbconfig.tablePrefix;

/* Get Tables and Common Parameters */
var tables = migration.tables;
var commonTableParameters = migration.commonTableParameters;

var connection = mysql.createConnection(dbconfig.connection);
var databaseStatus = createDatabase(connection, databaseName);

if (databaseStatus) {
    tables.forEach(function(element) {
        var tableName = (typeof tablePrefix != 'undefined' && tablePrefix != '') ? tablePrefix + element.name : element.name;
        var tableParameters = element.parameters;
        var requireCommonParameters = element.requireCommonParameters;
        dropTable(connection, databaseName, tableName);
        createTable(connection, databaseName, tableName, tableParameters, requireCommonParameters, commonTableParameters);
    });

    /* Get Tables */
    var tables = seeder.tables;

    tables.forEach(function(element) {
        var tableName = (typeof tablePrefix != 'undefined' && tablePrefix != '') ? tablePrefix + element.name : element.name;
        var tableData = element.data;
        insertRecord(connection, databaseName, tableName, tableData);
    });
}

connection.end(function(err) {
    console.log('Connection Closed!');
});

/*================== DROP DATABASE ==================*/
function dropDatabase(connection, databaseName) {
    var sql = "DROP DATABASE IF EXISTS `" + databaseName + "`;";
    if (connection.query(sql)) {
        console.log('Database Dropped : `' + databaseName + '`');
        return true;
    } else {
        console.log('Unable to DROP Database : `' + databaseName + '`');
        return false;
    }
}

/*================== CREATE DATABASE ==================*/
function createDatabase(connection, databaseName) {
    dropDatabase(connection, databaseName);
    var sql = "CREATE DATABASE IF NOT EXISTS `" + databaseName + "` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;";
    if (connection.query(sql)) {
        var sql = "USE `" + databaseName + "`;";
        if (connection.query(sql)) {
            console.log('Database Created : `' + databaseName + '`');
            return true
        } else {
            console.log('Unable to USE Database : `' + databaseName + '`');
            return false;
        }
    } else {
        console.log('Unable to CREATE Database : `' + databaseName + '`');
        return false;
    }
}

/*================== CREATE TABLE ==================*/
function createTable(connection, databaseName, tableName, tableParameters, requireCommonParameters, commonTableParameters) {
    var sql = "	CREATE TABLE IF NOT EXISTS `" + databaseName + "`.`" + tableName + "` ( ";
    sql += tableParameters;

    if (requireCommonParameters) {
        sql += ", " + commonTableParameters;
    }

    sql += ") ENGINE = InnoDB DEFAULT CHARSET=utf8";

    if (connection.query(sql)) {
        console.log('Table Created : `' + tableName + '`');
    } else {
        console.log('Unable to CREATE Table : `' + tableName + '`');
    }
}

/*================== DROP TABLE ==================*/
function dropTable(connection, databaseName, tableName) {
    var sql = "DROP TABLE IF EXISTS `" + databaseName + "`.`" + tableName + "`;";
    if (connection.query(sql)) {
        console.log('Table Dropped : `' + tableName + '`');
    } else {
        console.log('Unable to DROP Table : `' + tableName + '`');
    }
}

function insertRecord(connection, databaseName, tableName, tableData) {
    var sql = "	INSERT INTO `" + databaseName + "`.`" + tableName + "` SET ? ";
    tableData.forEach(function(element) {
        connection.query(sql, element, function(err, rows) {
            if (rows) {
                console.log('Record Inserted : `' + tableName + '`, #' + rows.insertId);
            } else {
                console.log('Unable to INSERT Record : `' + tableName + '`');
            }
        });
    });
}