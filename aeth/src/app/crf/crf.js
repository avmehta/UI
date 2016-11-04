(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('CrfController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils) {
		
			var vm = this;
			
			vm.crfForm = {};

			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.crfForm.applicationNo = '';
				vm.crfForm.actionSelected = '';
				vm.crfForm.statusSelected = '';
				vm.crfForm.reExamMailDate = '';
				
				vm.crfForm.extndReturns ='';
				
				vm.notification = {};
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				
				/*if (angular.isDefined(vm.crfForm.errorFound)) {
					vm.crfForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.crfForm.successFound)) {
					vm.crfForm.successFound = false;
				}
				
				if (angular.isDefined(vm.crfForm.warningFound)) {
					vm.crfForm.warningFound = false;
				}*/
				
				
	
			}; // End clear
			
			// This function will get a list of reExam actions
			vm.getReExamActionList = function() {
				SiteFactory.getActions('actions/crf')
				.then(
					function(response) {
						vm.actionList = response.standardActionList;
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			
			}; // End getreExamActionList
			
			vm.getReExamActionList();
			
	
		
			var reExamActionsLogArray = [];
			var index=0;
			// This function will post the Pre Appeals Actions
			vm.postCrfAction = function() {
				var transactionInput = {};
				transactionInput.applicationNumber = vm.crfForm.applicationNo;
				transactionInput.mailRoomDate = CommonUtils.convertDateFormat(vm.crfForm.reExamMailDate);
				transactionInput.actionDate = CommonUtils.convertDateFormat(vm.crfForm.reExamMailDate);
				
				transactionInput.postingTransaction = vm.crfForm.actionSelected;
				transactionInput.newCrfSubmissionIn = vm.crfForm.newCrfSubmissionIn;
								
				SiteFactory.postActions(transactionInput, 'actions/crf')
				.then(
					function(response) {
						$log.log(response);
						vm.clear();		
//						if (response.errorCode == '1' || response.errorCode=='2') {
						if (CommonUtils.checkPositiveStatus(response)) {
							var logObj=transactionInput;
							logObj.crfSubmissionCd=response.crfSubmissionCd;
							reExamActionsLogArray[index] = transactionInput;
							index++;							
							vm.reExamActionsLogData = reExamActionsLogArray;							

						}
						
						vm.notification = CommonUtils.setNotification(response);
						
//						if (response.errorCode == '1' ){
//						vm.crfForm.successFound = true;
//						vm.crfForm.successMsg = response.messageDesc;
//						
//					}else if (response.errorCode=='2') {
//							vm.crfForm.warningFound=true;
//							vm.crfForm.warningMsg=response.messageDesc;
//						} else {
//							vm.crfForm.errorFound = true;
//							vm.crfForm.successFound=false;
//							vm.crfForm.warningFound=false;
//							vm.crfForm.errorMsg = response.messageDesc;
////							vm.crfForm.extndReturns = response.extndReturns;
//						}
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End postreExamActions

					
		}); // End reExam Controller

})();