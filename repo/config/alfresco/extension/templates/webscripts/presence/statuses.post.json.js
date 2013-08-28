function main()
{
	var PRES_STATUS = "pres:status";
	var PRES_LASTSTATUS = "pres:lastStatus";
	var PRES_UPDATETIME = "pres:updateTime";
	var ARG_MYSTATUS = "myStatus";
	var ARG_PRESENCES = "presences";
	
	// search all statuses for provided usernames
	var presencesReq = json.get(ARG_PRESENCES);
    if (presencesReq == null || presencesReq.length === 0)
    {
       status.setCode(status.STATUS_BAD_REQUEST, "Mandatory '" + ARG_PRESENCES + "' parameter missing.");
       return;
    }
    var presences = [];
    var current = ("" + person.properties.userName);
    for (var i = 0; presencesReq.length() > i; i++)
    {
    	var other = null;
    	var otherName = presencesReq.get(i);
    	if (current == otherName) {
    		other = person;
    	} else {
    		other = people.getPerson(otherName);
    		if (!other.hasAspect("pres:userPresence")) {
    			other = null;
    		}
    	}
    	
    	if (null != other) {
	    	presences.push(
		    	{
		    		username : otherName,
		    		status   : other.properties[PRES_STATUS]
		    	}		
	    	);
    	}
    }
    
	// save in model
    model.presences = presences;
}

main();