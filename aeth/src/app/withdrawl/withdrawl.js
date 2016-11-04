(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('WithdrawlController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils) {
		
			var vm = this;
			
			vm.withdrawlForm = {};

			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.withdrawlForm.applicationNo = '';
				vm.withdrawlForm.actionSelected = '';
				vm.withdrawlForm.withdrawlMailDate = '';
				vm.notification = {};
				
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				
				
				/*if (angular.isDefined(vm.withdrawlForm.errorFound)) {
					vm.withdrawlForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.withdrawlForm.successFound)) {
					vm.withdrawlForm.successFound = false;
				}
				
				if (angular.isDefined(vm.withdrawlForm.warningFound)) {
					vm.withdrawlForm.warningFound = false;
				}*/
				
				
	
			}; // End clear
			
			// This function will get a list of Withdrawl actions
			vm.getWithdrawlActionList = function() {
				SiteFactory.getActions('actions/generic/Withdraw')
				.then(
					function(response) {
						vm.actionList = response.standardActionList;
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			
			}; // End getWithdrawlActionList
			
			vm.getWithdrawlActionList();
			
			var withdrawlActionsLogArray = [];
			var index=0;
			
			// This function will post the Pre Appeals Actions
			vm.postWithdrawlAction = function() {
				var outgoingWithdrawlTransaction = {};
				outgoingWithdrawlTransaction.applicationNumber = vm.withdrawlForm.applicationNo;
				outgoingWithdrawlTransaction.mailRoomDate = CommonUtils.convertDateFormat(vm.withdrawlForm.withdrawlMailDate);
				
				outgoingWithdrawlTransaction.actionDate = CommonUtils.convertDateFormat(vm.withdrawlForm.withdrawlMailDate);
				outgoingWithdrawlTransaction.postingTransaction = vm.withdrawlForm.actionSelected;
								
				SiteFactory.postActions(outgoingWithdrawlTransaction, 'actions/generic')
				.then(
					function(response) {
						$log.log(response);
						vm.clear();	
//						if (response.errorCode == '1' || response.errorCode=='2') {
						if (CommonUtils.checkPositiveStatus(response)) {
							
							withdrawlActionsLogArray[index] = outgoingWithdrawlTransaction;
							index++;							
							vm.withdrawlActionsLogData = withdrawlActionsLogArray;							

						}
						
						vm.notification = CommonUtils.setNotification(response);
						
						/*if (response.errorCode == '1'){
							vm.withdrawlForm.successFound = true;
							vm.withdrawlForm.successMsg = response.messageDesc;
							
						}else if (response.errorCode=='2') {
							vm.withdrawlForm.warningFound=true;
							vm.withdrawlForm.warningMsg=response.messageDesc;
						} else {
							vm.withdrawlForm.errorFound = true;
							vm.withdrawlForm.successFound=false;
							vm.withdrawlForm.warningFound=false;
							vm.withdrawlForm.errorMsg = response.messageDesc;
						}*/
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End postWithdrawlActions

					
		}); // End Withdrawl Controller

})();