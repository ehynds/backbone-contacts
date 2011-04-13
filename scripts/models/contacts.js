/**
 * Model: contact
 */
app.Contact = Backbone.Model.extend({
	defaults: {
		firstname: '',
		lastname: '',
		phone: '',
		email: '',
		company: '',
		address: '',
		city: '',
		state: '',
		zip: '',
		notes: '',
		id: 0
	},
	
	// returns an array of invalid fields
	validate: function( attrs ){
		var errors = [];
		
		if( !$.trim(attrs.firstname).length ) errors.push('firstname');
		if( !$.trim(attrs.lastname).length ) errors.push('lastname');
		
		if( errors.length ){
			return errors;
		}
	},
	
	clear: function(){
		this.destroy();
		this.view.remove();
	}
});
