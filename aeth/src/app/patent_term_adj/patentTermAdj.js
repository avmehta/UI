(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('PTAController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;
			vm.ptaForm={};
//			vm.ptaForm.applicationNo = '';
//			vm.ptaForm.responsibleParty = '';
//			vm.ptaForm.adjustmentDuration = '';
			vm.ptaForm.reason = '';
			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.ptaForm.applicationNo = '';
				vm.ptaForm.responsibleParty = '';
				vm.ptaForm.adjustmentDuration = '';
				vm.ptaForm.reason = '';
				vm.notification = {};
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				
				/*if (angular.isDefined(vm.ptaForm.errorFound)) {
					vm.ptaForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.ptaForm.successFound)) {
					vm.ptaForm.successFound = false;
				}
				if (angular.isDefined(vm.ptaForm.warningFound)) {
					vm.ptaForm.warningFound = false;
				}*/
				
			
	
			}; // End clear
			
			// This function will post the Patent Term Adjustment (PTA) actions
			vm.postPTAAction = function() {
				
				var outgoingPTATransaction = {};
				outgoingPTATransaction.applicationNumber = vm.ptaForm.applicationNo;
				outgoingPTATransaction.responsiblePrty = vm.ptaForm.responsibleParty;
				outgoingPTATransaction.adjDuration = vm.ptaForm.adjustmentDuration;
				outgoingPTATransaction.reason = vm.ptaForm.reason;
				outgoingPTATransaction.ptaPteValue = 'PTA';
				outgoingPTATransaction.postingTransaction = 'P028';
				outgoingPTATransaction.mailRoomDate = CommonUtils.getCurrentDate();
				outgoingPTATransaction.actionDate = CommonUtils.getCurrentDate();
				
				$log.log(outgoingPTATransaction);

					SiteFactory.postActions(outgoingPTATransaction, 'actions/patent-terms')
						.then(
							function(response) {
								vm.clear();
								
								vm.notification = CommonUtils.setNotification(response);
								
								/*if (response.errorCode == '1') {			
									vm.ptaForm.successFound = true;
									vm.ptaForm.successMsg = response.messageDesc;
								}else if (response.errorCode=='2') {
									vm.ptaForm.warningFound=true;
									vm.ptaForm.warningMsg=response.messageDesc;
								} else {
									vm.ptaForm.errorFound = true;
									vm.ptaForm.successFound=false;
									vm.ptaForm.warningFound=false;
									vm.ptaForm.errorMsg = response.messageDesc;
								}*/
							},
							function(response, data) {
								alert("failure message: " + angular.toJson({data: data}));
							}
						);
			}; //End postPTAAction
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.postPTAAction();
				}
			}; // End searchKeyEvent
					
		});

})();