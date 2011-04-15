/**
 * View: contact item (tr)
 */
(function(){

	app.ContactView = Backbone.View.extend({
		tagName: 'tr',
		className: 'contact',
		
		events: {
			'click': 'activate'
		},
		
		template: _.template($('#tmpl-contact').html()),
		
		initialize: function(){
			_.bindAll(this, 'render', 'activate');
			
			// re-render this row when its model changes
			this.model.bind('change', this.render);
			
			// give the model the view. this way, the model can remove the associated view on destroy.
			this.model.view = this;
			
			// create a new details view
			this.details = new app.DetailsView({
				model: this.model,
				prevRow: this
			});
		},
		
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		
		show: function(){
			$(this.el).show();
		},
		
		hide: function(){
			$(this.el).hide();
		},
		
		deactivate: function(){
			$(this.el).removeClass('active');
		},
		
		
		// events
		
		
		activate: function(){
			var el = this.el,
				collection = app.contactsCollection;
			
			// find the open contact
			var openContact = collection.detect(function(contact){
				return contact.view.el !== el && contact.view.details.isOpen;
			});
			
			// if one was found, attempt to close it.  if the return
			// value is false, changes had been made and the user
			// decided to cancel.
			if( openContact && openContact.view.details.close() === false ){
				return;
			}
			
			// toggle active class
			collection.each(function( contact ){
				var view = contact.view;
				
				// apply active class to the row
				$(view.el).toggleClass('active', el === view.el && $(view.details.el).is(':hidden:') );
				
				// toggle the details view
				if( el === view.el ){
					view.details.toggle();

					// remember this route
					app.controller.saveLocation('view/' + contact.id);
				}
			});
		}
	});


	/**
	 * Collection: contacts
	 */
	app.ContactsCollection = Backbone.Collection.extend({
		model: app.Contact,
		localStorage: new Store('contacts'),
		renderMode: 'default',
		comparator: function( contact ){
			return contact.get('lastname').toLowerCase();
		}
	});

})();
