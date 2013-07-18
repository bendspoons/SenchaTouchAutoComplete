/**
* StbApp.AutocompleteField
* Autocomplete Model für das durchsuchen des Telefonbuchs für schnelles ausfüllen des Formulkars (Vorschläge)
*/
Ext.define('StbApp.src.ContactAutocompleteField', {
	extend: 'Ext.field.Text',
	xtype: 'autocompletefield',
	config: {
		component: {
			xtype: 'input',
			type: 'text'
		}
	},

	/**
	* @property {String} currentSelectedValue Textfield Inhalt Name, je nachdem aus dem internen Model "Cache" oder aus Textfeld
	*/
	currentSelectedValue: null,
	
	/**
	* @property {String} currentShownValue
	*/
	currentShownValue: '',
	
	/**
	* @property {Boolean} isSelectedItem
	*/
	isSelectedItem: false,

	/**
	* @property {setValue}
	*/
	setValue: function(newShownValue, newSelectedValue) {
		this.currentShownValue = newShownValue;
		this.getComponent().setValue(newShownValue);
		this.currentSelectedValue = newSelectedValue;
	},

	/**
	* @property 
	* @return {String} 
	*/
	getValue: function(getShownValue) {
		return (getShownValue || !this.isSelectedItem ? this.getComponent().getValue() : this.currentSelectedValue);
	},

	/**
	* @property {initialize}
	*/
	initialize: function() {
		var that = this;

		var blurTimeout = false;
		var searchTimeout = false;
		var emailWasEmptyOnLoad = false;
		var phoneWasEmptyOnLoad = false;

		var doSearchWithTimeout = function() {
			if (blurTimeout) clearTimeout(blurTimeout);
			if (searchTimeout) clearTimeout(searchTimeout);

			if (that.isSelectedItem || that.getComponent().getValue() == '') return;

			searchTimeout = setTimeout(function() {
				if(that.getValue().length > 3) {
	            	var searchValue = that.getValue().trim();
	            	console.log('Suche Kontakt anhand "' + searchValue + '"');
	            	
			        var options = new ContactFindOptions();
			        options.filter = searchValue; 
			        options.multiple = true;
			        
			        var fields = ["displayName", "name", "emails", "phoneNumbers"];
			        
			        var foundContacts = [];
			        
			        navigator.contacts.find(fields, function(gatheredContacts) { // success			        	
				        if(gatheredContacts.length > 0) {
				        	var firstFoundContact = gatheredContacts[0];
				        	
				        	log('firstFoundContact');
				        	log(firstFoundContact);
				        	
				        	if(StbApp.app.getController('Settings').getFormPhoneField().getValue().toString().length == 0 || phoneWasEmptyOnLoad == true) {
				        		if(firstFoundContact.phoneNumbers != null) {
									StbApp.app.getController('Settings').getFormPhoneField().setValue(firstFoundContact.phoneNumbers[0].value.onlyNumbers().strip_tags().trim());
				        		} else {
									StbApp.app.getController('Settings').getFormPhoneField().setValue('');
				        		}
				        	}
				        	if(StbApp.app.getController('Settings').getFormEmailField().getValue().length == 0 || emailWasEmptyOnLoad == true) {
				        		if(firstFoundContact.emails != null) {
									StbApp.app.getController('Settings').getFormEmailField().setValue(firstFoundContact.emails[0].value.strip_tags().trim());
				        		} else {
									StbApp.app.getController('Settings').getFormEmailField().setValue('');
				        		}
				        	}
				        }
			        }, function(error) {
			        	log(error);
			        }, options);
				}
			}, 300);
		};

		this.getComponent().on('keyup', function() {
			doSearchWithTimeout();
		});

		this.getComponent().on('blur', function(event) {
			if (searchTimeout) clearTimeout(searchTimeout);
		});

		this.getComponent().on('focus', function(event) {
	    	if(StbApp.app.getController('Settings').getFormEmailField().getValue().length == 0) {
				log('checkonload emailWasEmptyOnLoad = true');
				emailWasEmptyOnLoad = true;
	    	}
	    	if(StbApp.app.getController('Settings').getFormPhoneField().getValue().toString().length <= 1) {
				log('checkonload phoneWasEmptyOnLoad = true');
				phoneWasEmptyOnLoad = true;
	    	}
		});

	}

});