(function() {
	'use strict';
	
	angular
		.module('actionEngine', ['ngTable', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ngRoute', 'ui.bootstrap', 'toastr', 'angular-toArrayFilter'])
		.factory('context', function($location) {
			
			var host = $location.host();
			
			switch(host) {
			
			case 'localhost':
				return 'http://localhost:8080/ActionEngineServices/action-engine-services/';
			case 'opsg.sit.uspto.gov':
				return 'http://opsg.sit.uspto.gov/ActionEngineServices/action-engine-services/';
			case 'opsg.fqt.uspto.gov':
				return 'http://opsg.fqt.uspto.gov/ActionEngineServices/action-engine-services/';
			case 'opsg-services-eap-1.dev.uspto.gov':
				return 'http://opsg-services-eap-1.dev.uspto.gov:8080/ActionEngineServices/action-engine-services/';
			default:
				alert('Backend service not registered for this URL');
				throw new Error('Backend service not initialized');
			}
		})
		.factory('getURL', function(context) {
			return function(url) {
				return context + url;
			};

		});
	
})();