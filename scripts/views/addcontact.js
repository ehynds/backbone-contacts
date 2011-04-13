/**
 * View: add contact link 
 * View: add contact dialog popup
 */
(function(){
	
    var dialog = $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        width: 720,
        height: 425,
        title: 'Add Contact',
        buttons: [
            {
                text: 'Cancel',
                id: 'close',
                click: function(){
                    $(this).dialog('close');
                }
            },
            {
                text: 'Save',
                id: 'save',
                click: $.noop // view takes over
            }
        ]
    });

	
	// Add contact dialog
	app.DialogView = Backbone.View.extend({
		el: $('.ui-dialog'),
		inputs: $(false),

		events: {
			'click #save': 'save',
			'keyup': 'saveOnEnter'
		},
		
		initialize: function(){
			_.bindAll(this, 'save', 'saveOnEnter', 'close');
			var self = this;
			
			// when a new contact is added (and therefore, validation passed)
			// close the open dialog.
			this.collection.bind('add', this.close);
			
			// save a reference to all the fields
			$.each(this.model.attributes, function( field ){
				self.inputs = self.inputs.add( self.$(':input[name="'+field+'"]') );
			});
		},
		
		open: function(){
			if( dialog.dialog('isOpen') ) return;
			
			this.inputs.val(''); // reset inputs
			this._resetValidation(); // clear any left over validation
			dialog.dialog('open'); // open dialog
		},
		
		close: function(){
			dialog.dialog('close');
		},
		
		render: function( data ){
			this.inputs.each(function(){
				this.value = data[ this.name ];
			});

			return this;
		},
		
		serialize: function(){
			var ret = {};
			
			this.inputs.each(function( i, input ){
				ret[ input.name ] = input.value;
			});

			return ret;
		},
		
		// events
		
		saveOnEnter: function( event ){
			event.preventDefault();
			event.which === 13 && this.save();
		},
		
		// delegate either creating a new contact to
		// the collection, or saving the existing model
		// passed in.
		save: function( event ){
			var self = this;
			
			this.collection.create(this.serialize(), {
				error: function( model, inputs ){
					self._resetValidation();

					$.each(inputs, function( i, input ){
						self._getSet( input ).addClass('error');
					});

					// not sure why backbone saves the model before validating it.
					model.destroy();
				},
				success: function(){
					self._resetValidation();
				}
			});
		},

		// utility methods
		
		_getSet: function( name ){
			var ret = name ? this.inputs.filter(function(){
				return this.name === name;
			}) : this.inputs;

			return ret.prev().andSelf();
		},

		_resetValidation: function(){
			this._getSet().removeClass('error');
		}
	});
	

    // "Add a Contact" button view
	var AddContactView = Backbone.View.extend({
		el: $('#add-contact'),

		events: {
			'click': 'add'
		},
		
		initialize: function(){
			_.bindAll(this, 'add');
			
			// create a reusable dialog instance
			this.dialog = new app.DialogView({
				collection: app.contactList,
				model: this.model
			});
		},
		
		add: function( event ){
			event.preventDefault();
			this.dialog.open();
		}
	});
	
	app.addContactView = new AddContactView({
		model: new app.Contact
	});
})();
