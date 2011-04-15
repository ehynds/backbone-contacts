(function(){
	app.FilterView = Backbone.View.extend({
		el: $('#search'),
		
		events: {
			'keyup input': 'search',
			'click a': 'clear'
		},
		
		template: _.template( $('#tmpl-filter-stats').html() ),
		timer: null,
		
		initialize: function(){
			_.bindAll(this, 'search', 'clear');
			this.input = this.el.find('input');
			this.stats = this.el.find('p');
		},
		
		showStats: function(){
			this.stats.slideDown('fast');
		},
		
		hideStats: function(){
			this.stats.slideUp('fast');
		},
		
		// events
		
		search: function search( event ){
			var self = this,
				term = event.target.value.toLowerCase(),
				headers = new $.fn.init;

			function search(){
				var matches = self.collection.filter(function(contact){
					var view = contact.view, header = view.header;

					// show or hide this row (and header, if there is one) based
					// on whether or not there's a length
					view[ term.length ? 'hide' : 'show' ]();
					header && header[ term.length ? 'hide' : 'show' ]();

					// hide details element
					view.details.close();

					// if the term matches, show the view.
					if( ~contact.get('firstname').toLowerCase().indexOf(term)
						|| ~contact.get('lastname').toLowerCase().indexOf(term)
						|| ~contact.get('email').toLowerCase().indexOf(term)
						|| ~contact.get('phone').toLowerCase().indexOf(term)
					){
						view.show();
						headers = headers.add( header );
						return true;
					}
					
					return false;
				});

				// show the headers associated with the found rows
				headers.length && headers.show();
				
				// update stat template
				if( term.length ){
					self.showStats();
					
					self.stats.html(
						self.template({
							total_records: self.collection.length,
							num_results: matches.length
						})
					);
				} else {
					self.hideStats();
				}
			}

			// if this function is called via the user typing,
			// debounce the execution for 150ms
			if( event.which ){
				clearTimeout(this.timer);
				this.timer = setTimeout(search, 150);
			
			// otherwise if this is being called programatically, perhaps
			// by changing rendering modes after a search or pressing "clear",
			// just execute the fn immediately.
			} else {
				search();
			}
		},
		
		clear: function( event ){
			this.input.val('').trigger('keyup');
			event.preventDefault();
		}
	});

})();
