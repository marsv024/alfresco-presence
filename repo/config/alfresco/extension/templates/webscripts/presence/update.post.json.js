

function main()
{
	var PRES_STATUS = "pres:status";
	var PRES_LASTSTATUS = "pres:lastStatus";
	var PRES_UPDATETIME = "pres:updateTime";
	var ARG_MYSTATUS = "myStatus";
	
	var status = json.get(ARG_MYSTATUS);
    if (status == null || status.length === 0)
    {
       status.setCode(status.STATUS_BAD_REQUEST, "Mandatory '" + ARG_MYSTATUS +"' parameter missing.");
       return;
    }
    if (!person.hasAspect("pres:userPresence"))
    	person.addAspect("pres:userPresence");
    
	// find user node in person
    //var personNode = search.findNode(person.nodeRef);
	// update move present-status to laststatus, status, time
	var lastStatus = person.properties[PRES_STATUS];
	if (lastStatus) {
		person.properties[PRES_LASTSTATUS] = lastStatus;
	}
	var updateTime = new Date().getTime();
	person.properties[PRES_UPDATETIME] = updateTime;
	person.properties[PRES_STATUS] = status;

	person.save();
	
	model.status = status;
	model.lastStatus = lastStatus;
	model.updateTime = updateTime;
}

main();