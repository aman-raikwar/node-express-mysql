var tableProduct = "";
var deleteArrayOfImage = [];
var jqSelectData = {};
var owl1, owl2;

function setProductImagePath(companyId, productId, fileName, type) {
    var path = '';
    if (type === 'thumb') {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + type + '/' + fileName;
    } else {
        path = '/uploads/companies/' + companyId + '/products/' + productId + '/images/' + fileName;
    }
    return path;
}

function sync2Template(path, id) {
    var html = '';
    html += '<div class="item"><div class="img-one"><a href="#">';
    html += '<img alt="" src="' + path + '">';
    html += '</a><ul class="detail-info">';
    html += '<li><a href="#" data-toggle="tooltip" data-id="' + id + '" class="delete_image" data-placement="bottom" title="" data-original-title="Delete">';
    html += '<img src="/images/delete-icon1.png" alt=""></a></li>';
    html += '<li><a href="#" data-toggle="tooltip" class="primary_image" data-placement="bottom" title="" data-original-title="Set Primary">';
    html += '<img src="/images/star1.png" alt=""></a></li></ul></div></div>';
    return html;
}

function qutityListing(product_id) {
    App.datatables();
    $("#quantity_datatable").dataTable().fnDestroy();
    $('#quantity_datatable').dataTable({
        //"processing": true,
        "initComplete": function (settings, json) {
            calulateQuantity();
        },
        "serverSide": true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search..."
        },
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": "/product/get-product-quantity/" + product_id,
        },
        "columns": [{
                //"data": "date",
                "mRender": function (data, type, row) {
                    var date = row.date;
                    var dateArry = date.split('-');
                    var dateDisplay = dateArry[2] + '/' + dateArry[1] + '/' + dateArry[0];
                    var html = '<div class="date-picker-block xxx"><input value="' + dateDisplay + '" class="input-fill my_datepicker" '
                            + 'type="text" data-date-format="dd/mm/yyyy"><span><img src="/images/calendra.png" alt=""></span></div>'
                     + '<span style="display:none" class="date_display_span">' + dateDisplay + '</span>';
                    return html;
                }
            }, {
                "data": "customer",
                "mRender": function (data, type, row) {
                    return '<input type="text" value="' + row.customer_name + '" class="input-fill typeheadCustomer">' +
                            '<input type="hidden" value="' + row.customer_id + '" class="idInput">';
                }
            }, {
                "mRender": function (data, type, row) {
                    var upload = parseInt(row.upload);
                    if (upload !== 0) {
                        return '<input type="text" value="' + upload + '" class="input-fill qtyInput">';
                        //+ '<span class="productQuantitySpan">' + upload + '</span>';
                    } else {
                        return '<input readonly type="text" value="' + upload + '" class="input-fill">';
                    }
                }
            }, {
                "mRender": function (data, type, row) {
                    var upload = parseInt(row.download);
                    if (upload !== 0) {
                        return '<input type="text" value="' + upload + '" class="input-fill qtyInput">';
                        // + '<span class="productQuantitySpan">' + upload + '</span>';
                    } else {
                        return '<input readonly type="text" value="' + upload + '" class="input-fill">';
                    }
                }
            }, {
                "data": "object"
            }, {
                mRender: function (data, type, row) {
                    return '<div class="edit-info editQty"><a href="#" data-id="' + row.id + '" class="edit saveProductQuantity"><img src="/images/edit-icon.png" alt=""></a>' +
                            '<a href="#" data-id="' + row.id + '" class="delete deleteProductQuantity"><img src="/images/delete-icon.png" alt=""></a> </div>'
                            + '<div style="display:none" class="edit-info saveQty"><a href="#" data-id="' + row.id + '" class="edit saveProductQuantity"><img src="/images/edit-icon.png" alt=""></a></div>';
                }
            }],
        'scrollCollapse': true,
        'ordering': false,
        'order': [
            [1, 'DESC']
        ],
        'searching': false,
        'paging': false
    });
}

