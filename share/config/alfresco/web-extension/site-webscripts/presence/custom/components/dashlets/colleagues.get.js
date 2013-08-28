var memberships = model.memberships;

for (var i = 0; memberships.length > i; i++ ) {
	var membership = memberships[i];
	var profile = user.getUser(membership.authority.userName)
	membership.email = profile.email;
	membership.current = user.name == membership.authority.userName;
	
}
   var presence = {
      id: "Presence", 
      name: "RPLP.Presence",
      options: {
         memberships: memberships
      }
   };
   model.widgets.push(presence);
