jQuery( document ).ready( function () {
  JS_CORE.autoEnable();
} );

/* Constants
 ******************/
var JS_CORE = new Core(); //Used to enable the core functionality

/*internally used within core.js*/
var JS_REMOTE = new Remote();

/*to be used outside of core.js*/
var JS_CHECKBOX = new Checkbox();
var JS_DEBUG = new JsDebug();
var JS_INPUTS = new Inputs();
var JS_LAYOUT = new Layout();
var JS_PAGE = new Page();
var JS_PATH = new Path();
var JS_STATE = new State();
var JS_STRING = new JsString();
var JS_BROWSER = new Browsers(); //require enabling
var JS_FORM = new SubmitForm(); //require enabling
var JS_MISC = new Misc(); //require enabling

/* Constructors
 ******************/
function Core() {

  "use strict";

  this.autoEnable = function () {
    enableEvents();
    registerAjaxOnCompleteEvents();
  };

  /* Once this is registered on load, all events would automatically reapply to page elements when Ajax is completed. */
  var registerAjaxOnCompleteEvents = function () {
    jQuery( document ).ajaxComplete( function () {
      enableEvents();
    } );
  };

  var enableEvents = function () {
//    JS_REMOTE.enableAjaxErrorHandling();

    JS_BROWSER.enable();
    JS_FORM.enable();
    JS_MISC.enable();

    enableBootstrap();
    enableScroll();
  };

  var enableBootstrap = function () {
    if ( JS_PAGE.has( ".alert" ) ) {
      jQuery( ".alert" ).alert();
    }

    if ( JS_PAGE.has( ".typeahead" ) ) {
      jQuery( '.typeahead' ).typeahead();
    }
  };

  /*Added class:
   * .js_smooth_scroll - enable scroll
   * .js_smooth_scroll_section - All anchors within this section has scroll effect
   * */
  var enableScroll = function () {
    if ( JS_PAGE.has( ".js_smooth_scroll" ) ) {
      jQuery( '.js_smooth_scroll' ).smoothScroll();
    }

    if ( JS_PAGE.has( ".js_smooth_scroll_section" ) ) {
      jQuery( '.js_smooth_scroll_section a' ).smoothScroll();
    }
  };
}

/**************************
 * Remote
 **************************/
function Remote() {

  "use strict";

  var failedRequestUri = '/error';
  var timeoutUri = '/logout/index';

  /*Enable this once only when document is ready*/
  this.enableAjaxErrorHandling = function () {
    jQuery( document ).ajaxError( function ( event, jqXHR ) {
      //this === jQuery( document ) at this point, so the below use JS_REMOTE

      // 401 - Authentication required but not provided, means session has timed out (Grails returns 401 when Ajax request is made after timeout)
      if ( jqXHR.status === 401 ) {
        handleTimeout();
      }
      // page not found - somehow Ajax request failure comes to here - this could be a Grails 2.0.3 mistake and corrected in 2.2.3
      if ( jqXHR.status === 404 ) {
        handleTimeout();
      }
      // error occurred
      if ( jqXHR.status === 500 ) {
        handleFailure(); // go to error page
      }
    } );
  };

  var handleTimeout = function () {
    window.location = JS_PATH.appRoot() + timeoutUri;
  };

  var handleFailure = function () {
    window.location = JS_PATH.appRoot() + failedRequestUri;
  };
}

/**************************
 * Page
 * Each module (a javascript file) itself should provide enable().
 * Any public enable() method should check JS_PAGE.has(selector) before enabling the functionality.
 * DO NOT let the users worry about the checking.
 **************************/
function Page() {

  "use strict";

  this.has = function ( selector ) {
    return jQuery( selector ).length > 0;
  };

  this.hasNo = function ( selector ) {
    return jQuery( selector ).length === 0;
  };
}

/**************************
 * Layout
 **************************/
function Layout() {

  "use strict";

  /**
   * This applies a height to a container, so that it starts from its top position, and reserves some space at the bottom.
   * A container requires a height to allow scrolling.
   * If the usage is for scrolling, it also require adding a class .scroll_y
   *
   * @param topicSelector - any container that require setting such a height
   * @param bottomSpace - a number of px to reserve bottom space
   */
  this.applyHeight = function ( topicSelector, bottomSpace ) {
    if ( JS_PAGE.hasNo( topicSelector ) ) {
      return
    }

    //heights
    var contentHeight = pageHeight() - getY( topicSelector ) - bottomSpace; //somehow need to double bottomSpace size

    //apply
    setHeight( topicSelector, contentHeight );
  };

  var pageHeight = function () {
    jQuery( 'html' ).height( '100%' ); //make page height available
    return jQuery( 'html' ).height();
  };

  /**
   * @return top position of element
   */
  var getY = function ( selector ) {
    return jQuery( selector ).offset().top;
  };

  var setHeight = function ( selector, height ) {
    jQuery( selector ).height( height );
  };
}

