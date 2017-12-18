$(function() {
    if (typeof messages.icon != 'undefined' && messages.icon != '') {
        console.log(messages);
        $.toast({
            heading: messages.title,
            text: messages.message,
            position: 'bottom-right',
            loaderBg: '#ff6849',
            icon: messages.icon,
            hideAfter: 3500,
            stack: 6
        });
    }
});