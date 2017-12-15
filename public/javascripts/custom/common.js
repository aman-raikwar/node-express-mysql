$(document).ready(function() {

    // var socket = io.connect('http://127.0.0.1:3000');
    // socket.on('showNotifyCount', function(response) {
    //     var encodedId = Base64.encode('notify-count-' + response.data.tag_userId);
    //     var count = (encodedId.match(/=/g) || []).length;
    //     if (count > 0) {
    //         var spanId = encodedId.replace(/=/g, "")
    //     } else {
    //         var spanId = encodedId;
    //     }
    //     $('#' + spanId).text(response.data.count);
    // });


    // socket.on('showNotifyMessage', function(response) {
    //     var page = 1;
    //     if ($("#notify-dropdown").hasClass("dropdown2 open")) {
    //         $('#notification-div').html('');
    //         loadnotifications(page);
    //     }

    // });

    jQuery.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings) {
        if (oSettings.oFeatures.bServerSide === false) {
            var before = oSettings._iDisplayStart;

            oSettings.oApi._fnReDraw(oSettings);

            // iDisplayStart has been reset to zero - so lets change it back
            oSettings._iDisplayStart = before;
            oSettings.oApi._fnCalculateEnd(oSettings);
        }

        // draw the 'current' page
        oSettings.oApi._fnDraw(oSettings);
    };

    $(".edit-company-link").click(function(event) {
        event.preventDefault();
        if ($("#company_dropdown").length > 0) {
            if ($("#company_dropdown").val()) {
                window.location = '/company/update/' + $("#company_dropdown").val();
            } else {
                bootbox.alert("Please select a company for setup.");
            }
        }
    });

    if ($("#company_dropdown").length > 0) {
        //loadCompnies();
    }

    $("#company_dropdown").change(function(e) {
        commonSetupCurrentCompany();
    });

    //Load companies
    function loadCompnies() {
        $.ajax({
            url: "/company/get_all",
            type: "GET",
            beforeSend: function() {
                $("#myloading").show();
            },
            success: function(response) {
                $("#myloading").hide();
                if (response.success) {
                    $.each(response.data, function(key, company) {
                        $("#company_dropdown").append(
                            $('<option></option>').val(company.id).html(company.name)
                        );
                    });
                    $("#company_dropdown").append('<optgroup><option class="plus" value="add">Add</option></optgroup>');
                    if (response.current_company) {
                        $("#company_dropdown").val(response.current_company.id);
                    }
                }
                $("#company_dropdown").selectpicker('refresh');
            },
            error: function() {
                $("#myloading").hide();
            }
        });
    }

    //setup company function in session
    function commonSetupCurrentCompany() {
        if ($("#company_dropdown").val()) {
            if ($("#company_dropdown").val() == "add") {
                window.location = "/company/add";
                return true;
            }
            $.ajax({
                url: "/company/set_company/" + $("select#company_dropdown").val(),
                type: "GET",
                beforeSend: function() {
                    $("#myloading").show();
                },
                success: function(response) {
                    $("#myloading").hide();
                    if (response.success) {
                        //check if the current url path for update company, if yes redirect to currently company
                        var company_id = 0;
                        //alert();
                        if (window.location.pathname.indexOf('/company/update/') !== -1) {
                            company_id = window.location.pathname.replace('/company/update/', '');
                            if (company_id != $("#company_dropdown").val()) {
                                window.location = '/company/update/' + $("#company_dropdown").val();
                            }
                        } else {
                            location.reload();
                        }
                    } else {
                        console.log("company has not been settled successfully", response.errors);
                    }
                },
                error: function() {
                    $("#myloading").hide();
                }
            });
        }
    }

    $(document).on('click', '.switch-disabled-red', function(e) {
        bootbox.alert("User not verify and not accept invitation yet");
    });
    $(document).on('click', '.switch-disabled-yallow', function(e) {
        bootbox.alert("User not accept invitation yet");
    });

    /** get number of unread notifications for a user **/
    //getNotificationStatus();

    function getNotificationStatus() {
        $.ajax({
            url: "/user/get-notification-count",
            type: "GET",
            beforeSend: function() {
                $("#myloading").show();
            },
            success: function(response) {
                var encodedUserId = Base64.encode('notify-count-' + response.userId);
                var count = (encodedUserId.match(/=/g) || []).length;
                if (count > 0) {
                    var spanId = encodedUserId.replace(/=/g, "");
                } else {
                    var spanId = encodedUserId;
                }
                if (response.count > 0) {
                    $('#' + spanId).text(response.count);
                }
            },
            error: function() {
                $("#myloading").hide();
            }
        });
    }


    $("#show-notification").click(function(event) {
        var page = 1;
        event.preventDefault();
        $('#notification-div').html('');
        loadnotifications(page);
        $('#notification-div').bind('scroll', function() {
            if (($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight - 30) {
                page++;
                loadnotifications(page);
            }
        })
    });


    function loadnotifications(page) {
        $.ajax({
            url: "/user/get-notifications?page=" + page + "&socket=0",
            type: "GET",
            success: function(response) {
                if (response.read.length > 0) {
                    $.each(response.read, function(key, obj) {
                        var item = obj.status;
                        var encodedUserId = Base64.encode('notify-count-' + obj.user_tagged);
                        var count = (encodedUserId.match(/=/g) || []).length;
                        if (count > 0) {
                            var spanId = encodedUserId.replace(/=/g, "")
                        } else {
                            var spanId = encodedUserId;
                        }
                        $('#' + spanId).hide().animate({ opacity: 1 }, 500);
                        if (obj.user_profile_image != '' && obj.user_profile_image != undefined) {
                            var image = '/uploads/users/' + obj.user_id + '/profile-image/' + obj.user_profile_image;
                        } else {
                            var image = '/images/placeholders/avatars/avatar5.jpg';
                        }

                        if (obj.type == 1) {
                            var notify_type = $(".tag_type_1").html();
                        } else {
                            var notify_type = $(".tag_type_0").html();
                        }

                        var tagged_msg = $(".tag_message").html();

                        $('#notification-div').append('<a class="notify-content" href="javascript:void(0);" post=' + obj.id + '>\
                                            <div class="notification-item">\
                                              <p class="push-bit noti-msg"><img src=' + image + ' "="" alt="avatar" class="img-circle user-image"><span class="text-muted pull-right"><small>' + moment.utc(obj.created_at, "YYYYMMDD hh:mm").fromNow() + '</small></span></span><strong>' + obj.first_name + ' ' + obj.last_name + ' </strong> ' + tagged_msg + ' ' + notify_type + ' \
                                              </p>\
                                            </div>\
                                          </a>');
                    });
                }

                if (response.unread.length > 0) {
                    $.each(response.unread, function(key, value) {
                        if (value.user_profile_image != '' && value.user_profile_image != undefined) {
                            var image = '/uploads/profile-image/' + value.user_profile_image;
                        } else {
                            var image = '/images/placeholders/avatars/avatar5.jpg';
                        }
                        var notify_msg = $(".notication_msg").html();
                        var company_txt = $(".company_txt").html();

                        $('#notification-div').prepend('<a class="notify-content-unread" company="' + value.company + '" href="javascript:void(0);">\
                                            <div class="notification-item">\
                                              <p class="push-bit noti-msg"><img src=' + image + ' "="" alt="avatar" class="img-circle user-image"><span class="text-muted pull-right"><small>' + moment.utc(value.created_at, "YYYYMMDD hh:mm").fromNow() + '</small></span></span><span> ' + notify_msg + ' <b> ' + company_txt + ' ' + value.name + ' </b></span>\
                                              </p>\
                                            </div>\
                                          </a>');
                    });
                }
            },
            error: function() {
                //  $("#myloading").hide();
            }
        });
    }



    $(document).on("click", ".notify-content", function(event) {
        var post_id = $(this).attr('post');
        window.location.href = '/user/user-board?status=' + post_id;
    });

    var url_string = window.location.href;
    var url = new URL(url_string);
    var postId = url.searchParams.get("status");
    var post = 0;
    if (postId != undefined) {
        post = postId;
    }
    setTimeout(function() {
        $('#newsfeed-update-' + post).effect('highlight', {}, 3000)
    }, 1000);



    $(document).on("click", ".notify-content-unread", function(event) {
        var comp_id = $(this).attr('company');
        $.ajax({
            url: "/company/set_company/" + comp_id,
            type: "GET",
            beforeSend: function() {
                $("#myloading").show();
            },
            success: function(response) {
                $("#myloading").hide();
                if (response.success) {
                    //check if the current url path for update company, if yes redirect to currently company
                    var company_id = 0;
                    if (window.location.pathname.indexOf('/company/update/') !== -1) {
                        company_id = window.location.pathname.replace('/company/update/', '');
                        if (company_id != $("#company_dropdown").val()) {
                            window.location = '/company/update/' + $("#company_dropdown").val();
                        }
                    } else {
                        location.reload();
                    }
                } else {
                    console.log("company has not been settled successfully", response.errors);
                }
            },
            error: function() {
                $("#myloading").hide();
            }
        });
    });


});