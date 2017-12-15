$(function() {
    var validator = $("#category_add_form").validate({
        rules: {
            category: {
                required: true,
            },
        },
        messages: {
            category: 'Please enter a category',
        },
        submitHandler: function(form) {
            var frm = $(form);
            var formData = $("#category_add_form").serialize();
            $.ajax({
                url: "/category/add",
                type: "POST",
                data: formData,
                beforeSend: function() {
                    $('#show-msg').html("");
                },
                success: function(response) {
                    if (response.success) {
                        $('#category_add_form')[0].reset();
                        $("#show_msg").attr('class', 'text-center alert alert-success');
                        $("#show_msg").html(response.msg);
                        $('#category-table').html('');
                        setTimeout(function() {
                            $('#show_msg').hide();
                        }, 5000);
                        loadCategories();
                    } else {
                        $("#show_msg").attr('class', 'text-center alert alert-danger');
                        $("#show_msg").html(response.msg);
                        setTimeout(function() {
                            $('#show_msg').hide();
                        }, 5000);
                    }
                },
                error: function() {}
            });
        }
    });

    loadCategories();

    $(document).on("click", ".sub-cat", function(event) {
        var parent_id = $(this).attr('category-id');
        var parent_cat_name = $(this).attr('category-name');
        $('#parent_category').val(parent_cat_name);
        $('#parent_category').attr('parent_id', parent_id);
        $('#parent_id').val(parent_id);
        $('#parent_category_id').val(parent_id);
        loadSubCategories(parent_id);
        saveSubCategory();
    });

    $("#sub_category_add_form").validate({
        rules: {
            sub_category: {
                required: true,
            },
        },
        messages: {
            sub_category: 'Please enter a sub category',
        },
        submitHandler: function(form) {
            var parent_id = $('#parent_id').val();
            var formData = $("#sub_category_add_form").serialize();
            $.ajax({
                url: "/category/add-subcategory",
                type: "POST",
                data: formData,
                beforeSend: function() {
                    $('#show-msg').html("");
                },
                success: function(response) {
                    if (response.success) {
                        $('#sub_cat').val('');
                        $("#show_msg_sub").html('');
                        $("#show_msg_sub").attr('class', 'text-center alert alert-success');
                        $("#show_msg_sub").html(response.msg);
                        setTimeout(function() {
                            $('#show_msg_sub').hide();
                        }, 5000);
                        loadSubCategories(parent_id);
                    } else {
                        $("#show_msg_sub").attr('class', 'text-center alert alert-danger');
                        $("#show_msg_sub").html(response.msg);
                        setTimeout(function() {
                            $('#show_msg_sub').hide();
                        }, 5000);
                    }
                },
                error: function() {}
            });
        }
    });

    function loadSubCategories(id) {
        var subCat = $("message#sub_category").html();
        var qty = $("message#qty").html();
        var action = $("message#action").html();
        $.ajax({
            url: "/category/get_parent_categories?parent_id=" + id,
            type: "GET",
            success: function(response) {
                $('#sub-category-table').html('');
                $('#update-sub-cat').hide();
                $('#update-sub-cat').show();
                if (response.length > 0) {
                    $('#sub-category-table').append('<tr class="sub-head"><td>' + subCat + '</td><td>' + qty + '.</td><td>' + action + '</td></tr>');
                    $.each(response, function(key, obj) {
                        $('#sub-category-table').append('<tr id="row-' + obj.id + '"><td><div class="input-block">\
                                              <input name="cat_name" value=' + obj.name + ' type="text">\
                                              </div></td>\
                                              <input name="cat_id" value=' + obj.id + ' type="hidden">\
                                              </div></td>\
                                              <td>50</td><td><div class="edit-info">\
                                              <a href="#" class="delete" row-id="' + obj.id + '"><img src="/images/delete-icon.png" alt="" class="delete-image"></a> </div></td>\
                                            </tr>');
                    });
                }
            },
            error: function() {}
        });
    }

    $(document).on("click", ".delete", function() {
        var category_id = $(this).attr("row-id");
        var deleteConfirmMess = $("message#delete_confirm_mess").html(),
            labelYes = $("message#label_yes").html(),
            labelNo = $("message#label_no").html();

        bootbox.confirm({
            message: deleteConfirmMess,
            buttons: {
                confirm: {
                    label: labelYes,
                    className: 'btn-success'
                },
                cancel: {
                    label: labelNo,
                    className: 'btn-danger'
                }
            },
            callback: function(result) {

                if (result) {
                    $.ajax({
                        url: "/category/delete/" + category_id,
                        type: "DELETE",
                        beforeSend: function() {
                            $("#myloading").show();
                            $('#show-msg').html("");
                        },
                        success: function(response) {
                            $("#myloading").hide();
                            if (response.success) {
                                $('#row-' + category_id).remove();
                            } else {
                                var try_message = $("message#try_message").html();
                                bootbox.alert(try_message);
                            }
                        },
                        error: function() {
                            $("#myloading").hide();
                        }
                    });
                }
            }
        });
    });

    $(document).on("click", "#deletePrimary", function() {
        var parent_id = $('#parent_id').val();
        var deleteConfirmMess = $("message#delete_confirm_mess").html(),
            labelYes = $("message#label_yes").html(),
            labelNo = $("message#label_no").html();
        if (parent_id != '' && parent_id != undefined) {
            bootbox.confirm({
                message: deleteConfirmMess,
                buttons: {
                    confirm: {
                        label: labelYes,
                        className: 'btn-success'
                    },
                    cancel: {
                        label: labelNo,
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) {
                        $.ajax({
                            url: "/category/delete-primary/" + parent_id,
                            type: "DELETE",
                            beforeSend: function() {
                                $("#myloading").show();
                                $('#show-msg').html("");
                            },
                            success: function(response) {
                                $("#myloading").hide();
                                if (response.success) {
                                    $('#edit_category_form')[0].reset();
                                    $('#rowId-' + parent_id).remove();
                                    $('#sub-category-table').html('');
                                } else {
                                    var try_message = $("message#try_message").html();
                                    bootbox.alert(try_message);
                                }
                            },
                            error: function() {
                                $("#myloading").hide();
                            }
                        });
                    }
                }
            });
        } else {
            var deleteError = $("message#delete_error").html();
            $("#show_msg_sub").attr('class', 'text-center alert alert-danger');
            $("#show_msg_sub").html(deleteError);
            setTimeout(function() {
                $('#show_msg_sub').hide();
            }, 5000);
        }
    });
});

