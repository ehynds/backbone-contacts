(function(){

	var Controller = Backbone.Controller.extend({
		routes: {
			"view/:id": "view"
		},

		initialize: function(){
			var contacts, listView;
			
			// create the contact collection
			contacts = app.contactsCollection = new app.ContactsCollection();
			
			// kick off some views
			app.filterView = new app.FilterView({ collection: contacts });
			listView = new app.ContactsListView({ collection: contacts });
			new app.AddContactView({ model: new app.Contact });
			new app.RenderModeView({ collection: contacts });

			// fetch data from local storage
			contacts.fetch();
			
			// create some fake data if the store is empty
			if( !contacts.length ){
				for(var i=0; i<20; i++){
					contacts.create({
						firstname: Faker.Name.firstName(),
						lastname: Faker.Name.lastName(),
						phone: Faker.PhoneNumber.phoneNumber(),
						email: Faker.Internet.email(),
						company: Faker.Company.companyName(),
						address: Faker.Address.streetAddress(true),
						city: Faker.Address.city(),
						state: Faker.Address.usState(),
						zip: Faker.Address.zipCode(),
						notes: Faker.Lorem.paragraphs()
					});
				}
				
				// once all data is in, render the table
				// and bind some more events on the model.
				listView.render();
				listView.ready();
			}
		},

		view: function( id ){
			var model = app.contactsCollection.get( id );
			model && model.view.activate();
		}
		
	});

	// start the app
	app.controller = new Controller();
	Backbone.history.start();

})();
