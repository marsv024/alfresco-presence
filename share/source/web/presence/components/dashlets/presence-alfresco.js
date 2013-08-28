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
   var Dom = YAHOO.util.Dom;
   var PollingTimer = YAHOO.util.PollingTimer;
   
   var thisName = "RPLP.PresenceSimulator";
  
   /* Unknown status */
   var UNKNOWN = 7;
   RPLP.PresenceSimulator = function(username, simulate)
   {
	   var me = this;
	   this.username = username;
	   RPLP.PresenceUpdater.prototype.onUpdateChange = function (status) 
	   {
		   me.OnStatusChange(me.username, status, me.presenceElementIds[me.presenceUris.indexOf(me.username)]);
	   };
	   //just playing along
	  this.PresenceEnabled=true;
	  this.simulate = simulate;
	  this.startPollingTimer();
      return this;
   };
   RPLP.PresenceSimulator.prototype.OOUI = null;
   RPLP.PresenceSimulator.prototype.requestingPresence = false;
   RPLP.PresenceSimulator.prototype.OnStatusChange = null;
   RPLP.PresenceSimulator.prototype.PresenceEnabled = false;
   RPLP.PresenceSimulator.prototype.username = null;
   RPLP.PresenceSimulator.prototype.presenceUris = [];
   RPLP.PresenceSimulator.prototype.presenceStatuses = [];
   RPLP.PresenceSimulator.prototype.presenceElementIds = [];
   //RPLP.PresenceSimulator.prototype.pollingTimer = null;
   RPLP.PresenceSimulator.prototype.simulate = false;
   
   RPLP.PresenceSimulator.prototype.GetStatus = function (presenceUri, elementId) {
	   var status = null;
	   if (-1 < this.presenceUris.indexOf(presenceUri)) {
		   status = this.getStatus(presenceUri);
	   } else {
		   status = this.generateStatus(presenceUri);
		   this.presenceUris.push(presenceUri);
		   
	   }
	   var index = this.presenceUris.indexOf(presenceUri);
	   this.presenceStatuses[index] = status;
	   this.presenceElementIds[index] = elementId;
	   
	   this.OnStatusChange(presenceUri, status, elementId);
	   return status;
   };
   RPLP.PresenceSimulator.prototype.getStatus = function (presenceUri) {
	   return this.presenceStatuses[this.presenceUris.indexOf(presenceUri)];
   };
   RPLP.PresenceSimulator.prototype.generateStatus = function (presenceUri) {
	   if (this.simulate) {
		   return Math.floor(Math.random() * (20  + 1));
	   } else {
		   return UNKNOWN; // UNKNOWN
	   }
   };
   
   RPLP.PresenceSimulator.prototype.startPollingTimer = function (){
	   var me = this;
       PollingTimer.subscribe(PollingTimer.POLL, function() {me.getStatuses();});
       
       //TODO configure in globals or user settings
       PollingTimer.start(5000); //30 sec
   };
   RPLP.PresenceSimulator.prototype.stopPollingTimer = function (){
//	   var me = this;
//	   PollingTimer.unsubscribe(PollingTimer.POLL, me.getStatuses);
	   
       PollingTimer.stop();
   };
   RPLP.PresenceSimulator.prototype.getStatuses = function () {
	   if (!this.requestingPresence) 
	   { 
		   this.requestingPresence = true;
		   var me = this;
		   Alfresco.util.Ajax.jsonPost(
           {
              url: Alfresco.constants.PROXY_URI + "presence/statuses",
              dataObj:
              {
            	  presences: me.presenceUris
              },
              failureCallback: { 
            	  fn: function (response)
                  {
            		for (var i = 0; this.presenceUris.length > i; i++) 
           	    	{
               	    	var presenceUri = this.presenceUris[i];
               	    	//var index = this.presenceUris.indexOf(presenceUri);
               	    	this.presenceStatuses[i] = UNKNOWN;
                       	this.OnStatusChange(presenceUri, this.presenceStatuses[i], this.presenceElementIds[i]);
               	    }
                   	this.requestingPresence = false;
                  },
                  scope: this
              },
              successCallback:
              {
                 fn: function (response)
                 {
                    if (null != response && null != response.json && response.json.success) {
                  	    var presences = response.json.presences;
                  	    
                  	    for (var i = 0; this.presenceUris.length > i; i++) 
             	    	{
                  		  var presenceUri = this.presenceUris[i];
                  		  for (var j = 0 ;presences.length > j; j++) {
                  			  if (presences[j].username == presenceUri) {
                  				  var index = j;
                  				  break;
                  			  }
                  		  }
                 	    	
                 	    	
	             	    	//var index = presences.indexOf(presenceUri);
	             	      if (-1 < index) this.presenceStatuses[i] = presences[index].status;
	             	      else this.presenceStatuses[i] = UNKNOWN;
	                      this.OnStatusChange(presenceUri, this.presenceStatuses[i], this.presenceElementIds[i]);
                 	    }
//                  	  
//                  	    for (var i = 0; presences.length > i; i++)
//              	    	{
//                  	    	var presence = presences[i];
//                  	    	var index = this.presenceUris.indexOf(presence.username);
//                  	    	this.presenceStatuses[index] = presence.status;
//                  	    	this.OnStatusChange(presence.username, presence.status, this.presenceElementIds[index]);
//              	    	}
                    }
                    this.requestingPresence = false;
                 },
                 scope: this
              	 
              }
              //successMessage: this.msg("message.create-content-by-template-node.success", sourcePath),
              //failureMessage: this.msg("message.create-content-by-template-node.failure", sourcePath)
           });
	   };
 
   };
   
   
   RPLP.PresenceSimulator.prototype.ShowOOUI = function (bstrName, inputType, xLeft, yTop) {
	   this.HideOOUI();
	   
	   var status = this.getStatus(bstrName);
	   
	   var OOUItext = "<img src=\"" + RPLP.Presence.prototype.getStatusImg(status) 
	   		+ "\" alt=\"" + RPLP.Presence.prototype.getStatusText(status) +"\">&nbsp;" + RPLP.Presence.prototype.getStatusText(status);

	   var prompt = new YAHOO.widget.SimpleDialog("message",
               {
                  close: false,
                  constraintoviewport: false,
                  draggable: true,
                  effect: null,
                  modal: false,
                  visible: false,
                  zIndex: 100,
                  noEscape: true,
                  x: xLeft,
                  y: yTop + 1
               });
	   	this.OOUI = prompt;
	   	
         // Show the prompt text
         prompt.setBody(OOUItext);

         // Add the dialog to the dom, center it and show it.
         prompt.render(document.body);
         //prompt.center();
         Dom.get("message_h").style.display = 'none';
         prompt.show();
         
   };
   
   RPLP.PresenceSimulator.prototype.HideOOUI = function () {
	   if (null != this.OOUI) {
		   this.OOUI.destroy();
		   this.OOUI = null;
	   }
   };
   RPLP.PresenceSimulator.prototype.DoAccelerator = function () {
	   alert("RPLP.PresenceSimulator.prototype.DoAccelerator()");
   };
   
	  
})();
