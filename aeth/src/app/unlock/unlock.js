(function() {
	
	'use strict';
	
	angular
		.module('actionEngine')
		.controller('UnlockController',
				function($compile, $log, $window, SiteFactory, CONSTANTS) {
			
			var vm = this;
			
			vm.unlockForm = {};
			vm.applicationTransactionLog = {};
			
			// This function will clear the form
			vm.clear = function() {
				delete vm.applicationNumbers;
				delete vm.applicationTransactionLog;
				
				if (angular.isDefined(vm.unlockForm.errorFound)) {
					vm.unlockForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.unlockForm.successFound)) {
					vm.unlockForm.successFound = false;
				}
			};
			
			// This function will submit the application numbers to be unlocked
			vm.unlockApplications = function() {
				if (angular.isDefined(vm.applicationNumbers)) {
					var appNumberList = vm.applicationNumbers.split(/(?:,|\n| )+/);
					appNumberList = appNumberList.filter(Boolean);
	
					var lockedApplicationsInfo = {};
					lockedApplicationsInfo.unlockedApplicationList = [];
	//				lockedApplicationsInfo.unlockedApplicationList.
	//				var TransactionInput = {};
	
	//				lockedApplicationsInfo.unlockedApplicationList.
	//				TransactionInput.applicationNum = [];
	//				var 
					for (var i=0; i<appNumberList.length; i++) {
						var TransactionInput = {};
	//					lockedApplicationsInfo.unlockedApplicationList.
						TransactionInput.applicationNumber = appNumberList[i].trim();
						lockedApplicationsInfo.unlockedApplicationList.push(TransactionInput);
					}
	
					$log.log(lockedApplicationsInfo);
	
					SiteFactory.postActions(lockedApplicationsInfo, 'application-unlock')
					.then(
						function(response) {
							var applicationTransactionLogData = [];
							vm.clear();
							$log.log(response);
							for (var i = 0; i < response.transactionReturnList.length; i++) {
								applicationTransactionLogData[i] = response.transactionReturnList[i];
							
								if (response.transactionReturnList[i].reasonCode == '2') {
									applicationTransactionLogData[i].setClass = "success";
									applicationTransactionLogData[i].setIcon =  "fa fa-check";
								}
								
								if (response.transactionReturnList[i].reasonCode == '001') {
									applicationTransactionLogData[i].setClass = "danger";
									applicationTransactionLogData[i].setIcon =  "fa fa-times";
								}
								
								if (response.transactionReturnList[i].reasonCode == '002') {
									applicationTransactionLogData[i].setClass = "info";
									applicationTransactionLogData[i].setIcon =  "fa fa-exclamation";
								}
							}
							
							
							vm.applicationTransactionLog = applicationTransactionLogData;
							
	//						vm.applicationTransactionLog = response.transactionReturnList;
	
	//						if (response.transactionReturnList.length == '1') {
	//							
	//						} else {
	//							$log.log(response);
	//							vm.unlockForm.errorFound = true;
	//							vm.unlockForm.errorMsg = response.transactionReturnList[0].messageDesc;
	//						}
	
							
						},
						function(response) {
							$log.log("Error" + response);
						}
					);
				} else {
					vm.unlockForm.errorFound = true;
					vm.unlockForm.errorMsg = "Please enter at least one application number.";
				}
			}; // End unlockApplications
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.unlockApplications();
				}
			}; // End searchKeyEvent
			
		});

})();