/* Constructor
 Added classes:
 .js_shuffle_letters
 *******************/
function ShuffleLetters() {

  "use strict";

  var elements = jQuery( '.js_shuffle_letters' );

  this.autoEnable = function () {
    enable();
    registerAjaxOnCompleteEvents();
  };

  var enable = function () {
    elements.shuffleLetters();
  };

  var registerAjaxOnCompleteEvents = function () {
    jQuery( document ).ajaxComplete( function () {
      enable();
    } );
  };
}

jQuery( document ).ready( function () {
  new ShuffleLetters().autoEnable();
} );
