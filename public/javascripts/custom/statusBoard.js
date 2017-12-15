    $(function(){
    var socket = io.connect('http://127.0.0.1:3000');
    moment.locale('it');
    
/***************Find all #tag Word **********************/
  function getHasTagAry( msgTxt, finder ) {
    if(typeof msgTxt != "undefined" ){
      var msgTxtAry = msgTxt.split(' ');
      var hash = [];
      for(var i = 0; i < msgTxtAry.length; i++) {
        if( msgTxtAry[i].indexOf(finder) > -1 )
         hash.push( msgTxtAry[i].trim() );
      }
      msgTxtAry = hash.join('').split(finder).join('-tp-'+finder).split('-tp-');
      hash = [];
      for(var j = 0; j < msgTxtAry.length; j++) {
        if( msgTxtAry[j].trim() != '' ){
         hash.push( msgTxtAry[j].trim() );         
        }
      }
      return hash;
    }  
  }

/*************Save status ********************/
  var statusRequired = $("message#status_required").html();

  $("#profile_status_form").validate({
    rules: {
      profile_status: {
        required: true,
      },        
    },
    messages: {
      name: statusRequired,
    },      
    submitHandler: function(form) {
      if($("#company_dropdown").length > 0){
        if($("#company_dropdown").val()) {
          var company_id = $("#company_dropdown").val();
          $("#company").val(company_id);
        } 
      } else {
        var company_id = '';
      }
      
      var post = $(".cmntMsg").html(),
      tagUserId = new Array(),
      tagUserName = new Array();

      $(".tag-user").each(function( index ) {
        var id = $(this).attr("data-item-id"),
        name = $(this).text();
        tagUserId.push(id);
        tagUserName.push(name);  
      });
      var formValue = $("#profile_status_form").serializeArray();
      $.ajax({
        url: "/user/profile",
        type: "POST",      
        data: $("#profile_status_form").serialize(),
        beforeSend: function(){
          $('#show-msg').html("");
        },
        success: function(response) {
          if(response.success){
            var hashTag = getHasTagAry(formValue[0].value,'#' ); var type = 0;
            saveHashTag(hashTag, company_id , response.id);// for save # tag
            saveAttherate(tagUserId,company_id,response.id,tagUserName,type);// for save @ tag
            $('#show-msg').attr('class','alert alert-success');
          } else {
            $('#show-msg').attr('class','alert alert-danger');
          }
          var status = $("#profile_status").val(),
          userName = $("#user").val(),
          postBtn = $("message#post_comment_btn").html(),
          commentBox = $("message#comment_box").html(),
          updatedStatus = $("message#updated_status").html(),
          avatar = $("message#avatar").html(),
          user_image = $('#user_profile_thumbnail_show').attr('src');
          $(".mentiony-content").empty();

          var newStatus = '<li id="newsfeed-update-" class="media"><a href="#" class="pull-left"><img src="'+user_image+'" alt="'+avatar+'" class="img-circle"></a><div class="media-body"><p class="push-bit"><span class="text-muted pull-right"><small>'+moment(moment().lang("it").format(), "YYYYMMDD hh:mm").fromNow()+'</small><span class="text-info" data-toggle="tooltip" title="" data-original-title="From Custom App"><i class="fa fa-mobile"></i></span></span><strong><a href="#">'+userName+'</a>'+updatedStatus+'</strong></p><p>'+status+'</p><p><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-thumbs-o-up"></i> Like</a><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-share-square-o"></i> Share</a></p><ul class="media-list push" id="comment_'+response.id+'">';
          newStatus +="<li class=\"media\" id=\"com_text_"+response.id+"\"><a href='#' class=\"pull-left\"><a href='#' class=\"pull-left\"><img src='"+user_image+"' alt='"+avatar+"' class=\"img-circle\"></a><div class=\"media-body\"><form method=\"post\" class=\"comment-status\" id=\"comment_status_"+response.id+"\" name=\"comment_status_"+response.id+"\"><textarea  name=\"status_comment\" id=\"comment_text_"+response.id+"\" class=\"form-control add-mention\" rows=\"1 \" placeholder='"+commentBox+"' required></textarea><input type=\"hidden\" name=\"status\" value=\""+response.id+"\"><button type=\"submit\" class=\"btn btn-xs btn-primary btn_comment pull-right\"><i class=\"fa fa-paper-plane\"></i>"+postBtn+"</button></form></div></li>";
          
          newStatus += "</ul></li>";
          $("#newsfeed").prepend(newStatus);
          taging('comment_text_'+response.id);
          socket.emit('newStatus',{'status':status,'status_id':response.id,'user_name':userName,'user_image':user_image,'company':company_id});
          formSubmitOnEnter(response.id);
          $('#show-msg').html(response.msg); 
          $("#show-msg").fadeOut(4000); 
          $(".mentiony-link").removeClass("tag-user");
        },
        error: function(){
          //$("#myloading").hide();
        }
      });      
    }
  });  

/****************** Functionality*************/
     
  taging('profile_status');

  var comment_page = 1;
  var track_page = 1; //track user scroll as page number, right now page number is 1
  var loading  = false; //prevents multiple loads
    
  load_contents(track_page); //initial content load
    
  $(window).scroll(function() { //detect page scroll
    if($(window).scrollTop() + $(window).height() >= $(document).height()-250) { 
      track_page++; 
      load_contents(track_page); 
    }
  });   

/***********  //Ajax load function*********************************/
  function load_contents(track_page){
    if(loading == false){
      var company_id = '';
      var user_id = '';
      if($("#company_dropdown").length > 0){
        if($("#company_dropdown").val()) {
          company_id = $("#company_dropdown").val();
          user_id = $("#user_id").val();
        } 
      }
      var status_ids= [];
      var postBtn = $("message#post_comment_btn").html();
      var commentBox = $("message#comment_box").html();
      var loadPreviousCmnt = $("message#load_pre_cmnt").html();
      var share = $("message#share").html();
      var like = $("message#like").html();
      // var matches = ?status=([^&#=]*)/.exec(window.location.search);
      // var param1 = matches[1];
      var url_string = window.location.href;
      var url = new URL(url_string);
      var postId = url.searchParams.get("status");
      var post = 0;
      if(postId != undefined){
        post = postId;
      }

      $.post('/user/getStatus', {'page': track_page,'company_id':company_id,'user_id':user_id,'post':post}, function(data){
        if(data.company=="undefined"){
          bootbox.alert("Please select company",function(){
            window.location = "/dashboard";
          });
          return false;
        }  
        var newsfeed='';
        var commentBox='';
        var comment='';
        var updatedStatus = $("message#updated_status").html(),
        avatar = $("message#avatar").html();
        $.each(data, function( index, value ) {
          var postStatus = value.status,
          getWord = value.status.split('[@]'),
          textareaCommnet = '';
          $.each(getWord, function(textIndex, textValue ) {
            textValue = $.trim(textValue);
            if(textValue !=''){
              textValue = textValue.split('[/@]');
              textareaCommnet = ' <span class="mention-area"><span class="highlight"><a href="undefined" data-item-id="4" class="mentiony-link">'+textValue[0]+'</a></span></span>';
              postStatus = postStatus.replace('[@]'+textValue[0]+'[/@]',textareaCommnet);
            }
          });
            var statusUserImage = '/uploads/users/'+value.user+'/profile-image/thumb/'+value.user_profile_image;
              if(value.user == null)
                statusUserImage = '/uploads/users/avatar.jpg';

          newsfeed += '<li id="newsfeed-update-'+value.id+'" class="media"><a href="#" class="pull-left"><img src="'+statusUserImage+'" alt="'+avatar+'" class="img-circle"></a><div class="media-body"><p class="push-bit"><span class="text-muted pull-right"><small>'+moment.utc(value.created_at, "YYYYMMDD hh:mm").fromNow()+'</small><span class="text-info" data-toggle="tooltip" title="" data-original-title="From Custom App"><i class="fa fa-mobile"></i></span></span><strong><a href="#">'+value.fullname+'</a>'+updatedStatus+'</strong></p><p>'+postStatus+'</p><p><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-thumbs-o-up"></i>'+like+'</a><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-share-square-o"></i> '+share+'</a></p><ul class="media-list push" id="comment_'+value.id+'">';

          $.post('/user/get-comment',{'page': track_page,'status_id':value.id}, function(comment){
            var comment_status='';
            var status_id = value.id;
            $.each(comment, function(key, val ) {
              var commentStatus = val.comment,
              getWord = val.comment.split('[@]'),
              textareaCommnet = '';
              $.each(getWord, function(textIndex, textValue ) {
                textValue = $.trim(textValue);
                if(textValue !=''){
                  textValue = textValue.split('[/@]');
                  textareaCommnet = ' <span class="mention-area"><span class="highlight"><a href="undefined" data-item-id="4" class="mentiony-link">'+textValue[0]+'</a></span></span>';
                  commentStatus = commentStatus.replace('[@]'+textValue[0]+'[/@]',textareaCommnet);
                }
              });
              status_id = val.status_id;
              var commentUserImage = '/uploads/users/'+val.user_id+'/profile-image/thumb/'+value.user_profile_image;
                if(val.user_id == null)
                  commentUserImage = '/uploads/users/avatar.jpg';
                  var comment ="<li class=\"media\"><a class=\"pull-left animation-fadeIn\"><img src='/uploads/users/"+val.user_id+"/profile-image/thumb/"+val.user_profile_image+"' alt='"+avatar+"' class=\"img-circle\"></a><div class=\"media-body animation-pullDown\"><span class=\"text-muted pull-right\"><small>"+moment.utc(val.created_at, "YYYYMMDD hh:mm").fromNow()+"</small><span class=\"text-success\" data-toggle=\"tooltip\" title='' data-original-title=\"From Mobile\"><i class=\"fa fa-mobile\"></i></span></span><div class=\"usrCmnt\"><a>"+val.first_name+"</a></div><div class=\"cmntMsg\">"+commentStatus+"</div></div></li>";
              $("#comment_"+status_id).prepend(comment);
            });
            if(comment.length == 5){
              comment_status = "<li class=\"media\"><input type=\"button\" class=\"load-more\" status_id= \""+value.id+"\" page='1' value='"+loadPreviousCmnt+"''></li>";
            }
            $("#comment_"+status_id).prepend(comment_status);
            var userImage = $('#user_profile_thumbnail_show').attr('src');
            var textBox = '<li class="media" id="com_text_'+value.id+'"><a href="#" class="pull-left"><a href="#" class="pull-left"><img src="'+userImage+'" alt="'+avatar+'" class="img-circle"></a><div class="media-body"><form method="post" class="comment-status" id="comment_status_'+value.id+'" name="comment_status_'+value.id+'"><textarea name="status_comment" id="comment_text_'+value.id+'" class="form-control add-mention" rows="2" placeholder="'+commentBox+'" required ></textarea><input type="hidden" name="status" value="'+value.id+'"><button type="submit" class="btn btn-xs btn-primary pull-right"><i class="fa fa-pencil"></i>'+postBtn+'</button></form></div></li></ul></div></li>';
              $("#comment_"+status_id).append(textBox);
              taging('comment_text_'+value.id);
              status_ids.push(value.id);
              formSubmitOnEnter(value.id); 
          });
          newsfeed += "</ul></li>";
        });
        $("#myloading").hide(); 
        $("#newsfeed").append(newsfeed);
        $.each(status_ids, function(key, id ) {
          taging('comment_text_'+id);
          formSubmitOnEnter(id);  
        }); 
      }).fail(function(xhr, ajaxOptions, thrownError) { 
        alert(thrownError);
      });
    }
  }
/*************************Add Comment ************************************/
    var cmtMessage = $('message#commnet_required').html();
    $(document).on('submit', '.comment-status', function(event){
      event.preventDefault();
     
      var validate = $(this).validate({
        rules: {
          comment_status: {
            required: {
              depends:function(){
                  $(this).val($.trim($(this).val()));
                  return true;
              }
            },
          }      
        },
        messages: {
          name: cmtMessage,
        }
      });
      if(validate){
        var self = this;
        var formValue = $(this).serializeArray();
        var commnet = formValue[0].value,
        status_id = formValue[1].value;
        var user_name = $('#user').val();
        var user_image = $('#user_profile_thumbnail_show').attr('src');
        var post = $(".cmntMsg").html();
        
        var tagUserId = new Array(),
        tagUserName = new Array();

        $(".tag-user").each(function( index ) {
          var id = $(this).attr("data-item-id"),
          name = $(this).text();
          tagUserId.push(id);
          tagUserName.push(name);  
        });
        var company_id = '';
        if($("#company_dropdown").length > 0){
          if($("#company_dropdown").val()) {
            company_id = $("#company_dropdown").val();
            $("#company").val(company_id);
          } 
        }
        $.ajax({
          url: "/user/comment",
          type: "POST",      
          data: $(this).serialize(),
          beforeSend: function(){
            $('#show-msg').html("");
          },
          success: function(response) {
            socket.emit('newComment',{'commnet':commnet,'status_id':status_id,'user_name':user_name,'user_image':user_image});
            
           $( "#com_text_"+status_id ).before("<li class=\"media\"><a class=\"pull-left animation-fadeIn\"><img src='"+user_image+"' alt=\"Avatar\" class=\"img-circle\"></a><div class=\"media-body animation-pullDown\"><span class=\"text-muted pull-right\"><small>"+moment(moment().format(), "YYYYMMDD hh:mm").fromNow()+"</small><span class=\"text-success\" data-toggle=\"tooltip\" title='' data-original-title=\"From Mobile\"><i class=\"fa fa-mobile\"></i></span></span><div class=\"usrCmnt\"><a>"+user_name+"</a></div><div class=\"cmntMsg\">"+commnet+"</div></div></li>");
            $(".mentiony-content").html(""); 
            var type = 1;

            saveAttherate(tagUserId,company_id,status_id,tagUserName,type);
            //onsole.log(tagUserName);

            $(".mentiony-link").removeClass("tag-user");
          },
          error: function(){
            $("#myloading").hide();
          }
        });
      }
    });

    
/********************* Event For load more Post **********************************/
    $(document).on('click', '.load-more', function(event){
      var page = $(this).attr('page'),
      status_id = $(this).attr('status_id');
      page = parseInt(page)+1;
      $(this).attr('page',page);
      var self = this;
      $.post('/user/get-comment',{'page':page ,'status_id':status_id}, function(comment){
        var comment_status='';
        var status_id = status_id;
        $.each(comment, function(key, val ) {
          status_id = val.status_id;
          var commentUserImage = '/uploads/users/'+val.user_id+'/profile-image/thumb/'+val.user_profile_image;
            if(val.user_id == null)
              commentUserImage = '/uploads/users/avatar.jpg';
            comment_status ="<li class=\"media load-comment\"><a class=\"pull-left animation-fadeIn\"><img src='"+commentUserImage+"' alt=\"Avatar\" class=\"img-circle\"></a><div class=\"media-body animation-pullDown\"><span class=\"text-muted pull-right\"><small>"+moment.utc(val.created_at, "YYYYMMDD hh:mm").fromNow()+"</small><span class=\"text-success\" data-toggle=\"tooltip\" title='' data-original-title=\"From Mobile\"><i class=\"fa fa-mobile\"></i></span></span><div class=\"usrCmnt\"><a>"+val.first_name+"</a></div><div class=\"cmntMsg\">"+val.comment+"</div></div></li>";
           $(self).after(comment_status); 
        });
        if(comment.length < 5){
          $(self).hide();
        }
        //$(self).after(comment_status);
      });
    });

    socket.on('showNewComment', function (data) {
      $( "#com_text_"+data.message.status_id).before("<li class=\"media\"><a class=\"pull-left animation-fadeIn\"><img src='"+data.message.user_image+"' alt=\"Avatar\" class=\"img-circle\"></a><div class=\"media-body animation-pullDown\"><span class=\"text-muted pull-right\"><small>"+moment(moment().format(), "YYYYMMDD hh:mm").fromNow()+"</small><span class=\"text-success\" data-toggle=\"tooltip\" title='' data-original-title=\"From Mobile\"><i class=\"fa fa-mobile\"></i></span></span><div class=\"usrCmnt\"><a>"+data.message.user_name+"</a></div><div class=\"cmntMsg\">"+data.message.commnet+"</div></div></li>");
    });
    
    socket.on('showNewStatus', function (status) {
      //var encoded = Base64.encode(status.message.company);
      var encodedId = Base64.encode('status-div-'+status.message.company);
      var count = (encodedId.match(/=/g) || []).length;
      if(count > 0) {
        var newId = encodedId.replace(/=/g , "")  
      } else {
        var newId = encodedId;
      }
      //alert(newId);
      var postBtn = $("message#post_comment_btn").html(),
      commentBox = $("message#comment_box").html(),
      updatedStatus = $("message#updated_status").html(),
      avatar = $("message#avatar").html();
      status = status.message;
      var newStatus = '<li id="newsfeed-update-" class="media"><a href="#" class="pull-left"><img src="'+status.user_image+'" alt="'+avatar+'" class="img-circle"></a><div class="media-body"><p class="push-bit"><span class="text-muted pull-right"><small>'+moment(moment().format(), "YYYYMMDD hh:mm").fromNow()+'</small><span class="text-info" data-toggle="tooltip" title="" data-original-title="From Custom App"><i class="fa fa-mobile"></i></span></span><strong><a href="#">'+status.user_name+'</a>'+updatedStatus+'</strong></p><p>'+status.status+'</p><p><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-thumbs-o-up"></i> Like</a><a href="javascript:void(0)" class="btn btn-xs btn-default"><i class="fa fa-share-square-o"></i> Share</a></p><ul class="media-list push" id="comment_'+status.status_id+'">';
        newStatus +="<li class=\"media\" id=\"com_text_"+status.status_id+"\"><a href='#' class=\"pull-left\"><a href='#' class=\"pull-left\"><img src='"+status.user_image+"' alt='"+avatar+"' class=\"img-circle\"></a><div class=\"media-body\"><form method=\"post\" class=\"comment-status\" id=\"comment_status_"+status.status_id+"\" name=\"comment_status_"+status.status_id+"\"><textarea  name=\"status_comment\" id=\"comment_text_"+status.status_id+"\" class=\"form-control comment add-mention\" rows=\"1 \" placeholder='"+commentBox+"' required></textarea><input type=\"hidden\" name=\"status\" value=\""+status.status_id+"\"><button type=\"submit\" class=\"btn btn-xs btn-primary btn_comment pull-right\"><i class=\"fa fa-paper-plane\"></i>"+postBtn+"</button></form></div></li>";
        newStatus += "</ul></li>";
        if($("#" + newId).length != 0) {
          $("#newsfeed").prepend(newStatus);
        }
        taging('comment_text_'+status.status_id);
        formSubmitOnEnter(status.status_id);
    });


/*************************Get all user for tag ********************************/
  function taging(id){
    $('#'+id).mentiony({
      onDataRequest: function (mode, keyword, onDataRequestCompleteCallback) {
        $.ajax({
          method: "GET",
          url: "/user/get-tag?user="+ keyword,
          dataType: "json",
          success: function (response) {
            var data = response;
            data = jQuery.grep(data, function( item ) {
              return item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
            });
            onDataRequestCompleteCallback.call(this, data);
          }
        });
      },
      timeOut: 500,
      debug: 1,
    });
  }

/*********************************Save tag *******************************/
  function saveHashTag(hashTag,company_id,post_id){
    $.post('/user/add-hash',
    {
      'hash':JSON.stringify({'hashTag' : hashTag}) ,
      'company':company_id,
      'post_id':post_id
    }, 
    function(post){
      return post;
    });
  }

/*********************************Save attherate *******************************/
  function saveAttherate(tagUserIds,company_id,post_id,tagUserNames,type){
    $.post('/user/add-attherate',{'users':JSON.stringify({ids : tagUserIds,names: tagUserNames}),'company':company_id,'post_id':post_id,'type':type}, function(post){
      if(tagUserIds.length > 0) {
        getNotify(tagUserIds);
        getNotifyMessage(tagUserIds);
      }
      return post;
    });
  }

  //var socket = io.connect('http://127.0.0.1:3000');
  function getNotify(tagUserId) {
    
    $.each(tagUserId, function( key, obj) {
      $.ajax({
        method: "GET",
        url: "/user/get-notification-count?user="+ obj,
        success: function (response) {
          socket.emit('newNotification',{'count':response.count,'tag_userId':obj});
        }
      });
      
    });
  }

  function getNotifyMessage(tagUserId) {
    
    $.each(tagUserId, function( key, obj) {
      $.ajax({
        method: "GET",
        url: "/user/get-notifications?page=1&socket=1&user="+ obj,
        success: function (response) {
          socket.emit('newNotificationMessage',{'message':response});
        }
      });
      
    });
  }

/************************Submit on enter method**********************/
 function formSubmitOnEnter(id){
    $('#comment_text_'+id).keypress(function (event) {
      if ( event.shiftKey && event.keyCode == 13) 
      {
        event.stopPropagation();
      }
      else if(event.keyCode == 13)
      {
        event.preventDefault();
        $('#comment_status_'+id).submit();
      }
    });
  }

});