jQuery(function () {
    // /customer/get?term=test
    var customer = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/customer/get?term=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#quantity_datatable').on('click', '.typeheadCustomer', function () {
        if (!jQuery(this).hasClass('tt-input')) {
            var selectedCustomer;
            $(this).typeahead(null, {
                name: 'product_search',
                display: 'name',
                source: customer,
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'unable to find any customer that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<div><strong>{{name}}</strong> – {{email}}</div>')
                }
            });
            $(this).focus();
            $(this).bind('typeahead:select', function (ev, customer) {
                var parent = $(this).parents('tr');
                parent.find('.idInput').val(customer.id);
                selectedCustomer = customer;
            });
        }
    });

    $('#quantity_datatable').on('keyup', '.typeheadCustomer', function () {
        var value = jQuery(this).val();
        if (value === '') {
            var parent = $(this).parents('tr');
            parent.find('.idInput').val('');
        }
    });

    $('#newProductQuantity').on('click', '.typeheadCustomer', function () {
        if (!jQuery(this).hasClass('tt-input')) {
            var selectedCustomer;
            $(this).typeahead(null, {
                name: 'product_search',
                display: 'name',
                source: customer,
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'unable to find any customer that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<div><strong>{{name}}</strong> – {{email}}</div>')
                }
            });
            $(this).focus();
            $(this).bind('typeahead:select', function (ev, customer) {
                var parent = $(this).parents('form');
                parent.find('.idInput').val(customer.id);
                selectedCustomer = customer;
            });
        }
    });

    $('#newProductQuantity').on('keyup', '.typeheadCustomer', function () {
        var value = jQuery(this).val();
        if (value === '') {
            var parent = $(this).parents('form');
            parent.find('.idInput').val('');
        }
    });

});

function addImage() {
    jQuery(function () {
        jQuery('#uploadimageForm').submit(function (event) {
            event.preventDefault();
            var productId = $('#product_id').val();
            var formData = new FormData(this);
            var companyId = $('#componyId').val();
            var sync1 = '';
            var sync2 = '';
            $.ajax({
                url: "/product/product_image/" + productId,
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $("#myloading").show();
                    $('#show-msg').html("");
                },
                success: function (response) {
                    $("#myloading").hide();
                    if (response.success) {
                        $('#imgResponse').attr('class', 'alert alert-success');
                        $('#imgResponse').html($('#imageUploadingSuccess').html())
                        if (response.images.length > 0) {
                            response.images.forEach(function (item) {
                                var path = setProductImagePath(companyId, productId, item.image_origin, '');
                                var path2 = setProductImagePath(companyId, productId, item.image_origin, 'thumb');
                                sync1 += '<div class="item"><div class="card-img">';
                                sync1 += '<img src="' + path + '" alt="">';
                                sync1 += '</div></div>';
                                sync2 += sync2Template(path2, item.id);
                            });
                            sync2 += '<div class="item"><div class="img-one"><a href="#">'
                            sync2 += '<img id="clickToUpload" src="/images/browse-img.jpg" alt="">'
                            sync2 += '</a></div></div>'
                            setTimeout(function () {
                                $("#sync1").data('owlCarousel').destroy();
                                $("#sync2").data('owlCarousel').destroy();
                                $("#sync1").html(sync1);
                                $("#sync2").html(sync2);
                                initOwlSlider();
                            }, 500);
                        }
                    } else {
                        $('#imgResponse').attr('class', 'alert alert-danger');
                        $('#imgResponse').html($('#imageUploadingError').html())
                    }
                    $('#imgResponse').show();
                    setTimeout(function () {
                        $('#imgResponse').fadeOut('fast');
                        $('#imgResponse').html('');
                    }, 6000);
                },
                error: function () {
                    $("#myloading").hide();
                }
            });
        });
    });
}

jQuery(function () {
    jQuery('body').on('click', '#clickToUpload', function () {
        jQuery('#uploadimageForm #files').click();
    });
});

function calulateQuantity() {
    var productId = $('#product_id').val();
    $.ajax({
        url: "/product/total_product_quantity/" + productId,
        type: "GET",
        success: function (response) {
            $("#myloading").hide();
            if (response.success) {
                $('#totalQuantity').html(response.total);
            }
        },
        error: function () {
            $("#myloading").hide();
        }
    });
}

function addQuantity() {
    jQuery('#newProductQuantity .save-btn').click(function (event) {
        event.preventDefault();
        var form = jQuery(this).parent().parent();
        var action = jQuery(this).data('action');
        var date = form.find('input.my_datepicker').val();
        var casual = form.find('input.casual-fill').val();
        var quantity = parseInt(form.find('input.qty-input').val());
        var productId = $('#product_id').val();
        form.find('#quantityError').html('');
        if (quantity !== 0 && quantity !== '') {
            $.ajax({
                url: "/product/product_quantity/" + productId,
                type: "POST",
                data: {
                    action_type: action,
                    date: date,
                    casual: casual,
                    quantity: quantity
                },
                beforeSend: function () {
                    $("#myloading").show();
                    $('#show-msg').html("");
                    form.find('quantityError').html('');
                },
                success: function (response) {
                    $("#myloading").hide();
                    if (response.success) {
                        form.find('#quantityError').html('');
                        form.find('input.qty-input').val(0);
                        form.find('input.my_datepicker').val('');
                        form.find('input.casual-fill').val('');
                        qutityListing(productId);
                        calulateQuantity();
                    }
                },
                error: function () {
                    $("#myloading").hide();
                    form.find('#quantityError').html('');
                }
            });
        } else {
            form.find('#quantityError').html($('#quantityRequired').html());
            return false;
        }
    });
}