/**************************
 * Path
 **************************/
function Path() {

  "use strict";

  /*Take http://localhost:9051/my-app/ for example*/

  /*return: http://localhost:9051 */
  this.domain = function () {
    return document.location.protocol + '//' + document.location.host;
  };

  /*return: http://localhost:9051/my-app - or, some server e.g. AppFog don't show context path on client side, then just use the domain name*/
  this.appRoot = function () {
    //building up specific cases for different servers to support production mode
    if ( JS_STRING.contains( this.domain(), '.aws.af' ) ) {
      return this.domain();
    }

    return this.domain() + '/' + this.contextPath();
  };

  /*return: http://localhost:9051/my-app/ */
  this.appRootSlash = function () {
    return this.appRoot() + '/';
  };

  /*return: my-app */
  this.contextPath = function () {
    return window.location.pathname.split( '/' )[1];
  };

  /*return: /my-app */
  this.slashContextPath = function () {
    return '/' + this.contextPath();
  };

  /*return: my-app/ */
  this.contextPathSlash = function () {
    return this.contextPath() + '/';
  };

  /*return: /my-app/ */
  this.slashContextPathSlash = function () {
    return '/' + this.contextPathSlash();
  };

  /*return: http://localhost:9051/my-app/controller/action/id - no # after id - this allows redirecting to same page (refreshing) */
  this.fullPath = function () {
    return document.location.protocol + '//' + document.location.host + window.location.pathname;
  };
}


/**************************
 * States
 **************************/
function State() {

  "use strict";

  this.scroll = function ( selector, enable ) {
    if ( enable ) {
      jQuery( selector ).removeClass( 'is_unscrollable' );
    }
    else {
      jQuery( selector ).addClass( 'is_unscrollable' );
    }
  };

  /**
   * @param yesNo - true to disable an input, false to enable it
   * */
  this.disableInput = function ( selector, yesNo ) {
    if ( yesNo ) {
      jQuery( selector ).attr( 'disabled', true );
    }
    else {
      jQuery( selector ).removeAttr( 'disabled' );
    }
  };

  /*disable also remove value, enable just enables it*/
  this.disableCheckbox = function ( selector, yesNo ) {
    if ( yesNo ) {
      jQuery( selector ).removeAttr( 'checked' );
      jQuery( selector ).attr( 'disabled', true );
    }
    else {
      jQuery( selector ).removeAttr( 'disabled' );
    }
  };
}

/**************************
 * Checkbox
 * Usage:
 * JS_CHECKBOX.isChecked( oneCheckbox )
 * JS_CHECKBOX.check( oneOrManyCheckboxes )
 * JS_CHECKBOX.uncheck( oneOrManyCheckboxes )
 **************************/
function Checkbox() {

  "use strict";

  this.isChecked = function ( oneCheckbox ) {
    return jQuery( oneCheckbox ).filter( '[type=checkbox]' ).prop( 'checked' );
  };

  this.check = function ( oneOrManyCheckboxes ) {
    jQuery( oneOrManyCheckboxes ).filter( '[type=checkbox]' ).prop( 'checked', true );
  };

  this.uncheck = function ( oneOrManyCheckboxes ) {
    jQuery( oneOrManyCheckboxes ).filter( '[type=checkbox]' ).removeAttr( 'checked' );
  };
}

/**************************
 * Inputs
 **************************/
function Inputs() {

  "use strict";

  /*
   * Javascript false: 0, null, "", false, undefined, NaN
   * Javascript true: "  "
   * For easier understanding, read !value as: no value
   * */

  /*
   All the elements in the list are all with blank content. e.g. [' ', '   ', "", "  "] returns true
   return boolean
   */
  this.allBlankText = function ( inputs ) {
    if ( !inputs ) {
      return true;
    }

    var outcome = "";
    jQuery( inputs ).each( function () {
      outcome += this.value
    } );
    return jQuery.trim( outcome ).length == 0
  };

  /*
   None of the elements in the list is with blank content. e.g. ['a', '   '] returns false
   return boolean
   */
  this.noBlankText = function ( inputs ) {
    if ( !inputs ) {
      return false;
    }

    var outcome = jQuery( inputs ).length > 0;
    jQuery( inputs ).each( function () {
      if ( !jQuery.trim( jQuery( this ).val() ) ) {
        outcome = false;
      }
    } );

    return outcome;
  }
}

/**************************
 * Debug
 **************************/
function JsDebug() {

  "use strict";

  /**
   * Example:
   * JS_DEBUG.bound('.btn').click - then lock at 'handler' to check if click event has been bound to .btn
   */
  this.bound = function ( selector ) {
    return jQuery( selector ).data( 'events' )
  };
}

