$(function() {
    if (typeof messages != 'undefined' && messages != '') {
        console.log(messages);
        $.toast({
            heading: 'Ca',
            text: messages.message,
            position: 'bottom-right',
            loaderBg: '#ff6849',
            icon: 'error',
            hideAfter: 3500,
            stack: 6
        });
    }
});