function deleteQuantity() {
    jQuery('#quantity_datatable').on('click', '.deleteProductQuantity', function (e) {
        e.preventDefault();
        var quantityId = jQuery(this).data('id');
        var deleteConfirmMess = $("#delete_confirm_mess").html();
        var labelYes = $("#label_yes").html();
        var labelNo = $("#label_no").html();
        var productId = $('#product_id').val();

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
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: "/product/product_quantity/" + quantityId,
                        type: "DELETE",
                        beforeSend: function () {
                            $("#myloading").show();
                            $('#show-msg').html("");
                        },
                        success: function (response) {
                            $("#myloading").hide();
                            if (response.success) {
                                jQuery(this).parents('tr').remove();
                            }
                            qutityListing(productId);
                        },
                        error: function () {
                            $("#myloading").hide();
                        }
                    });
                }
            }
        });
    });
}

function editQuantity() {
    jQuery('#quantity_datatable').on('click', '.editProductQuantity', function (e) {
        e.preventDefault();
        var row = jQuery(this).parents('tr');

        row.find('.date_display_span').hide();
        row.find('.date-picker-block').show();
        row.find('.productQuantitySpan').hide();
        row.find('.qtyInput').show();
        row.find('.editQty').hide();
        row.find('.saveQty').show();
    });
}

function saveQuantity() {
    jQuery('#quantity_datatable').on('click', '.saveProductQuantity', function (e) {
        e.preventDefault();
        var row = jQuery(this).parents('tr');
        var quantityId = jQuery(this).data('id');
        var productId = $('#product_id').val();
        var date = row.find('.date-picker-block input').val();
        var customer = row.find('input.idInput').val();
        var dateOriginal = row.find('.date_display_span').html();
        var qty = row.find('.qtyInput').val();
        var dataSend = {quantity: qty};
        console.log('dateOriginal', dateOriginal);
        if (date !== dateOriginal) {
            dataSend.date = date;
        }
        if (customer !== '') {
            dataSend.customer_id = customer;
        }
        jQuery.ajax({
            url: "/product/product_quantity/" + quantityId,
            type: "PUT",
            data: dataSend,
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                $("#myloading").hide();
                if (response.success) {
                    row.find('.date_display_span').html(row.find('.date-picker-block input').val());
//                    row.find('.productQuantitySpan').html(row.find('.qtyInput').val());
//                    row.find('.date_display_span').show();
//                    row.find('.date-picker-block').hide();
//                    row.find('.productQuantitySpan').show();
//                    row.find('.qtyInput').hide();
//                    row.find('.editQty').show();
//                    row.find('.saveQty').hide();
                    qutityListing(productId);
                }
            },
            error: function () {
                $("#myloading").hide();
            }
        });


    });
}

function initOwlSlider() {
    jQuery(function () {
        var sync1 = $("#sync1");
        var sync2 = $("#sync2");
        owl1 = sync1.owlCarousel({
            singleItem: true,
            slideSpeed: 1000,
            navigation: false,
            pagination: false,
            afterAction: syncPosition,
            responsiveRefreshRate: 200,
        });
        owl2 = sync2.owlCarousel({
            items: 4,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [979, 4],
            itemsTablet: [768, 3],
            itemsMobile: [479, 2],
            pagination: false,
            navigation: false,
            responsiveRefreshRate: 100,
            afterInit: function (el) {
                el.find(".owl-item").eq(0).addClass("synced");
            }
        });
        function syncPosition(el) {
            var current = this.currentItem;
            $("#sync2")
                    .find(".owl-item")
                    .removeClass("synced")
                    .eq(current)
                    .addClass("synced")
            if ($("#sync2").data("owlCarousel") !== undefined) {
                center(current)
            }
        }
        $("#sync2").on("click", ".owl-item", function (e) {
            e.preventDefault();
            var number = $(this).data("owlItem");
            sync1.trigger("owl.goTo", number);
        });
        function center(number) {
            var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
            var num = number;
            var found = false;
            for (var i in sync2visible) {
                if (num === sync2visible[i]) {
                    var found = true;
                }
            }

            if (found === false) {
                if (num > sync2visible[sync2visible.length - 1]) {
                    sync2.trigger("owl.goTo", num - sync2visible.length + 2)
                } else {
                    if (num - 1 === -1) {
                        num = 0;
                    }
                    sync2.trigger("owl.goTo", num);
                }
            } else if (num === sync2visible[sync2visible.length - 1]) {
                sync2.trigger("owl.goTo", sync2visible[1])
            } else if (num === sync2visible[0]) {
                sync2.trigger("owl.goTo", num - 1)
            }
        }
    });
}

