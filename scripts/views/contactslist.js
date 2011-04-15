/**
 * Table view
 */
(function(){

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
			
		},
		
		// once all the data has been loaded/created bind the add event.
		// otherwise, add will fire once for each record retreived & rendered.
		// fetch() will call refresh (already bound) and collection.create() 
		// will call render manually from the controller.
		ready: function(){
			this.collection.bind('add', this.render);
			this.collection.bind('add', this.activate);
		},

		// events
		
		render: function( model ){
			this.el.children().remove();
			this['render_' + this.collection.renderMode]();
		},
		
		render_default: function(){
			var el = this.el;
			
			this.collection.each(function( contact ){
				var view = new app.ContactView({ model:contact }),
					row = view.render().el;
				
				el.append( row );
			});
		},
		
		render_alpha: function(){
			var el = this.el,
				tmpl = _.template( $('#tmpl-orderby-letter').html() ),
				letter, header;

			this.collection.each(function( contact ){
				var view = new app.ContactView({ model:contact }),
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
	
})();
