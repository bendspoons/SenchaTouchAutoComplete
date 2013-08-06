/**
 *!
 * AutocompleteField v1.0
 * https://github.com/bendspoons/SenchaTouchAutoComplete
 * http://blog.bendspoons.com
 *
 * Copyright 2013, Dominic Roesmann
 *
 * This library is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Makes a textfield capable of autocompletion. Two Display options: inline and overlay
 *
 */

Ext.define('Ext.AutocompleteField', {
	extend: 'Ext.field.Text',
	xtype: 'autocompletefield',
	config: {
		component: {
			xtype: 'input',
			type: 'text'
		},
		defaults: {
			resultsDisplayMode : 'overlay',	
			resultsDisplayQMinLength : 3,	
			resultsDisplayItemTpl : '{city}',	
			resultsDisplayEmptyText : 'No results',	
			resultsDisplayLoadingText : 'Searching...',
			resultsDisplayOverlayZIndex : 50,	
			resultsDisplayOverlayResultsHeight : 250,	
			resultsDisplayOverlayZIndex : 50,
			resultsDisplayOverlayWidth : '90%',
			resultsDisplayOverlayHeight : '90%',	
			resultsDisplayOverlayInputPlaceHolder : 'Geben Sie hier den Städtenamen ein',
			resultsDisplayInlineResultsHeight : 250,
			autoCompleteRequests: [
				'remote',
				'local',
				'store',
				'data',
				'contacts'
			],
			logging : true	
		}
	},

	initialize: function() {
		var me = this;	

		if (!me.config.config.resultsDisplay.mode) 			me.triggerConsole('resultsDisplay.mode not set. Switching to default ' + me.getDefaults().resultsDisplayMode, 'error');
		if (!me.config.config.resultsDisplay.mode) 			me.config.config.resultsDisplay.mode 				=  me.getDefaults().resultsDisplayMode;
		
		if (!me.config.config.resultsDisplay.qMinLength) 	me.triggerConsole('resultsDisplay.qMinLength not set. Switching to default ' +  me.getDefaults().resultsDisplayQMinLength, 'warn');
		if (!me.config.config.resultsDisplay.qMinLength) 	me.config.config.resultsDisplay.qMinLength 			= 3;
		
		if (!me.config.config.resultsDisplay.itemTpl) 		me.triggerConsole('resultsDisplay.itemTpl not set. Switching to default ' +  me.getDefaults().resultsDisplayItemTpl, 'warn');
		if (!me.config.config.resultsDisplay.itemTpl) 		me.config.config.resultsDisplay.itemTpl 			=  me.getDefaults().resultsDisplayItemTpl;
		
		if (!me.config.config.resultsDisplay.emptyText) 	me.triggerConsole('resultsDisplay.emptyText not set. Switching to default ' +  me.getDefaults().resultsDisplayEmptyText);
		if (!me.config.config.resultsDisplay.emptyText) 	me.config.config.resultsDisplay.emptyText 			=  me.getDefaults().resultsDisplayEmptyText;
		
		if (!me.config.config.resultsDisplay.loadingText) 	me.triggerConsole('resultsDisplay.loadingText not set. Switching to default ' +  me.getDefaults().resultsDisplayLoadingText);
		if (!me.config.config.resultsDisplay.loadingText) 	me.config.config.resultsDisplay.loadingText 		=  me.getDefaults().resultsDisplayLoadingText;
		
		if(me.config.config.resultsDisplay.mode == 'overlay') {			
			if (!me.config.config.resultsDisplay.overlayConfig) me.triggerConsole('resultsDisplay.overlayConfig not set.', 'warn');
			if (!me.config.config.resultsDisplay.overlayConfig) me.config.config.resultsDisplay.overlayConfig 				=  {};		

			if (me.config.config.resultsDisplay.overlayConfig.zIndex < 2) 					throw new Error('overlayConfig.zIndex < 2 doesnt work.Set at least to 2');
			if (!me.config.config.resultsDisplay.overlayConfig.zIndex) 						me.triggerConsole('resultsDisplay.overlayConfig.zIndex not set. Switching to default ' +  me.getDefaults().resultsDisplayOverlayZIndex);
			if (!me.config.config.resultsDisplay.overlayConfig.zIndex) 						me.config.config.resultsDisplay.overlayConfig.zIndex 			=  me.getDefaults().resultsDisplayOverlayZIndex;
			
			if (!me.config.config.resultsDisplay.overlayConfig.inputPlaceHolder) 			me.triggerConsole('resultsDisplay.overlayConfig.inputPlaceHolder not set. Switching to default ' +  me.getDefaults().resultsDisplayOverlayInputPlaceHolder);
			if (!me.config.config.resultsDisplay.overlayConfig.inputPlaceHolder) 			me.config.config.resultsDisplay.overlayConfig.inputPlaceHolder 	=  me.getDefaults().resultsDisplayOverlayInputPlaceHolder;
			
			if (!me.config.config.resultsDisplay.overlayConfig.width) 						me.triggerConsole('resultsDisplay.overlayConfig.width not set. Switching to default ' +  me.getDefaults().resultsDisplayOverlayWidth, 'warn');
			if (!me.config.config.resultsDisplay.overlayConfig.width) 						me.config.config.resultsDisplay.overlayConfig.width 			=  me.getDefaults().resultsDisplayOverlayWidth;
			
			if (!me.config.config.resultsDisplay.overlayConfig.height) 						me.triggerConsole('resultsDisplay.overlayConfig.height not set. Switching to default ' +  me.getDefaults().resultsDisplayOverlayHeight, 'warn');
			if (!me.config.config.resultsDisplay.overlayConfig.height) 						me.config.config.resultsDisplay.overlayConfig.height 			=  me.getDefaults().resultsDisplayOverlayHeight;
		} else if(me.config.config.resultsDisplay.mode == 'inline') {	
			if (!me.config.config.resultsDisplay.inlineConfig) 	me.triggerConsole('resultsDisplay.inlineConfig not set.', 'warn');
			if (!me.config.config.resultsDisplay.inlineConfig) 	me.config.config.resultsDisplay.inlineConfig 				=  {};
				
			if (me.stristr(me.config.config.resultsDisplay.inlineConfig.resultsHeight, '%')) 	throw new Error('Unexpected error... resultsDisplay.inlineConfig.resultsHeight cannot be set in percent.PLease use px instead');
			if (!isNaN(me.config.config.resultsDisplay.inlineConfig.resultsHeight)) 		me.triggerConsole('resultsDisplay.inlineConfig.resultsHeight is not an integer. Switching to default ' +  me.getDefaults().resultsDisplayInlineResultsHeight, 'warn');
			if (!isNaN(me.config.config.resultsDisplay.inlineConfig.resultsHeight)) 		me.config.config.resultsDisplay.inlineConfig.resultsHeight = parseInt(me.config.config.resultsDisplay.inlineConfig.resultsHeight);
			
			if (!me.config.config.resultsDisplay.inlineConfig.resultsHeight) 				me.triggerConsole('resultsDisplay.inlineConfig.resultsHeight not set. Switching to default ' +  me.getDefaults().resultsDisplayInlineResultsHeight);
			if (!me.config.config.resultsDisplay.inlineConfig.resultsHeight) 				me.config.config.resultsDisplay.inlineConfig.resultsHeight 		=  me.getDefaults().resultsDisplayInlineResultsHeight;
		} else {
			throw new Error('Unexpected error... resultsDisplay.mode not set as expected. Allowed: overlay, inline');
		}
			
		if (!me.config.config.autoCompleteRequest) 					throw new Error('autoCompleteRequest not configured!');
		if (!me.config.config.autoCompleteRequest.requestType) 		throw new Error('autoCompleteRequest method not configured!');
		if (!me.config.config.autoCompleteRequest.fields) 			throw new Error('AutoComplete Storefields are not configured');
				
		if (!Ext.ModelManager.getModel('AutocompleteResult')) {
			Ext.define('AutocompleteResult', {
				extend: 'Ext.data.Model',
				config: {
					fields: me.config.config.autoCompleteRequest.fields
				}
			});
		}

		this.resultsStore = Ext.create('Ext.data.Store', {
			model: 'AutocompleteResult',
			config: {
				autoLoad: false
			}
		});
		
		if(me.config.config.autoCompleteRequest.requestType == 'remote') {
			
			if (!me.config.config.autoCompleteRequest.proxy) throw new Error('AutoComplete local / remote proxy is not configured');
			
			me.config.config.autoCompleteRequest.proxy.type = 'jsonp';
			this.resultsStore.setProxy(me.config.config.autoCompleteRequest.proxy);
			
		} else if(me.config.config.autoCompleteRequest.requestType == 'local') {
			
			if (!me.config.config.autoCompleteRequest.proxy) throw new Error('AutoComplete local / remote proxy is not configured');
			if (!me.config.config.autoCompleteRequest.proxy.filterField) throw new Error('AutoComplete local filterField is not configured');
			
			me.config.config.autoCompleteRequest.proxy.type = 'ajax';
			this.resultsStore.setProxy(me.config.config.autoCompleteRequest.proxy);
						
			// filtern bei keypress
			
		} else if(me.config.config.autoCompleteRequest.requestType == 'data') {
			
			if (!me.config.config.autoCompleteRequest.data) throw new Error('AutoComplete data for data Method is not configured');
			
			this.resultsStore.setData(me.config.config.autoCompleteRequest.data);
			
		} else if(me.config.config.autoCompleteRequest.requestType == 'store') {
			
			if (!me.config.config.autoCompleteRequest.store) throw new Error('AutoComplete store for store Method is not configured');
			
		}

		
		
		if(me.config.config.resultsDisplay.mode == 'overlay') {
        	var autoCompleteOverlay = Ext.create('Ext.form.FieldSet', {
                layout				: 'vbox',
                styleHtmlContent	: true,
                hideOnMaskTap		: true,
                modal				: true,
                width				: me.config.config.resultsDisplay.overlayConfig.width,
                height				: me.config.config.resultsDisplay.overlayConfig.height,
				centered			: true,
				hidden				: true,
				zIndex				: me.config.config.resultsDisplay.overlayConfig.zIndex,
                items: [
					{
						xtype			: 'textfield',
						id 				: 'autoCompleteOverlayTextfield',
						value			: me.getComponent().getValue(),
						placeHolder		: me.config.config.resultsDisplay.overlayConfig.inputPlaceHolder
					},
					{
						xtype			: 'list',
						id				: 'autoCompleteOverlayList',
						flex			: 1,
						store			: me.resultsStore,
						loadingText		: me.config.config.resultsDisplay.loadingText,
						emptyText		: me.config.config.resultsDisplay.emptyText,
						itemTpl			: me.config.config.resultsDisplay.itemTpl
					}
                ]
            });
            Ext.Viewport.add(autoCompleteOverlay);
            
            this.resultsList = Ext.getCmp('autoCompleteOverlayList');
			
			var observerTextInputField = Ext.getCmp('autoCompleteOverlayTextfield');
			observerTextInputField.focus();
		} else {
			this.resultsList = Ext.create('Ext.List', {
				renderTo		: this.getComponent().element.dom,
				store			: me.resultsStore,
				loadingText		: me.config.config.resultsDisplay.loadingText,
				emptyText		: me.config.config.resultsDisplay.emptyText,
				itemTpl			: me.config.config.resultsDisplay.itemTpl
			});
			
			var observerTextInputField = this.getComponent();
		}
		
		var blurTimeout = false;
		var searchTimeout = false;

		var doSearchWithTimeout = function() {
			if (blurTimeout) clearTimeout(blurTimeout);
			if (searchTimeout) clearTimeout(searchTimeout);

			if (me.getComponent().getValue() == '') return;

			if(me.getValue(true).length >= me.config.config.resultsDisplay.qMinLength) {
				searchTimeout = setTimeout(function() {
					
					if(me.config.config.autoCompleteRequest.requestType == 'remote') {
						me.resultsStore.getProxy().setExtraParam(encodeURIComponent(me.config.config.autoCompleteRequest.proxy.paramField), encodeURIComponent(me.getValue(true)));
						me.resultsStore.load();
					} else if(me.config.config.autoCompleteRequest.requestType == 'local') {
						me.resultsStore.clearFilter();
						me.resultsStore.filter(me.config.config.autoCompleteRequest.proxy.filterField, encodeURIComponent(me.getValue(true)));
						console.log(me.resultsStore.getData());
						me.resultsStore.load();
					}
					
					if(me.config.config.resultsDisplay.mode == 'inline') {
						me.resultsList.setHeight(me.config.config.resultsDisplay.inlineConfig.resultsHeight);
					}
				}, 300);
			}
			
		};

		this.resultsList.on('itemtouchend', function() {
			if (blurTimeout) clearTimeout(blurTimeout);
		});

		this.resultsList.on('itemtap', function(self, index, target, record) {
			if (!me.config.config.itemTapCallback) 	me.triggerConsole('itemTapCallback not defined', 'warn');
			if (!me.config.config.itemTapCallback) 	me.config.config.itemTapCallback = function() {};
			
			me.config.config.itemTapCallback(record.getData());
		
			if(me.config.config.autoCompleteRequest.requestType == 'remote') {
				me.setValue(record.get(me.config.config.autoCompleteRequest.proxy.paramField));
				observerTextInputField.setValue(record.get(me.config.config.autoCompleteRequest.proxy.paramField));
			} else if(me.config.config.autoCompleteRequest.requestType == 'local') {
				me.setValue(record.get(me.config.config.autoCompleteRequest.proxy.filterField));
				observerTextInputField.setValue(record.get(me.config.config.autoCompleteRequest.proxy.filterField));
			}				

			
			if(me.config.config.resultsDisplay.mode == 'inline') {
				blurTimeout = setTimeout(function() {
					me.resultsList.setHeight(0);
				}, 500);
			} else if(me.config.config.resultsDisplay.mode == 'overlay') {
				blurTimeout = setTimeout(function() {
					autoCompleteOverlay.setHidden(true);
				}, 500);
			}
			
		});
		
		if(me.config.config.resultsDisplay.mode == 'overlay') {
			me.getComponent().on('focus', function() {
				autoCompleteOverlay.setHidden(false);
			});
		}
		
		observerTextInputField.on('keyup', function() {
			if(me.config.config.resultsDisplay.mode == 'overlay') {
				me.getComponent().setValue(observerTextInputField.getValue());
			}
			
			doSearchWithTimeout();
		});

		observerTextInputField.on('blur', function(event) {
			if (searchTimeout) clearTimeout(searchTimeout);

			if(me.config.config.resultsDisplay.mode == 'inline') {
				blurTimeout = setTimeout(function() {
					me.resultsList.setHeight(0);
				}, 500);
			}
		});

		observerTextInputField.on('clearicontap', function(event) {
			console.log('clearicontap');
			observerTextInputField.setValue('');
			me.getComponent().setValue('');

			if(me.config.config.resultsDisplay.mode == 'inline') {
				me.resultsList.setHeight(0);
			}
		});

	},
	
	triggerConsole: function(msg, level) {
		if(this.getDefaults().logging) {
			switch(level) {
				default:
				case 'info':
					console.log(msg);
				break;
				case 'warn':
					console.warn(msg);
				break;
				case 'error':
					console.error(msg);
				break;
			}
		}
	},
	
	stristr: function(haystack, needle, bool) {
		// http://kevin.vanzonneveld.net
		// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfxied by: Onno Marsman
		// *     example 1: stristr('Kevin van Zonneveld', 'Van');
		// *     returns 1: 'van Zonneveld'
		// *     example 2: stristr('Kevin van Zonneveld', 'VAN', true);
		// *     returns 2: 'Kevin '
		var pos = 0;
		
		haystack += '';
		pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
		if (pos == -1) {
			return false;
		} else {
			if (bool) {
				return haystack.substr(0, pos);
			} else {
				return haystack.slice(pos);
			}
		}
	}
});

String.prototype.replaceFormat = function () {
    var formatted = this;
    for (var prop in arguments[0]) {
        var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[0][prop]);
    }
    return formatted;
};