function deleteImage() {
    jQuery('.product-slider').on('click', '.delete_image', function (event) {
        event.preventDefault();
        var imageId = jQuery(this).data('id');
        var parentItem = jQuery(this).parents('.owl-item');//.index()
        var parentItemindex = parentItem.index();
        $.ajax({
            url: "/product/product_image/" + imageId,
            type: "DELETE",
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                $("#myloading").hide();
                if (response.success) {
                    var sync1 = $('#sync1').find('.owl-item');
                    var sync2 = $('#sync2').find('.owl-item');
                    sync1[parentItemindex].remove();
                    sync2[parentItemindex].remove();
                    $("#sync1").data('owlCarousel').reinit();
                    $("#sync2").data('owlCarousel').reinit();
                    jQuery('body').find('.tooltip.bottom.in').remove();
                }
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    });
}

function insertDisplayDiscription() {
    var productDescription = jQuery('#product_desc').val();
    var discriptionLength = productDescription.length;
    if (discriptionLength > 25) {
        productDescription = productDescription.substring(0, 25) + '...';
    }
    jQuery('.product_description_to_show').html('( ' + productDescription + ' )');
}

jQuery(function () {
    addQuantity();
    deleteQuantity();
    editQuantity();
    saveQuantity();
    deleteImage();
    addImage();
    initOwlSlider();
});

$(function () {
    var object_messages = [];
    $("#prodcut_add_form_main").validate({
        messages: {
        },
        submitHandler: function (form) {
            var frm = $(form);
            $("#deleteImageArray").val(deleteArrayOfImage.toString());
            var formData = new FormData(frm[0]);
            // var images = $("#files").get(0).files;
            $.ajax({
                url: "/product/add",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $("#myloading").show();
                    $('#show-msg').html("");
                },
                success: function (response) {
                    $("#myloading").hide();
                    if (response.success) {
                        $('#show-msg').attr('class', 'alert alert-success');
                    } else {
                        $('#show-msg').attr('class', 'alert alert-danger');
                    }
                    $('#show-msg').html(response.msg);
                    setTimeout(function () {
                        $('#show-msg').fadeOut('fast');
                    }, 6000);
                    tableProduct.fnStandingRedraw();
                    var productId = $('#product_id').val();
                    insertDisplayDiscription();
                    qutityListing(productId);
                },
                error: function () {
                    $("#myloading").hide();
                }
            });
        }
    });
});

window.onload = function () {
    var productId = $('#product_id').val();
    qutityListing(productId);
    // Initialize Datatables
    App.datatables();
    tableProduct = $('#prodcut-datatable').dataTable({
        "processing": true,
        "serverSide": true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search..."
        },
        "initComplete": function (settings, json) {
            addProduct.calulatePrice();
        },
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": "/product/get-production-product/" + productId,
        },
        "createdRow": function (row, data, dataIndex) {
            if (data.v_status == 0) {
                $(row).addClass('redClass');
            } else if (data.status == 0) {
                $(row).addClass('yallowClass');
            }
        },
        "columns": [{
                "data": "product_code",
                "mRender": function (data, type, row) {
                    return '<input type="text" value="' + row.product_code + '" class="input-fill fill-three typeheadProduct">'
                            + '<input type="hidden" value="' + row.associate_id + '" class="idInput">';
                }
            }, {
                "data": "unit",
                "mRender": function (data, type, row) {
                    var unitArray = ['kg', 'mq', 'mq', 'mt', 'nr', 'ore', 'pz', 'rt'];
                    var html = '<div class="input-block"><select class="unitInput">';
                    unitArray.forEach(function (item, index) {
                        var selected = (item === row.unit) ? 'selected' : '';
                        html += '<option value="' + item + '" ' + selected + '>' + item + '</option>';
                    });
                    html += '</select></div>';
                    return html;
                }
            }, {
                "mRender": function (data, type, row) {
                    return '<input type="number" value="' + row.product_quantity + '" class="input-fill qty-input product_quantity">' +
                            '<input type="hidden" class="product_price priceinput" value="' + row.price + '">';
                }
            }, {
                "mRender": function (data, type, row) {
                    return '<input value="' + row.price + '" readonly class="input-fill priceinput" type="text">';
                },
                'data': 'price'
            }, {
                "mRender": function (data, type, row) {
                    return '<div class="edit-info"> <a href="#" row-id=' + row.id + ' class="edit save_production_product"><img src="/images/edit-icon.png" alt=""></a>' +
                            '<a href="#" row-id=' + row.id + ' class="delete_production_product"><img src="/images/delete-icon.png" alt=""></a> ' +
                            '<a href="#" row-id=' + row.id + ' style="display:none" class="edit save_production_product"><img src="/images/edit-icon.png" alt=""></a></div>';
                }
            }],
        columnDefs: [{
                orderable: false,
                targets: [0, 3]
            }],
        lengthMenu: [
            [10, 20, 30, -1],
            [10, 20, 30, 'All']
        ],
        'scrollCollapse': true,
        'ordering': true,
        'order': [
            [1, 'DESC']
        ],
        'searching': false,
        'paging': false
    });
    tableProduct.fnStandingRedraw();
    $(document).on("click", ".delete", function () {
        var product_id = $(this).attr("row-id");
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
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: "/product/delete/" + product_id,
                        type: "DELETE",
                        beforeSend: function () {
                            $("#myloading").show();
                            $('#show-msg').html("");
                        },
                        success: function (response) {
                            $("#myloading").hide();
                            if (response.success) {
                                tableProduct.fnStandingRedraw();
                                $("#refresh").trigger("click");
                            } else {
                                tableProduct.fnStandingRedraw();
                                var try_message = $("#try_message").html();
                                bootbox.alert(try_message);
                            }
                        },
                        error: function () {
                            $("#myloading").hide();
                        }
                    });
                }
            }
        });
    });
    $(document).on('click', '.delete_production_product', function (e) {
        e.preventDefault();
        var product_id = $(this).attr("row-id");
        var deleteConfirmMess = $("#delete_confirm_mess").html(),
                labelYes = $("#label_yes").html(),
                labelNo = $("#label_no").html();
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
            callback: function (result) {

                if (result) {
                    $.ajax({
                        url: "/product/production_product/" + product_id,
                        type: "DELETE",
                        beforeSend: function () {
                            $("#myloading").show();
                            $('#show-msg').html("");
                        },
                        success: function (response) {
                            $("#myloading").hide();
                            if (response.success) {
                                tableProduct.fnStandingRedraw();
                                $("#refresh").trigger("click");
                            } else {
                                tableProduct.fnStandingRedraw();
                                var try_message = $("#try_message").html();
                                bootbox.alert(try_message);
                            }
                        },
                        error: function () {
                            $("#myloading").hide();
                        }
                    });
                }
            }
        });
    });
};

