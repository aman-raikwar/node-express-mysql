var striptags = require('striptags');
var mysql = require('mysql');
var db = require('../config/database.js');
var Q = require("q");

var User = {

    getUsers: function(limit = 10, offset = 0, searchParams = {}, orderParams = { orderColumn: 'created_at', orderBy: 'DESC' }) {
        var deferred = Q.defer();
        var query = "SELECT tbl_users.id, username, email, role_id, tbl_roles.name as role_name, tbl_users.status";
        query += " FROM tbl_users JOIN tbl_roles ON tbl_users.role_id = tbl_roles.id "
        query += " WHERE tbl_users.is_deleted = 0 ";

        var orderBy = " ORDER BY tbl_users." + orderParams.orderColumn + " " + orderParams.orderBy + " ";
        var where = "";

        if (typeof searchParams.id != 'undefined' && searchParams.id != '') {
            where += " AND tbl_users.id = " + searchParams.id;
        }

        if (typeof searchParams.username != 'undefined' && searchParams.username != '') {
            where += " AND username LIKE '%" + striptags(searchParams.username) + "%' ";
        }

        if (typeof searchParams.email != 'undefined' && searchParams.email != '') {
            where += " AND email LIKE '%" + striptags(searchParams.email) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND tbl_users.status = " + searchParams.status;
        }

        if (typeof searchParams.role_id != 'undefined' && searchParams.role_id != '') {
            where += " AND role_id = " + searchParams.role_id;
        }

        query += where;
        query += orderBy + " LIMIT " + offset + ", " + limit;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    countUser: function(searchParams = {}) {
        var deferred = Q.defer();
        var query = "SELECT COUNT(id) as total FROM tbl_users WHERE is_deleted = 0";
        var where = "";

        if (typeof searchParams.id != 'undefined' && searchParams.id != '') {
            where += " AND id = " + searchParams.id;
        }

        if (typeof searchParams.username != 'undefined' && searchParams.username != '') {
            where += " AND username LIKE '%" + striptags(searchParams.username) + "%' ";
        }

        if (typeof searchParams.email != 'undefined' && searchParams.email != '') {
            where += " AND email LIKE '%" + striptags(searchParams.email) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND status = " + searchParams.status;
        }

        if (typeof searchParams.role_id != 'undefined' && searchParams.role_id != '') {
            where += " AND role_id = " + searchParams.role_id;
        }

        query += where;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }

            if (rows) {
                deferred.resolve(rows);
            } else {
                deferred.reject(new Error("Not User found!"));
            }
        });
        return deferred.promise;
    },

    singleUser: function(id) {
        var deferred = Q.defer();
        var query = "SELECT tbl_users.id, tbl_users.username, tbl_users.email, tbl_users.status, tbl_users.created_at, tbl_users.updated_at, tbl_roles.name as role_name, tbl_users_profile.first_name, tbl_users_profile.last_name, tbl_users_profile.about_me, tbl_users_profile.position, tbl_users_profile.phone, tbl_users_profile.location ";
        query += " FROM tbl_users JOIN tbl_roles ON tbl_users.role_id = tbl_roles.id "
        query += " JOIN tbl_users_profile ON tbl_users.id = tbl_users_profile.user_id "
        query += " WHERE tbl_users.is_deleted = 0 ";
        query += " AND tbl_users.id = " + striptags(id);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows[0]);
        });
        return deferred.promise;
    },

};

module.exports = User;