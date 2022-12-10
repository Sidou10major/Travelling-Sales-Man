$(document).keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        if($('#modal').hasClass('show')){
            $('#confirm').click();
        }
    }
});
