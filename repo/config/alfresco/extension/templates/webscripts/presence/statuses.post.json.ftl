<#escape x as jsonUtils.encodeJSONString(x)>
{
   "success": <#if presences??>true<#else>false</#if>,
   "presences": [
   	  <#list presences as presence>
   	    {
   	    	"username" : "${presence.username}",
   	    	"status"   : "${presence.status}"
   	    }
         <#if presence_has_next>,</#if>
      </#list>
   ]
}
</#escape>