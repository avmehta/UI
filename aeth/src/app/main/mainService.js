(function () {
	
	'use strict';
	
	angular.module('actionEngine').factory('SiteFactory',
			
		function($http, $q, getURL) {
		
			/**
			 * Methods this service provides
			 */
			var siteFactory = {
				getActions : getActions,
				responseActionDetails : responseActionDetails,
				postActions : postActions,
				getOutgoingMailActions : getOutgoingMailActions,
				updateCourtCaseDetails : updateCourtCaseDetails,
				auditHistory : auditHistory

			};
				
			/**
			 * This method retrieves a list of transactions based on the URL provided
			 * This method returns http promise to the controller.
			 */
			function getActions(actionList) {
				
				return $http({
					url : getURL(actionList),
					method : "GET"
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}
			
			/**
			 * This method gets RespondActionDetails for incoming transaction.
			 * This method returns http promise to the controller.
			 */
			function responseActionDetails(incomingTransactionInput, responseActionURL) {
				
				return $http({
					url : getURL(responseActionURL+incomingTransactionInput),
					method : "GET",
					data : incomingTransactionInput
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}
			
			/**
			 * This method will process the appropriate transactions.
			 * This method returns http promise to the controller.
			 */
			function postActions(incomingTransactionInput, postActionURL) {
				
				return $http({
					url : getURL(postActionURL),
					method : "POST",
					data : incomingTransactionInput
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}

			/**
	         * This method get OutgoingMailingActions for given input.
	         * This method returns http promise to the controller.
	         */
			function getOutgoingMailActions(outgoingTransactionInput, outgoingActionURL) {
				
				return $http({
					url : getURL(outgoingActionURL+outgoingTransactionInput),
					method : "GET",
					data : outgoingTransactionInput
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}
			
			/**
	         * This method will update Court Case Details for given input.
	         * This method returns http promise to the controller.
	         */
			function updateCourtCaseDetails(outgoingTransactionInput, outgoingActionURL) {
				
				return $http({
					url : getURL(outgoingActionURL),
					method : "PUT",
					data : outgoingTransactionInput
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}
			
function auditHistory(responseActionURL) {
				
				return $http({
					url : getURL(responseActionURL),
					method : "GET"
				}).then(function(successResponse) {
					return successResponse.data;
				}, function(failureResponse) {
					return $q.reject(failureResponse.statusText);
				});
			}
			
			return siteFactory;
		});
})();
