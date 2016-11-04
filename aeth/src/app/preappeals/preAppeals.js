(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('PreAppealsController',
			function($compile, $filter, $window, $log, NgTableParams, SiteFactory, CommonUtils) {
		
			var vm = this;
			vm.preAppealsActionForm={};
			vm.preAppealsForm={};
			vm.deliveryInfo={};
			vm.deliveryInfo.nxtBusDayDisableChk=true;
			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.mailingActionsLogData = '';
//				vm.preAppealsForm.applicationNo = '';
				vm.preAppealsActionsData = '';
				vm.preAppealsActionForm.actionSelected = '';
				vm.preAppealsActionForm.appealsMailDate = '';
				vm.preAppealsActionForm.appealsActionDate = '';
				vm.deliveryInfo.deliveryMode = '';
				vm.mailDate = '';
				vm.deliveryInfo.nxtBusDayInd = '';
				vm.mailDateNull = false;
				vm.notification = {};
			
				
				if (angular.isDefined(vm.preAppealsForm.applicationNo)) {
					vm.preAppealsForm.applicationNo = '';
				}
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
					
				/*if (angular.isDefined(vm.deliveryInfo.errorFound)) {
					vm.deliveryInfo.errorFound = false;
				}
				
				if (angular.isDefined(vm.deliveryInfo.successFound)) {
					vm.deliveryInfo.successFound = false;
				}
				
				if (angular.isDefined(vm.deliveryInfo.warningFound)) {
					vm.deliveryInfo.warningFound = false;
				}*/
				
				
	
			}; // End clear
			vm.clearAll = function() {
				vm.clear();
				vm.preAppealsActionsLogData = '';
			};
			// This function will get a list of actions
			vm.getPreApplealsActionList = function() {
				SiteFactory.getActions('actions/appeals/actions/PreAppealAction')
				.then(
					function(response) {
						$log.log(response);
						vm.actionList = response.standardActionList;
						$log.log(vm.actionList);
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			}; // End getPreApplealsActionList
			
			vm.getPreApplealsActionList();
			
			vm.getPreAppealsInfo = function() {
				SiteFactory.getActions("actions/appeals/delivery-mode-info/" + vm.preAppealsForm.applicationNo + "/" + vm.preAppealsActionForm.actionSelected)
				.then(
					function(response) {
//						if (response.errorCode == '1') {
						if (CommonUtils.checkSuccess(response)) {
						vm.deliveryInfo = response;
						if (vm.deliveryInfo.mailRoomDate !== null) {
							vm.mailDate = new Date (vm.deliveryInfo.mailRoomDate);
						} else {
							vm.mailDate = null;
							vm.mailDateNull = true;
						}
						}else{
							vm.deliveryInfo.nxtBusDayDisableChk=true;
						}
						$log.log(vm.deliveryInfo);
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			};
			
			var preAppealsActionsLogArray = [];
			var index = 0;
						
			// This function will post the Pre Appeals Actions
			vm.postPreAppealsAction = function() {
				var outgoingAppealsTransactionInput = {};
				outgoingAppealsTransactionInput.applicationNumber = vm.preAppealsForm.applicationNo;
				if (angular.isDefined(vm.preAppealsActionForm.appealsActionDate)) {
					outgoingAppealsTransactionInput.actionDate = CommonUtils.convertDateFormat(vm.preAppealsActionForm.appealsActionDate);
				}
			
				outgoingAppealsTransactionInput.postingTransaction = vm.preAppealsActionForm.actionSelected;
			
				if (angular.isDefined(vm.mailDate)) {
				outgoingAppealsTransactionInput.mailRoomDate = CommonUtils.convertDateFormat(vm.mailDate);
				}else{
					outgoingAppealsTransactionInput.mailRoomDate =outgoingAppealsTransactionInput.actionDate;
				}
				$log.log("OutgoingPreAppealsTransactionInput: ");
				$log.log(outgoingAppealsTransactionInput);
				outgoingAppealsTransactionInput.preAppealInd=true;			
				SiteFactory.postActions(outgoingAppealsTransactionInput, 'actions/appeals')
				.then(
					function(response) {
						vm.clear();
//						if (response.errorCode == '1' || response.errorCode=='2') {
						if (CommonUtils.checkPositiveStatus(response)) {
							
							preAppealsActionsLogArray[index] = outgoingAppealsTransactionInput;
							if (angular.isDefined(vm.mailDate)) {
								preAppealsActionsLogArray[index].mailRoomDate=vm.mailDate;
							}else{
								preAppealsActionsLogArray[index].mailRoomDate=vm.preAppealsActionForm.appealsActionDate;
							}
							
							index++;
							
							vm.preAppealsActionsLogData = preAppealsActionsLogArray;
							vm.showPreAppealsActionLogData = true;

						}
						
						vm.notification = CommonUtils.setNotification(response);
						
//						if (response.errorCode == '1') {
//							vm.deliveryInfo.successFound = true;
//							vm.deliveryInfo.successMsg = response.messageDesc;
//						}else if (response.errorCode=='2') {
//							vm.deliveryInfo.warningFound=true;
//							vm.deliveryInfo.warningMsg=response.messageDesc;
//						
//						} else {
//							vm.deliveryInfo.errorFound = true;
//							vm.deliveryInfo.successFound=false;
//							vm.deliveryInfo.warningFound=false;
//							vm.deliveryInfo.errorMsg = response.messageDesc;
//						}
					},
					function(response) {
						$log.log("Error: " + response);
					}
				);
			}; // End postPreAppealsAction
			
			// This function will get the mail room date
			vm.getMailRoomDate = function(nxtBusDayInd) {
				
				var formatedDate;

						if (nxtBusDayInd) {
							formatedDate = new Date (CommonUtils.convertDateFormat(vm.deliveryInfo.nextBusDate));
							vm.mailDate = formatedDate;
						} else {
							formatedDate = new Date (CommonUtils.convertDateFormat(vm.deliveryInfo.currentDate));
							vm.mailDate = formatedDate;
						}

			}; // End getMailRoomDate function
			
						
		});

})();