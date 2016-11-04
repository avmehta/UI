(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('ReExamController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils) {
		
			var vm = this;
			
			vm.reExamForm = {};

			
			// This function will clear all the fields on the forms
			vm.clear = function() {
				vm.reExamForm.applicationNo = '';
				vm.reExamForm.actionSelected = '';
				vm.reExamForm.statusSelected = '';
				vm.reExamForm.reExamMailDate = '';
				
				vm.reExamForm.extndReturns ='';
				if (angular.isDefined(vm.reExamForm.errorFound)) {
					vm.reExamForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.reExamForm.successFound)) {
					vm.reExamForm.successFound = false;
				}
				
				if (angular.isDefined(vm.reExamForm.warningFound)) {
					vm.reExamForm.warningFound = false;
				}
				
				
	
			}; // End clear
			
			// This function will get a list of reExam actions
			vm.getReExamActionList = function() {
				SiteFactory.getActions('actions/re-exams')
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
			
			// This function will get a list of reExam actions
			vm.getReExamStatusList = function() {
				SiteFactory.getActions('actions/re-exams/status')
				.then(
					function(response) {
						vm.statusList = response.stndApcStatusList;
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			
			}; // End getreExamActionList
			
			vm.getReExamStatusList();
			var reExamActionsLogArray = [];
			var index=0;
			// This function will post the Pre Appeals Actions
			vm.postReExamAction = function() {
				var transactionInput = {};
				transactionInput.applicationNumber = vm.reExamForm.applicationNo;
				transactionInput.mailRoomDate = CommonUtils.convertDateFormat(vm.reExamForm.reExamMailDate);
				transactionInput.actionDate = CommonUtils.convertDateFormat(vm.reExamForm.reExamMailDate);
				
				transactionInput.postingTransaction = vm.reExamForm.actionSelected;
				transactionInput.overrideApplStatusNo = vm.reExamForm.statusSelected;
								
//				SiteFactory.postActions(transactionInput, 'actions/re-exams')
				SiteFactory.postActions(transactionInput, 'actions/generic')
				.then(
					function(response) {
						$log.log(response);
						vm.clear();		
//						if (response.errorCode == '1' || response.errorCode=='2') {
						if (CommonUtils.checkPositiveStatus(response)) {
							
							reExamActionsLogArray[index] = transactionInput;
							index++;							
							vm.reExamActionsLogData = reExamActionsLogArray;							

						}
						
						vm.notification = CommonUtils.setNotification(response);
						
//					if (response.errorCode == '1' ){
//						vm.reExamForm.successFound = true;
//						vm.reExamForm.successMsg = response.messageDesc;
//						
//					}else if (response.errorCode=='2') {
//							vm.reExamForm.warningFound=true;
//							vm.reExamForm.warningMsg=response.messageDesc;
//						} else {
//							vm.reExamForm.errorFound = true;
//							vm.reExamForm.successFound=false;
//							vm.reExamForm.warningFound=false;
//							vm.reExamForm.errorMsg = response.messageDesc;
////							vm.reExamForm.extndReturns = response.extndReturns;
//						}
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End postreExamActions

					
		}); // End reExam Controller

})();