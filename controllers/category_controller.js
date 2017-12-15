var fs = require('fs');
var categoryModel = require('../models/category_model.js');
var logger = require('../config/log.js');
var papercut = require('papercut');
var sharp = require('sharp');


var category_controller = {
    /***********************Render Category listing view********************************/
    getAllCategories: function(req, res, next) {
        var id = req.query.parent_id;
        if (id != undefined) {
            parent = id;
        } else {
            parent = 0;
        }

        categoryModel.getParentCategories(parent).then(function(result) {
            console.log(result);
            res.render('category/index', { categories: result });
        });
    },

    /*********************** add new product category ********************************/
    addCategory: function(req, res, next) {
        var response = {
            success: true,
            msg: ""
        };
        req.checkBody('category', res.__("category_name_required.")).notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            logger.fatal("Errors in validate when update product status");
            logger.fatal(errors);
            response.success = false;
            response.msg = res.__("Please enter category name");
            res.json(response);
        } else {
            categoryModel.checkCategoryExists(req.body.category, 0).then(function(result) {
                if (result.length > 0) {
                    response.success = false;
                    response.msg = res.__("category_already_exists");
                    res.json(response);
                } else {
                    var currentDate = category_controller.getCuurentDate();
                    var category = {
                        name: req.body.category,
                        parent_id: 0,
                        created_at: currentDate
                    };
                    categoryModel.addCategory(category).then(function(result) {
                            response.msg = res.__("new_category_added");
                            res.json(response);
                        })
                        .catch(function(error) {
                            logger.fatal("Errors in add new category");
                            logger.fatal(error);
                            response.success = false;
                            response.msg = res.__("mysql_query_error_msg");
                            res.json(response);
                        });
                }
            });
        }
    },

    /*********************** get all parent categories ********************************/
    getParentCategories: function(req, res, next) {
        var id = req.query.parent_id;
        if (id != undefined) {
            parent = id;
        } else {
            parent = 0;
        }
        categoryModel.getParentCategories(parent).then(function(result) {
            res.json(result);
        });
    },

    /*********************** add subcategory ********************************/
    addSubcategory: function(req, res, next) {
        var response = {
            success: true,
            msg: ""
        };
        req.checkBody('sub_category', res.__("category_name_required.")).notEmpty();
        req.checkBody('parent_id', res.__("product_category_required")).notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            logger.fatal("Errors in validate when update product status");
            logger.fatal(errors);
            response.success = false;
            response.msg = res.__("Please select a product category");
            res.json(response);
        } else {
            categoryModel.checkCategoryExists(req.body.sub_category, req.body.parent_id).then(function(result) {
                if (result.length > 0) {
                    response.success = false;
                    response.msg = res.__("category_already_exists");
                    res.json(response);
                } else {
                    var currentDate = category_controller.getCuurentDate();
                    var category = {
                        name: req.body.sub_category,
                        parent_id: req.body.parent_id,
                        created_at: currentDate
                    };
                    categoryModel.addCategory(category).then(function(result) {
                            response.msg = res.__("category_updated");
                            res.json(response);
                        })
                        .catch(function(error) {
                            logger.fatal("Errors in add new category");
                            logger.fatal(error);
                            response.success = false;
                            response.msg = res.__("mysql_query_error_msg");
                            res.json(response);
                        });
                }
            });
        }
    },

    /*********************** update a category ********************************/
    updateCategory: function(req, res, next) {
        var response = {
            success: true,
            msg: ""
        };
        req.checkBody('parent_category_name', res.__("parent_category_name_required.")).notEmpty();
        req.checkBody('parent_category_id', res.__("product_category_id_required")).notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            logger.fatal("Errors in validate when update product status");
            logger.fatal(errors);
            response.success = false;
            response.msg = res.__("Something went wrong");
            res.json(response);
        } else {
            var parentId = req.body.parent_category_id;
            var parentName = req.body.parent_category_name;
            categoryModel.updateCategory(parentId, parentName).then(function(result) {
                    if (req.body.cat_id != undefined) {
                        var arr = [],
                            i;
                        if (req.body.cat_id.length == 1) {
                            categoryModel.updateCategory(req.body.cat_id, req.body.cat_name).then(function(result) {})
                        } else {
                            for (i = 0; i < req.body.cat_id.length; i++) {
                                arr[req.body.cat_id[i]] = req.body.cat_name[i];
                            }
                            arr.forEach(function(element, key) {
                                categoryModel.updateCategory(key, element).then(function(res) {})
                            });
                        }
                    }
                    response.msg = res.__("category_updated");
                    res.json(response);
                })
                .catch(function(error) {
                    logger.fatal("Errors in update category");
                    logger.fatal(error);
                    response.success = false;
                    response.msg = res.__("mysql_query_error_msg");
                    res.json(response);
                });
        }
    },

    /*********************** delete subcategory ********************************/
    deleteCategory: function(req, res, next) {
        var response = {
            success: true,
            msg: ""
        };
        var category_id = req.params.category_id;
        categoryModel.deleteCategory(category_id).then(function(result) {
                if (result) {
                    response.msg = res.__("category_delete_successfull");
                    res.json(response);
                } else {
                    response.success = false;
                    response.msg = res.__("general_error_try_again_msg");
                    res.json(response);
                }
            })
            .catch(function(error) {
                logger.fatal("Error on delete a product images");
                logger.fatal(error);
                response.success = false;
                response.msg = res.__("mysql_query_error_msg");
                response.errors = error;
                res.json(result);
            });
    },

    /*********************** delete primary category ********************************/
    deletePrimaryCategory: function(req, res, next) {
        var response = {
            success: true,
            msg: ""
        };
        var parent_id = req.params.parent_id;
        categoryModel.deleteCategory(parent_id).then(function(result) {
                if (result) {
                    categoryModel.deleteSubCategory(parent_id).then(function(result) {});
                    response.msg = res.__("category_delete_successfull");
                    res.json(response);
                } else {
                    response.success = false;
                    response.msg = res.__("general_error_try_again_msg");
                    res.json(response);
                }
            })
            .catch(function(error) {
                logger.fatal("Error on delete a product images");
                logger.fatal(error);
                response.success = false;
                response.msg = res.__("mysql_query_error_msg");
                response.errors = error;
                res.json(result);
            });
    },

    /*********************** get current date time ********************************/
    getCuurentDate: function() {
        var date = new Date();
        var curmonth = (date.getMonth() + 1);
        if (curmonth < 10)
            curmonth = "0" + curmonth;
        var curDate = date.getDate();
        if (curDate < 10)
            curDate = "0" + curDate;
        var dbdate = date.getFullYear() + "-" + curmonth + "-" + curDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return dbdate;
    },

}

module.exports = category_controller;