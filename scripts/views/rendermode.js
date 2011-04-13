(function(){
	var RenderModeView = Backbone.View.extend({
		el: $('header a.view'),
		
		events: {
			'click': 'changeRendering'
		},
		
		initialize: function(){
			_.bindAll(this, 'changeRendering');
		},
		
		// events
		
		changeRendering: function( event ){
			$(event.target).toggleClass('view-list view-group');
			event.preventDefault();
			
			this.collection.renderMode = this.collection.renderMode === 'default' ?
			    'alpha' :
			    'default';
			
			// re-render and re-filter
			this.collection.fetch({
			    success: function(){
                    app.filterView.el.find('input').trigger('keyup');
                 }
			});
		}
		
	});
	
	app.renderModeView = new RenderModeView({
		collection: app.contactList
	});
})();
