<@markup id="yui-extra" target="yui" action="after" >
   <#-- JavaScript Dependencies -->
   
   <@script type="text/javascript" src="${url.context}/res/presence/components/head/idle-timer.js"  group="template-common"/>
   <@script type="text/javascript" src="${url.context}/res/presence/components/head/polling-timer.js"  group="template-common"/>
   <@script type="text/javascript" src="${url.context}/res/presence/components/head/presence-updater.js"  group="presence"/>
	<@inlineScript group="presence">
		var presenceUpdater = new RPLP.PresenceUpdater();
	</@>
</@>