var addProduct = {
    selectProductTable: null,
    productModal: null,
    insertProductButton: null,
    table: null,
    editProductButton: null,
    rowNumber: 0,
    productItem: [],
    init: function () {
        var _that = this;
        this.insertProductButton = $("#select_product_item");
        this.selectProductTable = $('#prodcut-datatable2');
        this.productModal = $("#select_product_modal");
        this.table = $("#prodcut-datatable");
        this.editProductButton = $("#prodcut-datatable .edit_production_product");
        this.initProductTable();
        $('#prodcut-datatable').on('click', '.edit_production_product', function (e) {
            e.preventDefault();
            _that.editProductItem(this);
        });
        $('#prodcut-datatable').on('click', '.save_production_product', function (e) {
            e.preventDefault();
            _that.saveProductItem(this, _that);
        });
    },
    initProductTable: function () {},
    addProductItem: function (data) {
        var _that = this;
        _that.rowNumber += 1;
        if (data.product_id) {
            var associate_product_id = data.product_id;
        } else if (data.id) {
            var associate_product_id = data.id;
        }
        var quantity = 0;
        if (data.quantity) {
            quantity = data.quantity;
        }

        $.ajax({
            url: "/product/production_product/" + $('#product_id').val(),
            type: "POST",
            data: {"associate_product_id": associate_product_id, quantity: quantity},
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                data.id = response.id;
                var row = _that.templateProductRow(_that.rowNumber, data);
                _that.table.find("tbody").prepend(row);
                _that.calulatePrice();
                $("#product_item_" + _that.rowNumber).show('slow');
                $('#addproductionProduct .message').html();
                $("#myloading").hide();
                jqSelectData = {};
                $('#addproductionProduct .quantityInput').val('');
                $('#product_typehead').val('');
                $('#addproductionProduct .unitInput option[value=""]').prop('selected', true);
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    },
    templateProductRow: function (rowNumber, data) {
        if (!data) {
            data = {code: "", desc: "", amount: 1, price: 0, vat: "", total: "0.000", product_id: ""};
        }
        console.log(data);
        var html = "";
        html += '<tr data-id="">';
        html += '<td><input type="text" value="' + data.desc + '" class="input-fill fill-three typeheadProduct"></td>' +
                '<input type="hidden" value="' + data.product_id + '" class="idInput">';
        var unitArray = ['kg', 'mq', 'mq', 'mt', 'nr', 'ore', 'pz', 'rt'];
        html += '<td><div class="input-block"><select class="unitInput">';
        unitArray.forEach(function (item, index) {
            var selected = (item === data.unit) ? 'selected' : '';
            html += '<option value="' + item + '" ' + selected + '>' + item + '</option>';
        });
        html += '</select></div></td>';
        html += '<td><!--span class="product_quantity_sapn">' + data.quantity + '</span-->' +
                '<input type="hidden" class="product_price" value="' + data.price + '">' +
                '<input type="number" value="' + data.quantity + '" class="input-fill qty-input product_quantity">' +
                '</td>';
        html += '<td><input value="' + data.price + '" readonly="" class="input-fill" type="text"></td>';
        html += '<td class="product_action"><div class="edit-info"> <a href="#" row-id=' + data.id + ' class="edit save_production_product"><img src="/images/edit-icon.png" alt=""></a>' +
                '<a href="#" row-id=' + data.id + ' class="delete_production_product"><img src="/images/delete-icon.png" alt=""></a> ' +
                '<a href="#" row-id=' + data.id + ' style="display:none" class="edit save_production_product"><img src="/images/edit-icon.png" alt=""></a></div>' + '</td>';
        html += '</tr>';
        return html;
    },
    editProductItem: function (element) {
        var row = $(element).parents('tr');
        row.find('span.product_quantity_sapn').hide();
        row.find('.product_quantity').show();
        row.find('.date-picker-block').show();
        row.find('span.product_date_sapn').hide();
        row.find('.edit_production_product').hide();
        row.find('.delete_production_product').hide();
        row.find('.save_production_product').show();
    },
    saveProductItem: function (element, _that) {
        var row = $(element).parents('tr');
        var id = $(element).attr('row-id');
        var quantity = row.find('.product_quantity').val();
        var productId = row.find('.idInput').val();
        var date = row.find('.my_datepicker').val();
        $.ajax({
            url: "/product/production_product/" + id,
            type: "PUT",
            data: {
                'product_quantity': quantity,
                'product_id': productId,
                'date': date
            },
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                $("#myloading").hide();
                if (response.success) {
//                    row.find('span.product_quantity_sapn').html(quantity);
//                    row.find('span.product_date_sapn').html(date);
//                    row.find('span.product_quantity_sapn').show();
//                    row.find('.product_quantity').hide();
//                    row.find('.edit_production_product').show();
//                    row.find('.delete_production_product').show();
//                    row.find('.save_production_product').hide();
//                    row.find('.date-picker-block').hide();
//                    row.find('span.product_date_sapn').show();
                    _that.calulatePrice();
                } else {
                    var try_message = $("#try_message").html('');
                    _that.calulatePrice();
                    bootbox.alert(try_message);
                }
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    },
    calulatePrice: function () {
        var total = 0;
        jQuery('#prodcut-datatable tbody tr').each(function (index, item) {
            var price = parseFloat(jQuery(item).find('.product_price').val());
            var quantity = parseFloat(jQuery(item).find('.product_quantity').val());
            var rowTotal = price * quantity;
            total += rowTotal;
        });
        jQuery('#totalProductionPrice').html(total);
    }
}

jQuery(function () {
    addProduct.init();
});

$(function () {
    $("body").on("click", ".my_datepicker", function () {
        if (!$(this).hasClass("hasDatepicker")) {
//            $(this).datepicker({ dateFormat: 'dd/mm/yyyy' });
            $(this).datepicker({dateFormat: 'dd/mm/yyyy'}).on('changeDate', function (e) {
                $(this).datepicker('hide');
            });
            $(this).datepicker("show");
        }
    });
});

jQuery(function () {
    loadProductCompnies();
    function loadProductCompnies() {
        $.ajax({
            url: "/company/get_all",
            type: "GET",
            beforeSend: function () {
                $("#myloading").show();
            },
            success: function (response) {
                $("#myloading").hide();
                if (response.success) {
                    $.each(response.data, function (key, company) {
                        $("#company").append(
                                $('<option></option>').val(company.id).html(company.name)
                                );
                    });
                    if (response.current_company) {
                        $("#company").val(response.current_company.id);
                    }
                }
                $("#company_dropdown").selectpicker('refresh');
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    }
});



// production table 

jQuery(function () {
    jQuery('#produce_form').submit(function (e) {
        e.preventDefault();
        // jQuery('#produce_form').find('.message').fadeOut('fast');
        var productId = $('#product_id').val();
        var formData = new FormData(this);
        var date = jQuery(this).find('.my_datepicker').val();//casual-fill
        var casual = jQuery(this).find('.casual-fill').val();//qty-input
        var qty = jQuery(this).find('.qty-input').val();
        var msg = '';
        if (date === '') {
            msg += $('#dateReq').html() + '<br/>'
        }
        if (casual === '') {
            msg += $('#casualReq').html() + '<br/>'
        }
        if (qty === '' || qty === 0) {
            msg += $('#quantityRequired').html() + '<br/>'
        }
        if (msg !== '') {
            jQuery('#produce_form').find('.message').html(msg);
            jQuery('#produce_form').find('.message').addClass('alert alert-danger');
            jQuery('#produce_form').find('.message').show();
            setTimeout(function () {
                jQuery('#produce_form').find('.message').fadeOut('fast');
            }, 6000);

            return;
        }
        $.ajax({
            url: "/product/productions/" + productId,
            type: "POST",
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                $("#myloading").hide();
                getProductions();
                jQuery('#produce_form input').val('');
                jQuery('#produce_form').find('.message').fadeOut('fast');
                qutityListing(productId);
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    });

    function getProductions() {
        $.ajax({
            url: "/product/productions/" + $('#product_id').val(),
            type: "GET",
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                if (response.success) {
                    var html = '';
                    response.data.forEach(function (item, index) {
                        html += '<tr><td><!--span class="product_date_sapn">' + item.date + '</span--><div class="date-picker-block">'
                        html += '<input type="text" value="' + item.date + '" class="input-fill my_datepicker" data-date-format="dd/mm/yyyy"></span><img src="/images/calendra.png" alt=""></span></div></td>';
                        html += '<td class="mail-id" align="center"><!--span class="product_casual_sapn">' + item.casual + '</span--><input type="text" class="product_casual input-fill fill2" value="' + item.casual + '"></td>';
                        html += '<td align="center"><!--span class="product_quantity_sapn">' + item.quantity + '</span--><input type="number" class="product_quantity input-fill qty-input" value="' + item.quantity + '"></td>';
                        html += '<td align="center"><div class="edit-info edit_production_button">';
                        html += '<a href="#" data-id="' + item.id + '" class="edit save_production"><img src="/images/edit-icon.png" alt=""></a> ';
                        html += '<a href="#" data-id="' + item.id + '" class="delete delete_production"><img src="/images/delete-icon.png" alt=""></a> ';
                        html += '</div><div class="edit-info save_production_button">'
                        html += '<a href="#" data-id="' + item.id + '" class="edit save_production"><img src="/images/edit-icon.png" alt=""></a> ';
                        html += '</div></td></tr>';
                    });
                    jQuery('#productions tbody').html(html);
                    $("#myloading").hide();
                }
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    }

    getProductions();
    jQuery('#productions').on('click', '.delete_production', function (e) {
        e.preventDefault();
        var id = jQuery(this).data('id');
        var deleteConfirmMess = $("#delete_confirm_mess").html(),
                labelYes = $("#label_yes").html(),
                labelNo = $("#label_no").html();
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
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: "/product/productions/" + id,
                        type: "DELETE",
                        beforeSend: function () {
                            $("#myloading").show();
                            $('#show-msg').html("");
                        },
                        success: function (response) {
                            $("#myloading").hide();
                            if (response.success) {
                                jQuery(this).parents('tr').remove();
                            }
                            getProductions();
                        },
                        error: function () {
                            $("#myloading").hide();
                        }
                    });
                }
            }
        });

    });

    jQuery('#productions').on('click', '.edit_production', function (e) {
        e.preventDefault();
        var id = jQuery(this).data('id');
        var row = jQuery(this).parents('tr');
        row.find('.date-picker-block').show();
        row.find('.product_casual').show();
        row.find('.product_quantity').show();
        row.find('.save_production_button').show();

        row.find('.product_date_sapn').hide();
        row.find('.product_casual_sapn').hide();
        row.find('.product_quantity_sapn').hide();
        row.find('.edit_production_button').hide();
    });

    jQuery('#productions').on('click', '.save_production', function (e) {
        e.preventDefault();
        var id = jQuery(this).data('id');
        var row = jQuery(this).parents('tr');

        $.ajax({
            url: "/product/productions/" + id,
            type: "PUT",
            data: {
                quantity: row.find('.product_quantity').val(),
                casual: row.find('.product_casual').val(),
                date: row.find('.date-picker-block input').val()
            },
            beforeSend: function () {
                $("#myloading").show();
                $('#show-msg').html("");
            },
            success: function (response) {
                $("#myloading").hide();
                if (response.success) {
//                    row.find('.product_date_sapn').html(row.find('.date-picker-block input').val());
//                    row.find('.product_casual_sapn').html(row.find('.product_casual').val());
//                    row.find('.product_quantity_sapn').html(row.find('.product_quantity').val());
//
//                    row.find('.date-picker-block').hide();
//                    row.find('.product_casual').hide();
//                    row.find('.product_quantity').hide();
//                    row.find('.save_production_button').hide();
//
//                    row.find('.product_date_sapn').show();
//                    row.find('.product_casual_sapn').show();
//                    row.find('.product_quantity_sapn').show();
//                    row.find('.edit_production_button').show();
                }
                $("#myloading").hide();
            },
            error: function () {
                $("#myloading").hide();
            }
        });
    });

});

// typehead

jQuery(function () {
    var products = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/product/search/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#product_typehead').typeahead(null, {
        name: 'product_search',
        display: 'desc',
        source: products,
        templates: {
            empty: [
                '<div class="empty-message">',
                'unable to find any product that match the current query',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{desc}}</strong> – {{code}}</div>')
        }
    });

    $('#product_typehead').bind('typeahead:select', function (ev, product) {
        $('#addproductionProduct .priceinput').val(product.price);
        $('#addproductionProduct .idInput').val(product.product_id);
        if (product.unit && typeof product.unit !== 'undefined' && product.unit !== '') {
            $('#addproductionProduct .unitInput option[value="' + product.unit + '"]').prop('selected', true);
        }
        jqSelectData = product;
    });

    $('#prodcut-datatable').on('click', '.typeheadProduct', function () {
        if (!jQuery(this).hasClass('tt-input')) {
            var datatableProductSelect;
            $(this).typeahead(null, {
                name: 'product_search',
                display: 'desc',
                source: products,
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'unable to find any product that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<div><strong>{{desc}}</strong> – {{code}}</div>')
                }
            });
            $(this).focus();
            $(this).bind('typeahead:select', function (ev, product) {
                var parent = $(this).parents('tr');
                parent.find('.priceinput').val(product.price);
                parent.find('.idInput').val(product.product_id);
                if (product.unit && typeof product.unit !== 'undefined' && product.unit !== '') {
                    parent.find('.unitInput option[value="' + product.unit + '"]').prop('selected', true);
                }
                datatableProductSelect = product;
            });
        }
    });


    $('#addproductionProduct').submit(function (e) {
        e.preventDefault();
        $('#addproductionProduct .message').html('');
        if (typeof jqSelectData.product_id === 'undefined') {
            $('#addproductionProduct .message').html($('#selectproduct').html());
            $('#addproductionProduct .message').addClass('alert alert-danger');
            jQuery('#addproductionProduct').find('.message').show();
            setTimeout(function () {
                jQuery('#addproductionProduct').find('.message').fadeOut('fast');
            }, 6000);
            return;
        } else if ($('#addproductionProduct .quantityInput').val() === '') {
            $('#addproductionProduct .message').html($('#quantityRequired').html());
            $('#addproductionProduct .message').addClass('alert alert-danger');
            jQuery('#addproductionProduct').find('.message').show();
            setTimeout(function () {
                jQuery('#addproductionProduct').find('.message').fadeOut('fast');
            }, 6000);
            return;
        }
        jqSelectData.quantity = $('#addproductionProduct .quantityInput').val()
        addProduct.addProductItem(jqSelectData);
    });
});

//customer Typehead

