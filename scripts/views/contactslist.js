/**
 * Table view
 */
(function(){
	var ContactView = app.ContactView;

	app.ContactsListView = Backbone.View.extend({
		el: $('#contacts tbody'),
		
		initialize: function(){
			_.bindAll(this, 'render', 'activate');
		    var collection = this.collection;
			
			collection.bind('refresh', this.render);
			collection.bind('remove', this.render);

			// re-sort the collection when the last name changes.
			collection.bind('change:lastname', function( contact ){
			    collection.sort();
				
				// re-open the contact that changed
				contact.view.activate();
			});

            // fetch data from local storage
            this.collection.fetch();
            
            // create some fake data if the store is empty
            if( !collection.length ){
                for(var i=0; i<20; i++){
                    collection.create({
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

                this.render();
            }

            // once all the data has been loaded/created bind the add event.
            // otherwise, add will fire once for each record retreived & rendered.
            // fetch() will call refresh (already bound) and collection.create() 
            // will call render manually.
			collection.bind('add', this.render);
			collection.bind('add', this.activate);
		},
		
		// events
		
		render: function( model ){
			this.el.children().remove();
			this['render_' + this.collection.renderMode]();
		},
		
		render_default: function(){
			var el = this.el;
			
			this.collection.each(function( contact ){
				var view = new ContactView({ model:contact }),
					row = view.render().el;
				
				el.append( row );
			});
		},
		
		render_alpha: function(){
			var el = this.el,
				tmpl = _.template( $('#tmpl-orderby-letter').html() ),
				letter, header;

			this.collection.each(function( contact ){
				var view = new ContactView({ model:contact }),
					row = view.render().el,
					thisletter = view.model.get('lastname').charAt(0).toLowerCase();

				if( letter !== thisletter ){
					header = $(tmpl({ letter:thisletter })).appendTo( el );
					letter = thisletter;
				}
				
				view.header = header;

				el.append( row );
			});
		},

        activate: function( contact ){
            contact.view.activate();
        }
		
	});
	
	// kick this view off
	app.contactsListView = new app.ContactsListView({
		collection: app.contactList
	});
	
})();
