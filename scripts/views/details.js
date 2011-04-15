/**
 * contact item detail view
 * inited with model 'contact'
 */
app.DetailsView = Backbone.View.extend({
	
	tagName: 'tr',
	className: 'details',
	
	events: {
		'click .save': 'save',
		'click .edit': 'edit',
		'click .destroy': 'destroy',
		'click .cancel': 'exitEditMode',
		'click .tab a': 'changeTab',
		'keypress': 'saveOnEnter',
		'keyup': 'detectChanges'
	},
	
	template: _.template( $('#tmpl-details').html() ),
	
	rendered: false,
	inEditMode: false,
	modified: false,
	isOpen: false,
	
	initialize: function(){
		_.bindAll(this, 'destroy', 'save', 'saveOnEnter', 'changeRender', 'changeTab', 'remove', 'edit', 'destroy', 'detectChanges','close', 'closeOnEsc', 'exitEditMode');
		this.model.bind('change', this.changeRender);
	},
	
	open: function( render ){
		if( render ){
			this.render();
		} else {
			$(this.el).show();
		}
		
		this.isOpen = true;
	},
	
	toggle: function(){
		var el = $(this.el);
		
		// if this thing is already open, close it
		if( $(this.el).is(':visible') ){
			this.close();
		}
		
		// if this view hasn't been rendered yet, do so.
		else if( !this.rendered ){
			this.open( true );
		}
		
		// otherwise open the row.
		else {
			this.open();
		}
	},
	
	render: function(){
		(this._renderHTML()).insertAfter( this.model.view.el );
		this.rendered = true;
	},
	
	editMode: function(){
		this.$(':input').show();
		this.$('footer').show();
		this.$('span, p').hide();
		this.$('.edit').hide();
		this.inEditMode = true;
	},
	
	serialize: function(){
		return {
			firstname: this.$('[name="firstname"]').val(),
			lastname: this.$('[name="lastname"]').val(),
			email: this.$('[name="email"]').val(),
			phone: this.$('[name="phone"]').val(),
			company: this.$('[name="company"]').val(),
			address: this.$('[name="address"]').val(),
			city: this.$('[name="city"]').val(),
			state: this.$('[name="state"]').val(),
			zip: this.$('[name="zip"]').val(),
			notes: this.$('[name="notes"]').val()
		}
	},
	
	close: function(){
		if( this.rendered && this.exitEditMode() ){
			
			// remove the active class from the previous row
			this.options.prevRow.deactivate();
			
			// hide this row
			$(this.el).hide();
			
			this.isOpen = false;
		}
	},
	
	// methods & events
	
	exitEditMode: function( event ){
		if( !this.inEditMode ){
			return true;
		}
		
		event && event.preventDefault();
		
		if( this.modified ){
			if( !confirm('You\'ve made some changes but haven\'t saved them yet.\n\nContinue without saving?') ){
				return false;
			}
		}
		
		this.$(':input').hide();
		this.$('span, p').show();
		this.$('footer').hide();
		this.$('.edit').show();
		this.modified = false;
		this.inEditMode = false;
		
		return true;
	},
	
	// events
	
	save: function( event ){
		event && event.preventDefault();
		this.model.save(this.serialize());
		this.modified = false;
		this.exitEditMode();
	},
	
	saveOnEnter: function( event ){
		event.which === 13 && this.save();
	},
	
	// only re-render if the last name didn't change.  if the last name changes,
	// the entire thing is rebuilt.
	changeRender: function( model ){
		if( !model.hasChanged('lastname') ){
			this._renderHTML();
		}
	},
	
	edit: function( event ){
		event.preventDefault();
		event.stopImmediatePropagation();
		this.editMode();
	},
	
	detectChanges: function(){
		this.modified = true;
	},
	
	changeTab: function( event ){
		event.preventDefault();
		this.$('.panel').hide();
		this.$('.tab').removeClass('active');
		$(event.target.parentNode).addClass('active');
		$(event.target.hash).show();
	},
	
	destroy: function( event ){
		event.preventDefault();
		event.stopImmediatePropagation();
		
		if(confirm('Delete this contact?')){
			this.model.clear();
			$(this.el).remove();
		}
	},
	
	// utils
	
	_renderHTML: function(){
		return $(this.el).html( this.template(this.model.toJSON()) );
	}
});
