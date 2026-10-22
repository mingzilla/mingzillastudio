/* ================================================================================
 * function_executor.js
 * ================================================================================
 *
 * Provides the functionality to safely execute javascript functions. Its
 * intended use is for the calling of functions onSuccess of an Ajax callback. As
 * such there is a global variable defined called ON_SUCCESS, which should be used.
 *
 * Why do we need this?
 * --------------------
 *
 * This has been created as there are many instances where you need to update multiple
 * components on a page based on a single Ajax call. Grails does not provide a simple
 * solution for this, so instead we create javascript functions for specific
 * components that refresh themselves. It is possible that the component is not
 * included on a page and we do not want javascript errors because a function cannot
 * be found. The solution would be to use this library so no error is thrown if the
 * function does not exist.
 *
 * Example:
 *   <g:remoteLink controller="letter"
 *                 action="requestLetter"
 *                 class="btn"
 *                 params="[
 *                   membershipNumber:membership?.membershipNumber,
 *                   letterTypeId:regenerateableLetter.id
 *                 ]"
 *                 update="letterRequestPanel"
 *                 onSuccess="ON_SUCCESS.execute( 'refreshAuditHistory' )">
 *
 * This library provides two public methods;
 *   - execute    :: This will execute a single function
 *   - executeAll :: This will execute multiple functions (calling execute for each)
 *
 * Author : michael.anfield
 * =============================================================================== */

var ON_SUCCESS = new FunctionExecutor();

function FunctionExecutor() {

  "use strict";

  this.execute = function ( functionName ) {
    if ( eval( 'typeof( ' + functionName + ' ) == typeof( Function )' ) ) {
      eval( functionName + '()' );
    }
    else {
      console.log( functionName + '() does not exist' );
    }
  };

  this.executeAll = function ( functionNames ) {
    for ( var i = 0; i < functionNames.length; i++ ) {
      this.execute( functionNames[i] );
    }
  }
}
