(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('DispatchController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;
			vm.dispatchForm = {};
			var outgoingDispatchRecieve = {};
			var url;
			
			//This function will clear all the fields on the form
			vm.clear = function() {
				vm.dispatchForm = "";
				outgoingDispatchRecieve = {};
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
								
			}; // End clear
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.getCurrentEmployee();
				}
			}; // End searchKeyEvent
			
			// This function will get the current employee information
			vm.getCurrentEmployee = function() {
				vm.isLoading = true;
				NProgress.start();
				SiteFactory.getActions('actions/dr/current-employee/' + vm.dispatchForm.searchEmployeeNumber)
				.then(
					function(response) {
						
						if (CommonUtils.checkSuccess(response)) {
							$log.log(response);
							vm.dispatchForm.currentEmployee = response.currentEmployee;
							$log.log(vm.dispatchForm.currentEmployee);
							vm.dispatchForm.currentLocation = vm.dispatchForm.currentEmployee.primaryLocation.building + " / " + vm.dispatchForm.currentEmployee.primaryLocation.floor + " / " + vm.dispatchForm.currentEmployee.primaryLocation.corridor + " " + vm.dispatchForm.currentEmployee.primaryLocation.room;
						}
						NProgress.done();
						vm.isLoading = false;
						vm.notification = CommonUtils.setNotification(response);
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			}; // End getCurrentEmployee
					
			
			// This function will get a list of PCT actions
			vm.getPCTActionList = function() {
				SiteFactory.getActions('actions/dr/pct-actions')
				.then(
					function(response) {
						$log.log(response);
						vm.pctActionList = response.standardActionList;
						$log.log("PCT Action List:");
						$log.log(vm.pctActionList);
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			}; // End getPCTActionList
			
			vm.getPCTActionList();
			
			// This function will get a list of general actions
			vm.getGeneralActionList = function() {
				SiteFactory.getActions('actions/dr/general-actions')
				.then(
					function(response) {
						$log.log(response);
						vm.generalActionList = response.standardActionList;
						$log.log("General Action List:");
						$log.log(vm.generalActionList);
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			}; // End getGeneralActionList
			
			vm.getGeneralActionList();
			
			//This will set the dispatch to location object
			vm.setDispatchToLocation = function() {
				outgoingDispatchRecieve.transactionNumber = "1034";
				outgoingDispatchRecieve.dispatchEmployee = {};
				outgoingDispatchRecieve.dispatchEmployee.palmLocation = vm.dispatchForm.dispatchPalmLocation;
				url = 'actions/dr/location';
				postDR(url);
				
			}; // End setDispatchToLocation
			
			//This will set the dispatch to employee object
			vm.setDispatchToEmployee = function() {
				outgoingDispatchRecieve.transactionNumber = "1036";
				outgoingDispatchRecieve.dispatchEmployee = {};
				outgoingDispatchRecieve.dispatchEmployee.worker = {};
				outgoingDispatchRecieve.dispatchEmployee.worker.empNo = vm.dispatchForm.dispatchEmployee;
				url = 'actions/dr/employee';
				postDR(url);
				
			}; // End setDispatchToEmployee
			
			//This will set the dispatch PCT to GAU object
			vm.setPctToGau = function() {
				outgoingDispatchRecieve.dispatchEmployee = {};
				outgoingDispatchRecieve.dispatchEmployee.palmLocation = vm.dispatchForm.dispatchPalmLocation;
				outgoingDispatchRecieve.postingTransaction = vm.dispatchForm.selectedTransaction.contentEventCd;
				url = 'actions/dr/pct-gau';
				postDR(url);
				
			}; // End setPctToGau
			
			//This will set the receive object
			vm.setReceive = function() {
				outgoingDispatchRecieve.transactionNumber = "1020";
				url = 'actions/dr/receive';
				postDR(url);
				
			}; // End setReceive
			
			//This will set the dispatch to box location object
			vm.setDispatchBoxToLocation = function() {
				outgoingDispatchRecieve.dispatchEmployee = {};
				outgoingDispatchRecieve.dispatchEmployee.palmLocation = vm.dispatchForm.dispatchPalmLocation;
				url = 'actions/dr/box';
				postDR(url);
				
			}; // End setDispatchBoxToLocation
			
			//This will set the general dispatch object
			vm.setGeneralDispatch = function() {
				if (angular.isDefined(vm.dispatchForm.selectedGeneralTransaction)) {
					outgoingDispatchRecieve.transactionNumber = vm.dispatchForm.selectedGeneralTransaction.transactionNo;
				}
				url = 'actions/dr/general';
				postDR(url);
				
			}; // End setGeneralDispatch
			
			//This function will post dispatch and receive transaction
			function postDR (url) {
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				vm.isLoading=true;
				NProgress.start();
				outgoingDispatchRecieve.currentEmployee = vm.dispatchForm.currentEmployee;
				outgoingDispatchRecieve.barcodeNumber = vm.dispatchForm.applicationNumber;
				$log.log("Outgoing dispatch to location: ");
				$log.log(outgoingDispatchRecieve);
				SiteFactory.postActions(outgoingDispatchRecieve, url)
				.then(
					function(response) {
						if (CommonUtils.checkPositiveStatus(response)) {
							vm.lastApplicationNumber = vm.dispatchForm.applicationNumber;
							vm.clear();
						}
						vm.notification = CommonUtils.setNotification(response);
						NProgress.done();
						vm.isLoading=false;

					},
					function(response) {
						$log.log("Error: ");
						$log.log(response);
						NProgress.done();
						vm.isLoading=false;
					}
				);
			} // End postDR
			
			
			
						
		}); // End DispatchController

})();