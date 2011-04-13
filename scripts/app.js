(function(){
	window.app = {};

	$LAB.setGlobalDefaults({
		AlwaysPreserveOrder:true,
		BasePath: 'scripts/'
	});

	$LAB
	.script('libs/jquery.min.js')
	.script('libs/jquery-ui.min.js')
	.script('libs/underscore.js')
	.script('libs/backbone.js')
	.script('libs/backbone.localstorage.js')
	.script('libs/faker.js')
	.script('models/contacts.js')
	.script('views/details.js')
	.script('views/contacts.js')
	.script('views/contactslist.js')
	.script('views/addcontact.js')
	.script('views/rendermode.js')
	.script('views/filter.js');

	// preload the grouped view icon
	var img = document.createElement('img');
	img.src = 'images/view-group.gif';

})();
