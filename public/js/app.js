"use strict";

$(function() {
	
	$('.gallery').magnificPopup({
  		delegate: 'a', // child items selector, by clicking on it popup will open
  		type: 'image',
  		image:{
  			titleSrc: 'title',
  			verticalFit: true
  		},
  		gallery:{
    		enabled:true
  		},  		
  		zoom: {
    		enabled: true, // By default it's false, so don't forget to enable it
    		duration: 300, // duration of the effect, in milliseconds
    		easing: 'ease-in-out',
    	}  		 	
	});
		
    console.log( "ready!" );            		       
});

/**
 * Send form with recaptcha token
 * 
 * @param {String} parent form ID
 * @param {String} SITE_KEY, Google Site-Key
 * @param {String} action
 */
function submitRecapchaForm( IDForm, SITE_KEY, action){	
	if(!SITE_KEY){
		document.getElementById( IDForm ).submit();
		return;	 	
	}
		
	grecaptcha.ready(function() {
      grecaptcha.execute(SITE_KEY, {'action': action}).then(function( token ){
      	
      	var input = document.createElement("input");
      	input.setAttribute("type", "hidden");
		input.setAttribute("name", "recaptcha-response");
		input.setAttribute("value", token);
		      	      	     
      	document.getElementById( IDForm ).appendChild(input)  
      	document.getElementById( IDForm ).submit()	     		     		     
      });
    });			
}