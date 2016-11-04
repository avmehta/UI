(function() {
	'use strict';

	angular
			.module('actionEngine')
			.controller(
					'CaseActionController',

					function($compile, $filter, $window, $log, NgTableParams,
							SiteFactory, CommonUtils, CONSTANTS) {

						var vm = this;
						
						vm.caseActionForm = {};
						vm.actionList = {};
						
						// This function will get a list of case actions
						vm.getCaseActionList = function() {
							SiteFactory.getActions('actions/generic/CaseAction')
									.then(function(response) {
										vm.actionGlobalList = response.standardActionList;
										vm.actionList = response.standardActionList;
									}, function(response) {
										$log.log(response);
									});
						}; // End getCaseActionList

						vm.getCaseActionList();

						// This function will get the description of selected
						// actions
						vm.getSeletedActionDesc = function() {
							var descFound = false;
							var tempActionList = [];
							var j = 0;
							for (var i = 0; i < vm.actionList.length; i++) {

								if (vm.caseActionForm.postingTransaction == vm.actionList[i].transactionNo) {
									vm.caseActionForm.actionSelected = vm.actionList[i].contentEventCd;
									vm.caseActionForm.actionDesc = vm.actionList[i].descriptionTx;
									descFound = true;
									tempActionList[j] = vm.actionList[i];
									j++;

									vm.transRespTable = false;
									if (vm.actionList[i].responseIn == 'Y') {
										vm.respondTransactionData = '';
										vm.transRespTable = true;
									}
								}
							}
							if (tempActionList.length > 0) {

								tempActionList
										.sort(function(a, b) {
											return a.transactionQualifier > b.transactionQualifier;
										});

								if (angular
										.isDefined(tempActionList[0].transactionQualifier)) {
									vm.qualifierList = tempActionList;
									vm.caseActionForm.transactionQualifier = tempActionList[0].transactionQualifier;
								} else {
									vm.qualifierList = '';
									vm.caseActionForm.transactionQualifier = '';
								}
							}
							if (!descFound) {
								vm.caseActionForm.actionSelected = '';
								vm.caseActionForm.actionDesc = '';

//								vm.caseActionForm.errorFound = true;
//								vm.caseActionForm.errorMsg = 'Please enter correct Transaction Number';
								vm.notification.showNotice = true;
								vm.notification.notice = 'danger';
								vm.notification.noticeMsg = 'Please enter correct Transaction Number';							
								
								
							} else {
//								vm.caseActionForm.errorFound = false;
//								vm.caseActionForm.errorMsg = '';
								vm.notification.showNotice = false;
								vm.notification.noticeMsg = '';
								
							}

						}; // End getSeletedActionDesc

						// This function will get the list of selected qualifier
						vm.getSeletedQualifierDesc = function() {
							var descFound = false;

							for (var i = 0; i < vm.actionList.length; i++) {

								if ((vm.caseActionForm.postingTransaction == vm.actionList[i].transactionNo) && 
									(vm.caseActionForm.transactionQualifier == vm.actionList[i].transactionQualifier)) {
									vm.caseActionForm.actionSelected = vm.actionList[i].contentEventCd;
									vm.caseActionForm.actionDesc = vm.actionList[i].descriptionTx;
									descFound = true;

									break;
								}
							}

							if (!descFound) {
								vm.caseActionForm.actionSelected = '';
								vm.caseActionForm.actionDesc = '';
							}

						}; // End getSeletedQualifierDesc

						// This function will get the selected action number
						vm.getSeletedActionNo = function() {
							var tempActionList = [];
							var j = 0;
							for (var i = 0; i < vm.actionList.length; i++) {

								if (vm.caseActionForm.actionSelected == vm.actionList[i].contentEventCd) {
									vm.caseActionForm.postingTransaction = vm.actionList[i].transactionNo;
									vm.caseActionForm.actionDesc = vm.actionList[i].descriptionTx;
									tempActionList[j] = vm.actionList[i];
									j++;
									vm.qualifierList = tempActionList;
									if (angular
											.isDefined(vm.actionList[i].transactionQualifier)) {
										vm.caseActionForm.transactionQualifier = vm.actionList[i].transactionQualifier;
									} else {
										vm.caseActionForm.transactionQualifier = '';
									}
									vm.transRespTable = false;
									if (vm.actionList[i].responseIn == 'Y') {
										vm.respondTransactionData = '';
										vm.transRespTable = true;
									}
									break;
								}
							}

						}; // End getSeletedActionNo

						// This function will clear the fields on the form
						vm.clear = function() {
							vm.caseActionForm.postingTransaction = '';
							vm.caseActionForm.transactionQualifier = '';
							vm.caseActionForm.actionSelected = '';
							vm.caseActionForm.mailRoomDate = '';
							vm.caseActionForm.applicationNo = '';
							vm.caseActionForm.extnTime = false;
							vm.caseActionForm.timeGranted = '';
							vm.caseActionForm.certificateMailDate = '';
							vm.caseActionForm.examinerNo = '';
							vm.caseActionForm.gau = '';
							vm.caseActionForm.errorFound = false;
							vm.caseActionForm.successFound = false;
							vm.caseActionForm.warningFound = false;
							vm.transRespTable = false;
							vm.respondTransactionData = '';
							vm.notification = {};
							
							if (angular.isDefined(vm.notification.showNotice)) {
								vm.notification.showNotice = false;
							}
						}; // End clear

						var caseActionsLogArray = [];
						var index=0;
						
						// This function will post the case action
						vm.postCaseAction = function() {

							vm.caseActionForm.errorFound = false;
							vm.caseActionForm.successFound = false;

							var caseActionTransactionInput = {};
							caseActionTransactionInput.applicationNumber = vm.caseActionForm.applicationNo;
					
								var mailRoomDate = new Date();
								mailRoomDate.setUTCHours($filter('date')(
										Date.now(), 'HH'), $filter('date')(
										Date.now(), 'mm'), $filter('date')(
										Date.now(), 'ss'));
								mailRoomDate = $filter('date')(mailRoomDate,
										'MM/dd/yyyy');

								caseActionTransactionInput.mailRoomDate = mailRoomDate;
								caseActionTransactionInput.actionDate= mailRoomDate;
					

							if (vm.caseActionForm.certificateMailDate !== '' && 
									angular.isDefined(vm.caseActionForm.certificateMailDate)) {
								var certificateMailDate = new Date(
										vm.caseActionForm.certificateMailDate);
								certificateMailDate.setUTCHours($filter('date')
										(Date.now(), 'HH'), $filter('date')
										(Date.now(), 'mm'), $filter('date')
										(Date.now(), 'ss'));
								certificateMailDate = $filter('date')(
										certificateMailDate, 'MM/dd/yyyy');

								caseActionTransactionInput.certificateMailDate = certificateMailDate;
							}

						
							for (var i = 0; i < vm.actionList.length; i++) {

								if (vm.caseActionForm.actionSelected == vm.actionList[i].contentEventCd) {
									caseActionTransactionInput.postingTransaction = vm.actionList[i].contentEventCd;
									vm.caseActionForm.actionDesc = vm.actionList[i].descriptionTx;
									break;
								}
							}

								SiteFactory
										.postActions(
												caseActionTransactionInput,
												'actions/generic')
										.then(
												function(response) {
																				

														$log.log(response);
														vm.clear();		
//														if (response.errorCode == '1' || response.errorCode=='2') {
														if (CommonUtils.checkPositiveStatus(response)) {
															
															caseActionsLogArray[index] = caseActionTransactionInput;
															index++;							
															vm.caseActionsLogData = caseActionsLogArray;							

														}
														
														vm.notification = CommonUtils.setNotification(response);
														
//													if (response.errorCode == '1' ){
//														vm.caseActionForm.successFound = true;
//														vm.caseActionForm.successMsg = response.messageDesc;
//														
//													}else if (response.errorCode=='2') {
//															vm.caseActionForm.warningFound=true;
//															vm.caseActionForm.warningMsg=response.messageDesc;
//														} else {
//															vm.caseActionForm.errorFound = true;
//															vm.caseActionForm.successFound=false;
//															vm.caseActionForm.warningFound=false;
//															vm.caseActionForm.errorMsg = response.messageDesc;
////															vm.crfForm.extndReturns = response.extndReturns;
//														}
													
													

													
												},
												function(response) {
													alert("failure message: " + response);
												});


						}; // End postCaseAction
						
						// Function to allow pressing enter to search
						vm.searchKeyEvent = function($event) {
							if ($event.keyCode === CONSTANTS.ENTER_KEY) {
								vm.postCaseAction();
							}
						}; // End searchKeyEvent

					}); // End CaseActionController

})();