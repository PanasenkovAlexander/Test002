
export function sendAjaxForm(formData){
    
    $.ajax({
        type: "POST",
        url: "send.php",
        // contentType: false, 
        // processData: false,
        data: formData,
        success: function(msg){
            console.log(msg);
            var result = jQuery.parseJSON(msg);
            console.log(result.error);
        }
    });
}


