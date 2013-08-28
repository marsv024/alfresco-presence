/*
 * Copyright (c) 2013 Rasmus Melgaard adopted from IdleTimer by Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Polling timer
 * @module poll-timer
 * @requires YAHOO, Event
 */
(function(){

    //-------------------------------------------------------------------------
    // Private variables
    //-------------------------------------------------------------------------
    
    var tId     = -1,           //timeout ID
        enabled = false,        //indicates if the idle timer is enabled
        timeout = 30000;        //the amount of time (ms) before the user is considered idle
        
    //-------------------------------------------------------------------------
    // Private functions
    //-------------------------------------------------------------------------
    
    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
    function firePollEvent(){
        
        //fire appropriate event
        YAHOO.util.PollingTimer.fireEvent(YAHOO.util.PollingTimer.POLL);
        
        //if the timer is enabled
        if (enabled){ 
            
            //set a new timeout
            tId = setTimeout(firePollEvent, timeout);
        }  
    }

    //-------------------------------------------------------------------------
    // Public interface
    //-------------------------------------------------------------------------
    
    /**
     * Centralized control for determining when a user has become idle
     * on the current page.
     * @class IdleTimer
     * @namespace YAHOO.util
     * @static
     */
    var PollingTimer = {
        
    	POLL: "poll",
    		
        /**
         * Indicates if the idle timer is running or not.
         * @return {Boolean} True if the idle timer is running, false if not.
         * @method isRunning
         * @static
         */
        isRunning: function(){
            return enabled;
        },

        
        /**
         * Starts the idle timer. This adds appropriate event handlers
         * and starts the first timeout.
         * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
         * @return {void}
         * @method start
         * @static
         */ 
        start: function(newTimeout){
            
            //set to enabled
            enabled = true;
            
            //assign a new timeout if necessary
            if (typeof newTimeout == "number"){
                timeout = newTimeout;
            }
            
            //set a timeout to toggle state
            tId = setTimeout(firePollEvent, timeout);
        },
        
        /**
         * Stops the idle timer. This removes appropriate event handlers
         * and cancels any pending timeouts.
         * @return {void}
         * @method stop
         * @static
         */         
        stop: function(){
        
            //set to disabled
            enabled = false;
            
            //clear any pending timeouts
            clearTimeout(tId);
        }
    
    };

    //inherit event functionality
    YAHOO.lang.augmentObject(PollingTimer, YAHOO.util.EventProvider.prototype);
    
    //create the custom event objects
    PollingTimer.createEvent(PollingTimer.POLL);
    
    //assign into place
    YAHOO.namespace("util");
    YAHOO.util.PollingTimer = PollingTimer;
})();