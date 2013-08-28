/**
* Redpill Linpro root namespace.
* 
* @namespace Extras
*/
if (typeof RPLP == "undefined" || !RPLP)
{
   var RPLP = {};
}


/**
 * Presence client script
 * 
 * @namespace RPLP
 * @class RPLP.Presence
 */
(function()
{	

	function replaceAll(string, token, newtoken) {
	    if(token!=newtoken)
	    while(string.indexOf(token) > -1) {
	        string = string.replace(token, newtoken);
	    }
	    return string;
	}
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom;
   
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $links = Alfresco.util.activateLinks,
      $combine = Alfresco.util.combinePaths,
      $userProfile = Alfresco.util.userProfileLink,
      $siteURL = Alfresco.util.siteURL,
      $date = function $date(date, format) { return Alfresco.util.formatDate(Alfresco.util.fromISO8601(date), format); },
      $relTime = Alfresco.util.relativeTime,
      $isValueSet = Alfresco.util.isValueSet;
   
   var thisName = "RPLP.Presence";
   /**
    * Constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {RPLP.Presence} The new instance
    * @constructor
    */
   RPLP.Presence = function(htmlId)
   {
	   RPLP.Presence.superclass.constructor.call(this, thisName, htmlId);
      
      return this;
   };
      
   YAHOO.extend(RPLP.Presence, Alfresco.component.Base,
   {
       control: null,
       getPresenceUri: null,
       /*Status description:
        * http://office.microsoft.com/en-001/communicator-help/understanding-presence-and-member-status-and-instant-messaging-HA102215055.aspx
        * */
 	   statuses: [
	                  "Online", //0
	                  "Offline", //1
	                  "Away", //2
	                  "Busy", //3
	                  "Be right back", //4
	                  "On the phone", //5
	                  "Out to lunch", //6
	                  "UNKWOWN", //7
	                  "UNKWOWN", //8
	                  "Do not distrub", //9
	                  "Busy (Unknown)",  //10
	                  "Online (Out of Office)",  //11
	                  "Offline (Out of Office)", //12
	                  "away (Out of Office)", //13
	                  "Busy (Out of Office)", //14
	                  "Do not distrub (Out of Office)", //15
	                  "Idle", //16
	                  "Idle (Out of office)", //17
	                  "Blocked", //18
	                  "Idle-Busy", //19
	                  "Idle-Busy (Out of Office)"], //20
          statusImages: [
                  "available.gif", //0
                  "offline.gif", //1
                  "away.gif", //2
                  "busy.gif", //3
                  "away.gif", //4
                  "onphone.png", //5
                  "away.gif", //6
                  "unknown.gif", //7
                  "unknown.gif", //8
                  "dnd.gif", //9
                  "unknown.gif",  //10
                  "available.gif",  //11
                  "offline.gif", //12
                  "away.gif", //13
                  "busy-ooo.png", //14
                  "dnd-ooo.png", //15
                  "idle.png", //16
                  "idle.png", //17
                  "blocked.gif", //18
                  "busy-idle.gif", //19
                  "busy-idle.gif"], //20
       options:
       {
       //    control: null,
           
           memberships: []
        },
        getUsername: function Presence_getUsername(membership) {return membership.authority.userName;},
        getEmail: function Presence_getEmail(membership) {return membership.email;},
      onReady: function Presence_onReady(layer, args)
      {
    	  this.control = this.getControl();
    	  
    	  var memberships = this.options.memberships;
    	  // go through memberships and add presence to each
    	  for (var j = 0; j < memberships.length; j++)
          {
    		  var membership = memberships[j];
    		  var element = this.findUserAnchor(membership);
    		  if (null != element)
    			  this.addPresence(element, membership);
    		  
          }
      },
      getControl: function presence__getControl() {
    	  var control = this._getPresence();
    	  if (null == control) {
    		  //return;
    		  control = new RPLP.PresenceSimulator(this.getCurrentUsername(), false);
    		  
    		  this.setPresenceUri(this.getUsername);
    	  } else {
    		  
    		  this.setPresenceUri(this.getEmail);
    	  }
    	  
    	  control.OnStatusChange = RPLP.Presence.prototype.onStatusChange;
    	  return control;
      },
      
      findUserAnchor: function presence__findUserAnchor(membership) {
    	  //search HTML for site membership HTML
    	  var id = membership.authority.userName;
    	  var as = YAHOO.util.Selector.query('a[href^=/share/page/user/'+id+'/profile][class=theme-color-1]'); // selects just right profile link
    	  if (null != as && 1 == as.length) return as[0];
    	  
    	  //else alert("Not found '" + id + "' in findUserAnchor, length is " + (null != as ? as.length : 'null.lngth :(')); 
    	  
      },
      
      addPresence: function presence__addPresence(element, membership) {
    	  
    	// Observe status, and subscribe to status changes
    	  var presenceUri = this.getPresenceUri(membership);
    	  var elementId = membership.authority.userName;
    	  
    	  if (null != element) {
    		  var newnode = document.createElement('div');
    		  newnode.setAttribute("id", elementId);
    		  var newElemenet = YAHOO.util.Dom.insertBefore(newnode, element);
    		  newElemenet.innerHTML = this.getUserHtml(7, membership);
          }
    	  
    	  var status = this.control.GetStatus(presenceUri, elementId);
    	  this.onStatusChange(presenceUri, status, elementId);
      },
      
      setPresenceUri: function presence__setPresenceUri(fn) {
    	  //return membership.email;
    	  this.getPresenceUri = fn;
      },
      getMembership: function presence__getMembership(presenceUri) {
    	  var memberships = this.options.memberships;
    	  for (var i = 0; memberships.length > i; i++) {
    		  var membership = memberships[i];
    		  if (this.getPresenceUri(membership) == presenceUri)
    			  return membership;
    	  }
    	  return null;
      },
      getCurrentUsername: function presence__getgetCurrentUsername() {
    	  var memberships = this.options.memberships;
    	  for (var i = 0; memberships.length > i; i++) {
    		  var membership = memberships[i];
    		  if (membership.current)
    			  return membership.authority.userName;
    	  }
    	  return null;
      },
      onStatusChange: function presence__onStatusChange(name, status, id)
      {
    	  var presence = Alfresco.util.ComponentManager.findFirst(thisName);

        // This function is fired when the contacts presence status changes.
        // - this point could be used to store user statuses over time ... independent of presence tech, 
    	//   although this is only if share is 'running'
         var element = Dom.get(id);
         if (null != element) {
         	element.innerHTML = presence.getUserHtml(status, presence.getMembership(name));
         } //else alert("Not found '" + id + "' in onStatusChange");
      },
//    status: a code that describes a status.
      getStatusText: function presence__getStatusText(id)
      {
    	  return this.statuses[id];
        
      },
      getStatusImg: function presence__getStatusText(id)
      {
//    	  var statusText = this.getStatusText(id);
//    	  
//    	  if (null != statusText) {
//    		  return replaceAll(replaceAll(replaceAll(replaceAll(statusText," ", "_"),"\t", "_"),"(", "_"),")", "_") + ".gif";
//    	  }
          return "/share/res/presence/components/dashlets/" + this.statusImages[id];
      },
      getUserHtml: function presence__getUserHtml(status, membership) {
    	  return "<div onmouseover=\"RPLP.Presence.prototype.showPresencePopup('" + this.getPresenceUri(membership) + "',event)\" onmouseout=\"RPLP.Presence.prototype.hidePresencePopup()\"> " +
    	  		"<img src=\"" + this.getStatusImg(status) +"\" alt=\"" + this.getStatusText(status) +"\"></div>";
      },
      
      showPresencePopup: function presence__showPresencePopup(userName, event)
      {
    	  var presence = Alfresco.util.ComponentManager.findFirst(thisName);
  	    	if (!presence.control) {
  	    		return;
  	    	}
  	    	var target = event.target;
  	    	var rect = target.getBoundingClientRect();
  	    	//console.log(rect.top, rect.right, rect.bottom, rect.left);
//	    var eLeft = $(target).offset().left;
  	    	var x = rect.left;
  	    	
//	    var x = eLeft - $(window).scrollLeft();
  	    	var y  = rect.bottom;
//	    var eTop = $(target).offset().top;
//	    var y = eTop - $(window).scrollTop();
//  	    var x  = event.clientX;
//  	    var y = event.clientY;
  	      presence.control.ShowOOUI(userName, 0, x, y);
      },

      hidePresencePopup: function presence__hidePresencePopup()
      {
    	  var presence = Alfresco.util.ComponentManager.findFirst(thisName);
    	  if (!presence.control) {
  	        return;
  	    }
    	  presence.control.HideOOUI();
      },

      
    _getPresence: function presence__getPresence()
    {
    	var presenceControl = null;
    	if (window.ActiveXObject) presenceControl = this._getPresenceIE();
    	if (null == presenceControl) presenceControl = this._getPresenceObject();
    	return presenceControl;
    },
    
    /*
     * 
Name.NameCtrl.PresenceEnabled
If true, the NameCtrl.GetStatus Method method returns the presence of a user, and the handler function that the NameCtrl.OnStatusChange Property property specifies is called. If false, the GetStatus method returns 1 (offline) and the handler function is not called.

The PresenceEnabled property is false if the control is used on a page that is not on the intranet or on a trusted site, or if a supported version of an instant messaging program such as Windows Live Messenger is not running.
*/
    _getPresenceIE: function presence__getPresenceIE()
    {
    	var controlProgID = "Name.NameCtrl";
    	var activeXControl = this._getActiveXctrl([controlProgID + ".1", controlProgID, controlProgID + ".2", controlProgID + ".3"]);
    	if (null != activeXControl && activeXControl.PresenceEnabled) {
    		return activeXControl;
    	}
    	return null;
    },
    _getPresenceObject: function presence__getPresenceObject()
    {
    	var object = this._getObject("SharePointUcPlugin", ["application/x-sharepoint-uc"]);
    	if (null != object && object.PresenceEnabled) {
    		return object;
    	}
    	return null;
    },
    _getActiveXctrl: function presence___getActiveXctrl(controlProgIDs)
    {
       // Try each version of the SharePoint control in turn, newest first
    	for (var i = 0; i < controlProgIDs.length; i++) {
    		try
    	       {
    	          activeXControl = new ActiveXObject(controlProgIDs[i]);
    	          if (null != activeXControl)
    	        	  return activeXControl;
    	       }
    	       catch(e) { }
    	}
    	return null;
    },
    
    _getObject: function presence___getObject(id, mimetypes)
    {
       var pluginId = id;
       var plugin = document.getElementById(pluginId);
       if (plugin == null)
       {
          var pluginMimeType = null;
          for (var i = 0; i < mimetypes.length; i++) {
	          if (Alfresco.util.isBrowserPluginInstalled(mimetypes[i])) { //YAHOO.env.ua.webkit && 
	             pluginMimeType = mimetypes[i];
	             break;
	          }
          }
          if (null == pluginMimeType) return null; 
          
          var pluginNode = document.createElement("object");
          pluginNode.id = pluginId;
          pluginNode.type = pluginMimeType;
          pluginNode.width = 0;
          pluginNode.height = 0;
          pluginNode.style.setProperty("visibility", "hidden", "");
          document.body.appendChild(pluginNode);
          plugin = document.getElementById(pluginId);

       }
       
       return null;

    }
    

    
    });
  
})();
  



      