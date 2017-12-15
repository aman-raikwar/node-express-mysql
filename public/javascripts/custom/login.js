var Login = function() {

/**
 * Function for switching form views (login, reminder and register forms)
 */
    var switchView = function(viewHide, viewShow, viewHash){
      viewHide.slideUp(250);
      viewShow.slideDown(250, function(){
          $('input').placeholder();
      });

      if ( viewHash ) {
          window.location = '#' + viewHash;
      } else {
          window.location = '#';
      }
    };

    return {
        init: function() {
            /* Switch to Login, Reminder and Register form views */

            var formLogin       = $('#login_form'),
                formReminder    = $('#reminder_form'),
                formRegister    = $('#register_form');

            $('#link_register_login').click(function(){
                switchView(formLogin, formRegister, 'register');
            });

            $('#link_register').click(function(){
              $(".auto-width-msg").css("display","none");
              switchView(formRegister, formLogin, '');
            });

            $('#link_reminder_login').click(function(){
              $(".auto-width-msg").css("display","none");
                switchView(formLogin, formReminder, 'reminder');
            });

            $('#link_reminder').click(function(){
                switchView(formReminder, formLogin, '');
            });

            /***** If the link includes the hashtag 'register', show the register form instead of login *****/

            if (window.location.hash === '#register') {
                formLogin.hide();
                formRegister.show();
            }

            /****** If the link includes the hashtag 'reminder', show the reminder form instead of login *****/

            if (window.location.hash === '#reminder') {
                formLogin.hide();
                formReminder.show();
            }

        	/**
 			* Login form - Initialize Validation
 			*/

            $('#login_form').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'login_email': {
                        required: true,
                        email: true
                    },
                    'login_password': {
                        required: true
                    }
                },
                messages: {
                    'login_email': 'Please enter your account\'s email',
                    'login_password': {
                        required: 'Please provide your password'
                    }
                }
            });

        	/**
 			* Reminder form - Initialize Validation
 			*/
            
            $('#reminder_form').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'reminder-email': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'reminder-email': 'Please enter your account\'s email'
                },
                submitHandler: function(form) {                  
                  $.ajax({
                    url: "/auth/forgot_password/",
                    type: "POST",      
                    data: $(form).serialize(),        
                    beforeSend: function(){                                     
                      $("#reminder_form_msg").html("");
                      $("#reminder_form_msg").removeClass();
                    },
                    success: function(response) {
                      if(response.success){                    
                        $("#reminder_form_msg").attr('class','text-center alert alert-success');               
                      } else {
                        $("#reminder_form_msg").attr('class','text-center alert alert-danger');
                      }
                      if(response.msg){
                        $("#reminder_form_msg").html(response.msg);   
                      } else {
                        $("#reminder_form_msg").html("<%- __('general_error_try_again_msg') %>");   
                      }                      
                    },
                    error: function(error){            
                      console.log("Error in forgot password request ::",error);
                    }
                  });      
                }
            });

        	/**
 			* Register form - Initialize Validation
 			*/
      $.validator.addMethod("pwcheckspechars", function (value) {
        return /[!@#$%^&*()_=\[\]{};':"\\|,.<>\/?+-]/.test(value)
      }, "The password must contain at least one special character");
        
      $.validator.addMethod("pwcheckconsecchars", function (value) {
            return ! (/(.)\1\1/.test(value)) // does not contain 3 consecutive identical chars
        }, "The password must not contain 3 consecutive identical characters");

        $.validator.addMethod("pwchecklowercase", function (value) {
            return /[a-z]/.test(value) // has a lowercase letter
        }, "The password must contain at least one lowercase letter");
        
        $.validator.addMethod("pwcheckrepeatnum", function (value) {
            return /\d{2}/.test(value) // has a lowercase letter
        }, "The password must contain at least one lowercase letter");
        
        $.validator.addMethod("pwcheckuppercase", function (value) {
            return /[A-Z]/.test(value) // has an uppercase letter
        }, "The password must contain at least one uppercase letter");
        
        $.validator.addMethod("pwchecknumber", function (value) {
            return /\d/.test(value) // has a digit
        }, "The password must contain at least one number");

            $('#register_form').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    if (e.closest('.form-group').find('.help-block').length === 2) {
                        e.closest('.help-block').remove();
                    } else {
                        e.closest('.form-group').removeClass('has-success has-error');
                        e.closest('.help-block').remove();
                    }
                },
                rules: {
                    'first_name': {
                        required: true,
                        minlength: 2
                    },
                    'last_name': {
                        required: true,
                        minlength: 2
                    },
                    'email': {
                        required: true,
                        email: true
                    },
                    'password': {
                        required: true,
                        pwcheckspechars: true,
                        minlength: 6,
                    },
                    'password_verify': {
                        required: true,
                        equalTo: '#register_password'
                    },
                    'register_terms': {
                        required: true
                    }
                },
                messages: {
                    'first_name': {
                        required: 'Please enter your firstname',
                        minlength: 'Please enter your firstname'
                    },
                    'last_name': {
                        required: 'Please enter your lastname',
                        minlength: 'Please enter your lastname'
                    },
                    'email': 'Please enter a valid email address',
                    'password': {
                        required: 'Please provide a password'
                    },
                    'password_verify': {
                        required: 'Please provide a password',
                        equalTo: 'Please enter the same password as above'
                    },
                    'register_terms': {
                        required: 'Please accept the terms!'
                    }
                }
            });
        }
    };
}();