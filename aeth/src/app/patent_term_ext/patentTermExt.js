(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('PTEController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;
			vm.pteForm={};
//			vm.pteForm.applicationNo = '';
//			vm.pteForm.responsibleParty = '';
//			vm.pteForm.adjustmentDuration = '';
			vm.pteForm.reason = '';	
			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.pteForm.applicationNo = '';
				vm.pteForm.responsibleParty = '';
				vm.pteForm.adjustmentDuration = '';
				vm.pteForm.reason = '';
				vm.notification = {};				
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				
				/*if (angular.isDefined(vm.pteForm.errorFound)) {
					vm.pteForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.pteForm.successFound)) {
					vm.pteForm.successFound = false;
				}
				
				if (angular.isDefined(vm.pteForm.warningFound)) {
					vm.pteForm.warningFound = false;
				}*/
				
			
	
			}; // End clear
			
			// This function will post the Patent Term Extension (PTE) actions
			vm.postPTEAction = function() {
				
				var outgoingPTETransaction = {};
				outgoingPTETransaction.applicationNumber = vm.pteForm.applicationNo;
				outgoingPTETransaction.responsiblePrty = vm.pteForm.responsibleParty;
				outgoingPTETransaction.adjDuration = vm.pteForm.adjustmentDuration;
				outgoingPTETransaction.reason = vm.pteForm.reason;
				outgoingPTETransaction.ptaPteValue = 'PTE';
				outgoingPTETransaction.postingTransaction = 'P029';
				outgoingPTETransaction.mailRoomDate = CommonUtils.getCurrentDate();
				outgoingPTETransaction.actionDate = CommonUtils.getCurrentDate();
				
				
				$log.log(outgoingPTETransaction);

					SiteFactory.postActions(outgoingPTETransaction, 'actions/patent-terms')
						.then(
							function(response) {
								vm.clear();
								vm.notification = CommonUtils.setNotification(response);
									
								/*if (response.errorCode == '1') {									
									vm.pteForm.successFound = true;
									vm.pteForm.successMsg = response.messageDesc;
								} else if (response.errorCode=='2') {
									vm.pteForm.warningFound=true;
									vm.pteForm.warningMsg=response.messageDesc;
								} else {
									vm.pteForm.errorFound = true;
									vm.pteForm.successFound=false;
									vm.pteForm.warningFound=false;
									vm.pteForm.errorMsg = response.messageDesc;
								}*/
							},
							function(response, data) {
								alert("failure message: " + angular.toJson({data: data}));
							}
						);
			}; //End postPTEAction
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.postPTEAction();
				}
			}; // End searchKeyEvent
						
		});

})();