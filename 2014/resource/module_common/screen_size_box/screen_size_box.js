/*
 * Usage:
 * Provide:
 * .js_screen_size_container
 *   .js_screen_size_img_container // no height container of full size image, put this first line within .js_screen_size_container
 *     img // to be full sized, absolute position with low z-index
 *   .js_screen_size_container__content // would be vertically center positioned, adjust height to get it right
 *     .js_fit_text // suggest using fit text for the title
 *
 * Additional:
 * .js_screen_hide_all // to be added to body to avoid jumping
 * */
function Backgrounder() {
  "use strict";

  var imgContainer = jQuery( '.js_screen_size_img_container' ),
      img = imgContainer.find( 'img' ),
      container = imgContainer.closest( '.js_screen_size_container' ),
      body = jQuery( '.js_screen_hide_all' );

  this.autoEnable = function () {
    enable();
    registerAjaxOnCompleteEvents();
  };

  var enable = function () {
    resizing();

    jQuery( window ).resize( function () {
      resizing();
    } );
  };

  var resizing = function () {
    resizeContainer();
    resizeImage( img );
  };

  var resizeContainer = function () {
    container.css( 'width', jQuery( window ).width() );
    container.css( 'height', jQuery( window ).height() );
  };

  var resizeImage = function ( img ) {
    imagesLoaded( img, function () {
      var screenW = jQuery( window ).width();
      var screenH = jQuery( window ).height();

      var imgW = jQuery( img ).width();
      var imgH = jQuery( img ).height();

      // set image size based on larger ratio
      if ( imgW / imgH > screenW / screenH ) {
        var scale = screenH / imgH;
        jQuery( img ).attr( {'width': imgW * scale, 'height': imgH * scale} );
      }
      else {
        var scale = screenW / imgW;
        jQuery( img ).attr( {'width': imgW * scale, 'height': imgH * scale} );
      }

      // position image to center
      jQuery( img ).css( {
                           'left': -((jQuery( img ).width() - screenW) / 2),
                           'top': -((jQuery( img ).height() - screenH) / 2)
                         } );

      body.removeClass( 'js_screen_hide_all' );
    } );
  };

  var registerAjaxOnCompleteEvents = function () {
    jQuery( document ).ajaxComplete( function () {
      enable();
    } );
  };
}

jQuery( document ).ready( function () {
  new Backgrounder().autoEnable();
} );
