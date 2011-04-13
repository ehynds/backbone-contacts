/**
 * Model: rendering mode
 */
(function(){
	var RenderMode = Backbone.Model.extend({
		defaults: {
			renderMode: 'default'
		}
	});
	
	var RenderModeCollection = Backbone.Collection.extend({
		model: RenderMode,
		localStorage: new Store('renderMode')
	});

	app.renderMode = new RenderModeCollection;
})();
