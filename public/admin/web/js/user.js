// Website Url
var path = window.location.origin + window.location.pathname;
// Search Params
var idParam = params.id;
var usernameParam = params.username;
var emailParam = params.email;
var roleParam = params.role;
var statusParam = params.status;
// Order Column and Order By
var orderColumnParam = params.orderColumn;
var orderByParam = params.orderBy;

$(function() {

    $(document).on('click', '.sort', function() {
        orderColumnParam = $(this).data('type');
        orderByParam = $(this).data('sort');
        window.location.href = path + getParams();
    });

    $(document).on('click', '.reset-search', function() {
        window.location.href = window.location.origin + window.location.pathname;
    });

    $(document).on('click', '.delete-user', function() {
        var user_id = $(this).data('user');
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function() {
            $.ajax({
                url: '/user/delete/' + user_id,
                type: 'DELETE',
                success: function(response) {
                    if (response.success) {
                        swal("Deleted!", response.msg, "success");
                        $('.row-' + user_id).remove();
                    } else {
                        swal("Deleted!", response.msg, "error");
                    }
                }
            });
        });
    });

    $(document).on('keypress', '.id-change', function(e) {
        if (e.keyCode == 13) {
            idParam = $(this).val();
            window.location.href = path + getParams();
        }
    });

    $(document).on('keypress', '.username-change', function(e) {
        if (e.keyCode == 13) {
            usernameParam = $(this).val();
            window.location.href = path + getParams();
        }
    });

    $(document).on('keypress', '.email-change', function(e) {
        if (e.keyCode == 13) {
            emailParam = $(this).val();
            window.location.href = path + getParams();
        }
    });

    $(document).on('change', '.role-change', function() {
        roleParam = $(this).val();
        window.location.href = path + getParams();
    });

    $(document).on('change', '.status-change', function() {
        statusParam = $(this).val();
        window.location.href = path + getParams();
    });

});

function getParams() {
    var pathParams = '';

    if (typeof idParam != 'undefined' && idParam != '') {
        if (pathParams != '') {
            pathParams += '&id=' + idParam;
        } else {
            pathParams += '?id=' + idParam;
        }
    }

    if (typeof usernameParam != 'undefined' && usernameParam != '') {
        if (pathParams != '') {
            pathParams += '&username=' + usernameParam;
        } else {
            pathParams += '?username=' + usernameParam;
        }
    }

    if (typeof emailParam != 'undefined' && emailParam != '') {
        if (pathParams != '') {
            pathParams += '&email=' + emailParam;
        } else {
            pathParams += '?email=' + emailParam;
        }
    }

    if (typeof roleParam != 'undefined' && roleParam != '') {
        if (pathParams != '') {
            pathParams += '&role=' + roleParam;
        } else {
            pathParams += '?role=' + roleParam;
        }
    }

    if (typeof statusParam != 'undefined' && statusParam != '') {
        if (pathParams != '') {
            pathParams += '&status=' + statusParam;
        } else {
            pathParams += '?status=' + statusParam;
        }
    }

    if (typeof orderColumnParam != 'undefined' && orderColumnParam != '' && typeof orderByParam != 'undefined' && orderByParam != '') {
        if (pathParams != '') {
            pathParams += "&orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
        } else {
            pathParams += "?orderColumn=" + orderColumnParam + "&orderBy=" + orderByParam;
        }
    }

    return pathParams;
}