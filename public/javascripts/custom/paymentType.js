$(function() {

  getPaymentModes();
  /** create new payment **/
  savePayment();

   $(document).on("click","#addDeadline",function(event){
      $('#deadlineBody').append('<tr><td><div class="date-picker-block"><input value="" class="input-fill" type="text" name="days[]" required><span><img src="/images/calendra.png" alt=""></span></div></td><td><input value="" class="input-fill" type="text" name="percentage[]" required></td><td><input name="end_month[]" type="checkbox" value="end_month" /></td></tr>');
   });

});

function getPaymentModes(){
   $.ajax({
      url: "/payment/get-payment-modes",
      type: "GET",      
      success: function(response) {
         console.log(response);
         if(response.length > 0) {
            $.each(response, function(key, obj) {
               $('#payment-modes').append('<option value="'+obj.id+'">'+obj.name+'</option>');
            });
         }
      },
      error: function(){}
    });     
}

function savePayment(){
   var paymentRequiredMsg = $("message#payment_required").html();
   var daysRequired = $("message#days_required").html();
   var percentageRequired = $("message#percentage_required").html();

   $("#payment_add_form").validate({
      rules: {
         "payment_name": "required",
         "days[]": "required",
         "percentage[]": "required"
      },
      messages: {
         "payment_name": paymentRequiredMsg,
         "days[]": daysRequired,
         "percentage[]": percentageRequired
      },
      submitHandler: function(form) {
         // var formData = $("#payment_add_form").serialize();
         // console.log(formData);
         $('#payment_add_form').ajaxSubmit(options);
      }
   });
}

function showResponse(responseText, statusText, xhr, $form){

}

function showRequest(formData, jqForm, options) { 
    // $("#myloading").show();
    //return true;
   //formData.append('files[]', 'dfsf');
   console.log(formData);
} 

var options = { 
   beforeSubmit:  showRequest,  // pre-submit callback 
   success:       showResponse  // post-submit callback 
}; 