/**************************
 * String
 **************************/
function JsString() {

  "use strict";

  /**
   * Javascript contains check
   */
  this.contains = function ( whole, part ) {
    return whole.indexOf( part ) !== -1
  };
}

/**************************
 * SubmitForm
 * It checks all the text fields with 'required' attribute to determine whether enable .js_submit_action
 *
 * Added classes:
 * .js_submit_action - this button would be disabled if any required TEXT input field is empty
 **************************/
function SubmitForm() {

  "use strict";

  this.enable = function () {
    if ( JS_PAGE.has( 'form .js_submit_action' ) ) {
      monitorRequiredFields();
    }
  };

  var monitorRequiredFields = function () {
    jQuery( 'form' ).each( function () {
      monitorRequiredFieldsForForm( this );
    } );
  };

  /*
   * Prevent submission when required fields are not entered.
   * */
  var monitorRequiredFieldsForForm = function ( formSelector ) {
    var form = jQuery( formSelector );
    var requiredFields = form.find( "input[required]" );
    var requiredInputs = requiredFields.filter( "[type='text']" ).
        add( requiredFields.filter( "[type='email']" ) ).
        add( requiredFields.filter( "[type='number']" ) ).
        add( requiredFields.filter( "[type='url']" ) ).
        add( requiredFields.filter( "[type='tel']" ) ).
        add( requiredFields.filter( "[type='password']" ) ).
        add( form.find( "textarea[required]" ) );

    if ( requiredInputs.length > 0 ) {
      preventSubmissionForRequiredFields( form, requiredInputs );

      requiredInputs.keyup( function () {
        preventSubmissionForRequiredFields( form, requiredInputs );
      } );
    }
  };

  var preventSubmissionForRequiredFields = function ( form, requiredInputs ) {
    var submitAction = form.find( '.js_submit_action' );

    var hasBlankText = !JS_INPUTS.noBlankText( requiredInputs );

    JS_STATE.disableInput( submitAction, hasBlankText );
  };
}

/**************************
 * Browsers
 * Adds browser type to the html element as a css class (similar to Modernizr)
 **************************/
function Browsers() {

  "use strict";

  var userAgent = window.navigator.userAgent.toLowerCase();

  this.enable = function () {
    if ( this.isSafariWindows() ) {
      jQuery( 'html' ).addClass( 'is_safari_windows' );
    }
    else if ( this.isSafari() ) {
      jQuery( 'html' ).addClass( 'is_safari' );
    }
    else if ( this.isChrome() ) {
      jQuery( 'html' ).addClass( 'is_chrome' );
    }
    else if ( this.isFirefox() ) {
      jQuery( 'html' ).addClass( 'is_firefox' );
    }
    else if ( this.isIeEdge() ) {
      jQuery( 'html' ).addClass( 'is_ie_edge' );
    }
    else if ( this.isIe9() ) {
      jQuery( 'html' ).addClass( 'is_ie9' );
    }
    else if ( this.isIe8() ) {
      jQuery( 'html' ).addClass( 'is_ie8' );
    }
    else if ( this.isIe7() ) {
      jQuery( 'html' ).addClass( 'is_ie7' );
    }
    else {
      jQuery( 'html' ).addClass( 'is_unpopular_browser' );
    }
  };

  this.isSafariWindows = function () {
    return this.isSafari() && JS_STRING.contains( userAgent, 'windows' );
  };

  this.isSafari = function () {
    return JS_STRING.contains( userAgent, 'safari/' ) && !JS_STRING.contains( userAgent, 'chrome/' );
  };

  this.isChrome = function () {
    return JS_STRING.contains( userAgent, 'safari/' ) && JS_STRING.contains( userAgent, 'chrome/' );
  };

  this.isFirefox = function () {
    return JS_STRING.contains( userAgent, 'firefox/' );
  };

  this.isIeEdge = function () {
    return JS_STRING.contains( userAgent, 'msie 1' ); // >=10
  };

  this.isIe9 = function () {
    return JS_STRING.contains( userAgent, 'msie 9' );
  };

  this.isIe8 = function () {
    return JS_STRING.contains( userAgent, 'msie 8' );
  };

  this.isIe7 = function () {
    return JS_STRING.contains( userAgent, 'msie 7' );
  };
}

/**************************
 * Misc
 * This includes:
 * .js_current_year
 **************************/
function Misc() {

  "use strict";

  this.enable = function () {
    currentYear();
  };

  /*
   * Added class
   * .js_current_year - a span with this class would show the current year.
   * */
  var currentYear = function () {
    jQuery( '.js_current_year' ).html( new Date().getFullYear() );
  }
}