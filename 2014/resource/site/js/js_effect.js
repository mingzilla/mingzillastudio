/* Each user level will need to provide a custom version of this file.
 js_*plugin_name*_effect.js - Each plugin will need to create its own js_*plugin_name*_effect.js, which runs all the js effects defined in the plugin itself
 js_effect.js - The user of a plugin will need to create ajs_effect.js (a copy of this file), which includes e.g. the below in the enable section.
 <code>
 this.enable = function () {
 JS_SCAFFOLD_EFFECT.enable();
 JS_USER_ACCOUNT_EFFECT.enable();
 JS_OTHER_EFFECT.enable();
 };
 </code>

 Exclusion:
 js_effect.js - This file for each plugin will need to be excluded, so that a user plugin or a user application can recreate this file for itself.
 ******************/

/* Onload
 ******************/
jQuery( document ).ready( function () {
  JS_EFFECT.enable();
} );

/* Constant
 ******************/
var JS_EFFECT = new AppJsEffect();

/* Constructor
 * Enables core, module, and application specific effects.
 ******************/
function AppJsEffect() {

  "use strict";

  /**
   * To be used to re-apply Javascript effect to elements on the page after Ajax refresh.
   */
  this.enable = function () {

    JS_CORE.enable();

//    applyCustomJsEffect(); //disabled as it does not work well with rotation
  };

  /*Custom effect that has specific class names only available in this application*/
  var applyCustomJsEffect = function () {
    jQuery( '.withTooltip' ).tooltip();
  };
}
