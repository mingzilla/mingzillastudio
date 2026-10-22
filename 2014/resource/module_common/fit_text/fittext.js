/* Constructor
 Added classes:
 .js_fit_text
 *******************/
function FitText() {

  "use strict";

  var elements = jQuery( '.js_fit_text' );

  this.autoEnable = function () {
    enable();
    registerAjaxOnCompleteEvents();
  };

  var enable = function () {
    elements.fitText( 1.2, { minFontSize: '40px', maxFontSize: '100px' } );
  };

  var registerAjaxOnCompleteEvents = function () {
    jQuery( document ).ajaxComplete( function () {
      enable();
    } );
  };
}

jQuery( document ).ready( function () {
  new FitText().autoEnable();
} );