function loadCategories() {
    var productCat = $("message#product_category").html();
    var qty = $("message#qty").html();
    $.ajax({
        url: "/category/get_parent_categories",
        type: "GET",
        success: function(response) {
            $('#category-table').html('');
            if (response.length > 0) {
                $('#category-table').append('<tr class="sub-head"><td>' + productCat + '</td>\
                <td>' + qty + '.</td>');
                $.each(response, function(key, obj) {
                    $('#category-table').append('<tr id="rowId-' + obj.id + '" class="sub-cat" category-id=' + obj.id + ' category-name="' + obj.name + '"><td>' + obj.name + '</td><td>50</td></tr>');
                });
            }
        },
        error: function() {}
    });
}

function saveSubCategory() {
    $("#edit_category_form").validate({
        rules: {
            "cat_name": "required"
        },
        messages: {
            "cat_name": "Cat Name required"
        },
        submitHandler: function(form) {
            $('#edit_category_form').ajaxSubmit(options);
        }
    });
}

function showResponse(responseText, statusText, xhr, $form) {
    if (responseText.success) {
        $("#show_msg_sub").attr('class', 'text-center alert alert-success');
        $("#show_msg_sub").html(responseText.msg);
        setTimeout(function() {
            $('#show_msg_sub').hide();
        }, 5000);
        loadCategories();
    } else {
        $("#show_msg_sub").attr('class', 'text-center alert alert-danger');
        $("#show_msg_sub").html(responseText.msg);
        setTimeout(function() {
            $('#show_msg_sub').hide();
        }, 5000);
    }
}

function showRequest(formData, jqForm, options) {
    // $("#myloading").show();
    //return true;
}
var options = {
    beforeSubmit: showRequest, // pre-submit callback 
    success: showResponse // post-submit callback 
};

function saveForm(type) {
    if (type == 'addParent') {
        $("#category_add_form").submit();
    }
    if (type == 'addSubCat') {
        $("#sub_category_add_form").submit();
    }
    return true;
}