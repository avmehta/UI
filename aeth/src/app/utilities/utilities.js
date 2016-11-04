(function() {

	'use strict';

	angular
		.module('actionEngine')
		.factory('CommonUtils', function($filter, CONSTANTS) {

		/**
		 * Common utilities this service provides
		 */
		var commonUtils = {
			convertDateFormat : convertDateFormat,
			getCurrentDate : getCurrentDate,
			setNotification : setNotification,
			checkPositiveStatus : checkPositiveStatus,
			checkSuccess : checkSuccess
		};

		// Converts the date format
		function convertDateFormat(inputDate) {
			var formattedDate = new Date(inputDate);
			formattedDate = $filter('date')(formattedDate, 'MM/dd/yyyy');
			return formattedDate;
		}
		
		// Retrieves the current date
		function getCurrentDate() {
			var currentDate = new Date();
			currentDate = $filter('date')(currentDate, "MM/dd/yyyy");
			return currentDate;
		}
		
		// Sets the notifications
		function setNotification(response) {
			var notification = {};
			
			switch (response.errorCode) {
			case CONSTANTS.ERROR_CD_SUCCESS:
				notification.notice = 'success';
				break;
			case CONSTANTS.ERROR_CD_WARNING:
				notification.notice = 'warning';
				break;
			default:
				notification.notice = 'danger';
			}
			
			notification.showNotice = true;
			notification.noticeMsg = response.messageDesc;
			
			return notification;

		}
		
		// Check error code for success or warning
		function checkPositiveStatus(response) {
			return (response.errorCode === CONSTANTS.ERROR_CD_SUCCESS || response.errorCode === CONSTANTS.ERROR_CD_WARNING) ? true : false;
		}
		
		// Check error code for success
		function checkSuccess(response) {
			return (response.errorCode === CONSTANTS.ERROR_CD_SUCCESS) ? true : false;
		}
		
		return commonUtils;

	});
})();
