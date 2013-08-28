/**
* Redpill Linpro root namespace.
* 
* @namespace Extras
*/
if (typeof RPLP == "undefined" || !RPLP)
{
   var RPLP = {};
}

(function()
{	
  
	/** YUI Library aliases */
   var IdleTimer = YAHOO.util.IdleTimer;
   
   
   var thisName = "RPLP.PresenceUpdater";
  

   RPLP.PresenceUpdater = function(idleStatus, activeStatus)
   {
	   //just playing along
	  this.startIdleTimer();
	  if (idleStatus) this.statusOnIdle = idleStatus;
	  if (activeStatus) this.statusOnActive = activeStatus;
	  
      return this;
   };
   RPLP.PresenceUpdater.prototype.statusOnIdle = 16;
   RPLP.PresenceUpdater.prototype.statusOnActive = 0;
   RPLP.PresenceUpdater.prototype.onUpdateChange = null;
   RPLP.PresenceUpdater.prototype.updatingPresence = false;
   RPLP.PresenceUpdater.prototype.onUpdateChange = null;
   RPLP.PresenceUpdater.prototype.startIdleTimer = function (){
	   
       var me = this;
       
       IdleTimer.subscribe(IdleTimer.IDLE, function() {me.userIdle();});
       
       IdleTimer.subscribe(IdleTimer.ACTIVE, function() {me.userActive();});
       
       //TODO configure in globals or user settings
       IdleTimer.start(5000); //30 sec
   };
      
   RPLP.PresenceUpdater.prototype.userActive = function () {
	   this.setStatus(this.statusOnActive);
   };
   
   RPLP.PresenceUpdater.prototype.userIdle = function() {
	   this.setStatus(this.statusOnIdle);
   };
   RPLP.PresenceUpdater.prototype.setStatus = function (status) {
	   if (null != this.onUpdateChange) {
		   this.onUpdateChange(status)
	   }
	   if (!this.updatingPresence) 
	   { 
		   this.updatingPresence = true;
		   var me = this;
		   Alfresco.util.Ajax.jsonPost(
           {
              url: Alfresco.constants.PROXY_URI + "presence/update",
              dataObj:
              {
            	  myStatus: status
              },
              failureCallback: { 
            	  fn: function (response)
                  {
                   	this.updatingPresence = false;
                  },
                  scope: this
              },
              successCallback:
              {
                 fn: function (response)
                 {
                    if (null != response && null != response.json && response.json.success) {
                  	    //nothing to do
                    }
                    this.updatingPresence = false;
                 },
                 scope: this
              	 
              }
              //successMessage: this.msg("message.create-content-by-template-node.success", sourcePath),
              //failureMessage: this.msg("message.create-content-by-template-node.failure", sourcePath)
           });
	   };
   };
})();
