var striptags = require('striptags');
var mysql = require('mysql');
var db = require('../config/database.js');
var Q = require("q");

var Skill = {

    checkSkillExists: function(name, skill_id) {
        var deferred = Q.defer();
        var query = "SELECT id, category_id, name FROM tbl_skills WHERE ";
        var data = { name: striptags(name) };
        var where = "";

        if (typeof name != 'undefined' && name != '') {
            where += " name = '" + striptags(name) + "'";
        }

        if (typeof skill_id != 'undefined' && skill_id != '') {
            where += " AND id != " + striptags(skill_id);
        } else {
            where += " AND is_deleted = 0";
        }

        query += where;
        query = mysql.format(query, where);

        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows);
        });
        return deferred.promise;
    },

    addSkill: function(data) {
        var deferred = Q.defer();
        var query = "INSERT INTO tbl_skills SET ?";
        data.name = striptags(data.name);

        db.connection.query(query, data, function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            if (result) {
                deferred.resolve(result.insertId);
            }
        });
        return deferred.promise;
    },

    getSkills: function(limit = 10, offset = 0, searchParams = {}, orderParams = { orderColumn: 'created_at', orderBy: 'DESC' }) {
        var deferred = Q.defer();
        var query = "SELECT tbl_skills.id, tbl_categories.name as category_name, tbl_skills.name, tbl_skills.status, tbl_skills.created_at, tbl_skills.updated_at FROM tbl_skills JOIN tbl_categories ON tbl_skills.category_id = tbl_categories.id WHERE tbl_skills.is_deleted = 0";
        var orderBy = " ORDER BY " + orderParams.orderColumn + " " + orderParams.orderBy + " ";
        var where = "";

        if (typeof searchParams.id != 'undefined' && searchParams.id != '') {
            where += " AND tbl_skills.id = " + searchParams.id;
        }

        if (typeof searchParams.category != 'undefined' && searchParams.category != '') {
            where += " AND tbl_skills.category_id = " + searchParams.category;
        }

        if (typeof searchParams.name != 'undefined' && searchParams.name != '') {
            where += " AND tbl_skills.name LIKE '%" + striptags(searchParams.name) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND tbl_skills.status = " + searchParams.status;
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

    singleSkill: function(skill_id) {
        var deferred = Q.defer();
        var skill_id = striptags(skill_id);
        var query = "SELECT tbl_skills.id, category_id, tbl_categories.name as category_name, tbl_skills.name, tbl_skills.status, tbl_skills.created_at, tbl_skills.updated_at FROM tbl_skills JOIN tbl_categories ON tbl_skills.category_id = tbl_categories.id WHERE tbl_skills.id=" + skill_id + " AND tbl_skills.is_deleted = 0";
        console.log(query);
        db.connection.query(query, function(err, rows) {
            if (err) {
                deferred.reject(new Error(err));
            }
            deferred.resolve(rows[0]);
        });
        return deferred.promise;
    },

    updateSkill: function(skill, skill_id) {
        var deferred = Q.defer();
        var query = 'UPDATE tbl_skills SET ? WHERE ?';
        skill.name = striptags(skill.name);
        skill.status = striptags(skill.status);

        db.connection.query(query, [skill, { id: striptags(skill_id) }], function(error, result, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    },

    deleteSkill: function(skill_id) {
        var deferred = Q.defer();
        var query = "UPDATE tbl_skills SET is_deleted = 1 WHERE ?";
        db.connection.query(query, { id: striptags(skill_id) }, function(error, results, fields) {
            if (error) {
                deferred.reject(new Error(error));
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    },

    countSkill: function(searchParams = {}) {
        var deferred = Q.defer();
        var query = "SELECT COUNT(id) as total FROM tbl_skills WHERE is_deleted = 0";
        var where = "";

        if (typeof searchParams.name != 'undefined' && searchParams.name != '') {
            where += " AND name LIKE '%" + striptags(searchParams.name) + "%' ";
        }

        if (typeof searchParams.status != 'undefined' && searchParams.status != '') {
            where += " AND status = " + searchParams.status;
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
                deferred.reject(new Error("Not skill found!"));
            }
        });
        return deferred.promise;
    },

};

module.exports = Skill;