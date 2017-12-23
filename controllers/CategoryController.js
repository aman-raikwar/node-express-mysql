var fs = require('fs');
var Category = require('../models/Category');
var commonHelper = require('../helper/common_helper.js');

var CategoryController = {

    actionIndex: function(req, res, next) {
        var limit = 10;
        var total = 0;
        var page = parseInt(req.query.page) || 1;
        var offset = (limit * page) - limit;

        var orderParams;
        if (typeof req.query.orderColumn != 'undefined' && req.query.orderColumn != '' && typeof req.query.orderBy != 'undefined' && req.query.orderBy != '') {
            orderParams = {
                orderColumn: req.query.orderColumn,
                orderBy: req.query.orderBy
            };
        }

        var searchParams = {
            id: req.query.id,
            name: req.query.name,
            status: req.query.status
        };

        Category.countCategory(searchParams).then(function(result) {
            total = result[0].total;

            Category.getCategories(limit, offset, searchParams, orderParams).then(function(result) {
                res.render('category/index', {
                    categories: result,
                    current: page,
                    pages: Math.ceil(total / limit),
                    params: req.query,
                    user: req.user
                });
            });
        });
    },

    actionShow: function(req, res, next) {
        var category_id = req.params.category_id;
        var message = "Unable to show the Record!";

        if (typeof category_id != 'undefined' && category_id != '') {
            Category.singleCategory(category_id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    res.render('category/show', { category: result, params: req.body, user: req.user });
                } else {
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.redirect('/category/');
                }
            }).catch(function(error) {
                req.flash('type', 'danger');
                req.flash('message', message);
                res.redirect('/category/');
            });
        } else {
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/category/');
        }
    },

    actionCreate: function(req, res, next) {
        req.flash('type', '');
        req.flash('message', '');
        res.render('category/create', { params: req.body, user: req.user });
    },

    actionStore: function(req, res, next) {
        var message = "";

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "Please enter category name";
            req.flash('type', 'danger');
            req.flash('message', message);
            res.render('category/create', { params: req.body, user: req.user });
        } else {
            Category.checkCategoryExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    message = "Category '<b>" + req.body.name + "</b>' already exists!";
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.render('category/create', { params: req.body, user: req.user });
                } else {
                    var currentDate = commonHelper.getCurrentDateTime();
                    var category = { name: req.body.name, created_at: currentDate };
                    Category.addCategory(category).then(function(result) {
                        message = "Category added successfully!";
                        req.flash('type', 'success');
                        req.flash('message', message);
                        res.redirect('/category/');
                    }).catch(function(error) {
                        message = "Unable to add new Category!";
                        req.flash('type', 'danger');
                        req.flash('message', message);
                        res.render('category/create', { params: req.body, user: req.user });
                    });
                }
            });
        }
    },

    actionEdit: function(req, res, next) {
        var category_id = req.params.category_id;

        if (typeof category_id != 'undefined' && category_id != '') {
            Category.singleCategory(category_id).then(function(result) {
                res.render('category/edit', { category: result, params: req.body, user: req.user });
            });
        } else {
            var message = "Unable to edit Category!";
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/category/');
        }
    },

    actionUpdate: function(req, res, next) {
        var message = "";
        var category_id = req.params.category_id;
        var category = {};

        Category.singleCategory(category_id).then(function(result) {
            category = result;
        });

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "Please enter category name";
            req.flash('type', 'danger');
            req.flash('message', message);
            res.render('category/edit', { category: category, params: req.body, user: req.user });
        } else {
            Category.checkCategoryExists(req.body.name, category_id).then(function(result) {
                if (result.length > 0) {
                    message = "Category '<b>" + req.body.name + "</b>' already exists!";
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.render('category/edit', { response: response, params: req.body, category: category, user: req.user });
                } else {
                    var currentDate = commonHelper.getCurrentDateTime();
                    var categoryData = { name: req.body.name, status: req.body.status, updated_at: currentDate };
                    Category.updateCategory(categoryData, category_id).then(function(result) {
                        message = "Category updated successfully!";
                        req.flash('type', 'success');
                        req.flash('message', message);
                        res.redirect('/category/');
                    }).catch(function(error) {
                        message = "Unable to update Category!";
                        req.flash('type', 'danger');
                        req.flash('message', message);
                        res.render('category/edit', { response: response, params: req.body, category: category, user: req.user });
                    });
                }
            });
        }
    },

    actionDelete: function(req, res, next) {
        var response = { success: false, msg: "" };
        var category_id = req.params.category_id;

        Category.deleteCategory(category_id).then(function(result) {
            if (result) {
                response.success = true;
                response.msg = "Your category record has been deleted.";
                res.json(response);
            } else {
                response.msg = "Unable to delete this category!";
                res.json(response);
            }
        }).catch(function(error) {
            response.msg = "Unable to delete this category!";
            res.json(response);
        });
    },

    actionAllCategories: function(req, res, next) {
        var response = { success: false, msg: "", data: [] };
        Category.getAllCategories().then(function(result) {
            if (result) {
                response.success = true;
                response.msg = "Categories found!";
                response.data = result;
                res.json(response);
            } else {
                response.msg = "Unable to get categories!";
                res.json(response);
            }
        }).catch(function(error) {
            response.msg = "Unable to get categories!";
            res.json(response);
        });
    }

}

module.exports = CategoryController;