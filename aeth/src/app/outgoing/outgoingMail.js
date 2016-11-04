(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('OutgoingMailController',
			function($compile, $filter, $window, $log, NgTableParams, SiteFactory, CommonUtils, CONSTANTS) {
				
				var vm = this;
				
				vm.outgoingForm = {};

				var shortStatutoryPeriodCdList = [];
				var shortStatutoryPeriod = {};

				shortStatutoryPeriod.value = '0';
				shortStatutoryPeriod.code = '<NONE>';
				shortStatutoryPeriodCdList[0] = shortStatutoryPeriod;

				shortStatutoryPeriod = {};

				shortStatutoryPeriod.value = 'D';
				shortStatutoryPeriod.code = 'Day(s)';
				shortStatutoryPeriodCdList[1] = shortStatutoryPeriod;

				shortStatutoryPeriod = {};

				shortStatutoryPeriod.value = 'M';
				shortStatutoryPeriod.code = 'Months(s)';
				shortStatutoryPeriodCdList[2] = shortStatutoryPeriod;
				vm.shortStatutoryPeriodCdList = shortStatutoryPeriodCdList;
				

				// This function will clear all the fields on the form
				vm.clear = function() {
				
					vm.outgoingForm.applicationNo = '';
					vm.mailingActionsData = '';
					vm.selection = [];
					
					//vm.notification = {};
					
					if (angular.isDefined(vm.notification.showNotice)) {
						vm.notification.showNotice = false;
					}
					

					/*if (angular.isDefined(vm.outgoingForm.errorFound)) {
						vm.outgoingForm.errorFound = false;
					}

					if (angular.isDefined(vm.outgoingForm.successFound)) {
						vm.outgoingForm.successFound = false;
					}
					if (angular.isDefined(vm.outgoingForm.warningFound)) {
						vm.outgoingForm.warningFound = false;
					}
				
					if (angular.isDefined(vm.outgoingForm.mailListErrorFound)) {
						vm.outgoingForm.mailListErrorFound = false;
					}

					if (angular.isDefined(vm.outgoingForm.mailListSuccessFound)) {
						vm.outgoingForm.mailListSuccessFound = false;
					}
					if (angular.isDefined(vm.outgoingForm.mailListWarningFound)) {
						vm.outgoingForm.mailListWarningFound = false;
					}*/

				}; // End clear function
				vm.clearAll = function() {
					vm.clear();
					vm.mailingActionsLogData = '';
				};
				
				// This function will get a list of all the mailing actions for the supplied application number
				vm.getMailingActions = function() {
					
					var outgoingTransactionInput = {};
					outgoingTransactionInput.applicationNumber = vm.outgoingForm.applicationNo;

						SiteFactory.getOutgoingMailActions(outgoingTransactionInput.applicationNumber, 'actions/outgoing/')
						.then(
							function(response) {
								vm.mailingActionsData = '';
								vm.outgoingForm.mailListErrorFound = false;
								vm.outgoingForm.mailListSuccessFound = false;

//								if (response.errorCode == '1') {
								if (CommonUtils.checkSuccess(response)) {
									vm.mailingActionsData = response.postingMailActionsList;

									for (var i = 0; i < vm.mailingActionsData.length; i++) {
										var formatedDate = CommonUtils.convertDateFormat(vm.mailingActionsData[i].mailRoomDate);
										vm.mailingActionsData[i].mailRoomDisplayDate = formatedDate;
										formatedDate = CommonUtils.convertDateFormat(vm.mailingActionsData[i].parentRecordedDate);
										vm.mailingActionsData[i].parentRecordedDate = formatedDate;
									}

									vm.mailingActionsTable = true;
									
								}
									
								/*} else if (response.errorCode=='2') {
									vm.outgoingForm.mailListWarningFound=true;
									vm.outgoingForm.mailListWarningMsg=response.messageDesc;
								
								}else {
									vm.outgoingForm.mailListErrorFound = true;
									vm.outgoingForm.mailListErrorMsg  = response.messageDesc;
								}*/
								
								vm.notification = CommonUtils.setNotification(response);
							},
							
							function(response) {
								$log.log(response);
							}
						);

				}; // End getMailingActions function
				
			var logArray=[];
			
			vm.mailingActionsLogData =[];
				var index = 0;
				var selectedMailingActions=[];
				
				
						// ===================ADDED CODE===================================
						
						// -------------- Selecting multiple checkboxes ------------
						
						vm.selection=[];
						
						vm.toggleSelection = function toggleSelection(selectedMailingAction) {
							var index = vm.selection.indexOf(selectedMailingAction);
							
							
							if (index > -1) {
								vm.selection.splice(index, 1);
								
							} else {
								vm.selection.push(selectedMailingAction);
								
							}
							$log.log(vm.selection);
						};
						
						
						// -------------- Sorting the array ------------
						
						function compare (a,b) {
							if (a.significantMailInd == "Y") {
								return -1;
							} else if (a.significantMailInd == "N") {
								return 1;
							} else {
								return 0;
							}
						}						
						
						vm.sortArray = function() {
							vm.selection.sort(compare);
							$log.log(vm.selection);
						};
						
						// ===============================================================
						
						
				// This function will post the mailing actions
				vm.postMailingActions = function() {
				/*	var selectedMailingActions = {};
					var j = 0;
					
					for (var i = 0; i < vm.mailingActionsData.length; i++) {
						
						if (angular.isDefined(vm.mailingActionsData[i].selected) && vm.mailingActionsData[i].selected === true) {
							
							selectedMailingActions= vm.mailingActionsData[i];
							selectedMailingActions.mailRoomDate = vm.mailingActionsData[i].mailRoomDisplayDate;
							break;
						}
					
					}*/
					
					vm.selection.sort(compare);
					$log.log(vm.selection);
					
				
						
					for (var i = 0; i < vm.selection.length; i++) {
						
						var outgoingTransactionInput = {};
					
//					if(angular.isDefined(vm.selectedRow)){
//						 selectedMailingActions= angular.fromJson(vm.selectedRow);

				
					outgoingTransactionInput.applicationNumber = vm.outgoingForm.applicationNo;
					outgoingTransactionInput.postingTransaction= vm.selection[i].postingActionCd;
					outgoingTransactionInput.mailRoomDate=vm.selection[i].mailRoomDate;
					outgoingTransactionInput.actionDate=vm.selection[i].mailRoomDate;
					
					outgoingTransactionInput.deliveryMode=vm.selection[i].deliveryMode;
					outgoingTransactionInput.sequenceNo=vm.selection[i].seqNo;
					outgoingTransactionInput.parentPostingTransaction=vm.selection[i].parentTransactionCd;
					outgoingTransactionInput.parentRecordedDate=vm.selection[i].parentRecordedDate;
					outgoingTransactionInput.nxtBusDayInd=vm.selection[i].nxtBusDayInd;
					outgoingTransactionInput.shortenedStatutoryPeriod=vm.selection[i].shortenedStatutoryPeriod;
					outgoingTransactionInput.shortenedStatutoryPeriodCd=vm.selection[i].shortenedStatutoryPeriodCd;	
					outgoingTransactionInput.significantMailInd=vm.selection[i].significantMailInd;
					

					
					postEachAction();
					
					} // End for loop
					
//					} 
										
					function postEachAction () {
						var index = 0;
						SiteFactory.postActions(outgoingTransactionInput, 'actions/outgoing')
						.then(
							function(response) {
								vm.clear();
								$log.log(response);
								var currentLog={};
								currentLog.applicationNumber=response.applicationNumber;
								currentLog.deliveryMode=response.deliveryMode;
								currentLog.status=response.status;
								
								
								if (response.errorCode == '1') {

									currentLog.success=true;
									currentLog.error=false;
									currentLog.warningFound=false;
									
									currentLog.postingActionDesc=response.postingTransactionDesc;
								
								if (angular.isDefined(response.document) && response.document !== '') {
									currentLog.showPdf = true;
									currentLog.document=response.document;
								} else {
									currentLog.showPdf = false;								
									
								}		
								
									
								}else 	if (response.errorCode == '2') {
									currentLog.success=false;
									currentLog.error=false;
									currentLog.warningFound=true;
									currentLog.messageDesc=response.messageDesc;
								}else{
									currentLog.success=false;
									currentLog.error=true;
									currentLog.warningFound=false;
									currentLog.messageDesc=response.messageDesc;
								}
									
//								vm.mailingActionsLogData.push(response);
								vm.mailingActionsLogData.push(currentLog);
//								logArray[index] = currentLog;
//								index++;
//								vm.mailingActionsLogData=logArray;
								vm.shoeMailingActionsLogData = true;	
								
								
//								vm.mailingActionsLogData = selectedMailingActions[index];
//								index++;
								
//if(response!==undefined){
								

									
//									if (response.errorCode == '1' || response.errorCode == '2') {
								
//								
										/*var tempMailingActionsLogData = selectedMailingActions;
										tempMailingActionsLogData.applicationNo=vm.outgoingForm.applicationNo;
										if (angular.isDefined(response.document) && response.document !== '') {
											tempMailingActionsLogData.showPdf = true;
											tempMailingActionsLogData.document=response.document;
										} else {
											tempMailingActionsLogData.showPdf = false;
//										}					
									
									
									logArray[index] = tempMailingActionsLogData;
									index++;
									vm.mailingActionsLogData=logArray;
									vm.shoeMailingActionsLogData = true;	
								
									}
										*/
										
//								vm.notification = CommonUtils.setNotification(response);
								
								
								if (response.errorCode == '1') {
									
									vm.outgoingForm.successFound = true;
									vm.outgoingForm.successMsg = response.messageDesc;

								}else if (response.errorCode=='2') {
									vm.outgoingForm.warningFound=true;
									vm.outgoingForm.warningMsg=response.messageDesc;
								} else {
									vm.outgoingForm.errorFound = true;
									vm.outgoingForm.successFound=false;
									vm.outgoingForm.warningFound=false;
									vm.outgoingForm.errorMsg = response.messageDesc;
								}
//}	
							},
							
							function(response) {
								$log.log("Failed");
								index++;
							}
				
							
						);
						
						$log.log(outgoingTransactionInput);
						
					}
					
					
				}; // End postMailingActions function

				// This function will open the PDF
				vm.openPdfFromService = function(pdfData) {
					var path = $window.location.origin;
					$window
						.open(
							path +
							"/ActionEngineServices/action-engine-services/actions/outgoing/correspondences/" +
							pdfData.document,
							"_blank");

				};


				// This function will get the mail room date
				vm.getMailRoomDate = function(contentEventCd, nxtBusDayInd,seqNo) {
					
					var formatedDate;

					for (var i = 0; i < vm.mailingActionsData.length; i++) {

						if (contentEventCd == vm.mailingActionsData[i].postingActionCd && 
								seqNo== vm.mailingActionsData[i].seqNo) {
							if (nxtBusDayInd) {
								formatedDate = CommonUtils.convertDateFormat(vm.mailingActionsData[i].nextBusDate);
								vm.mailingActionsData[i].mailRoomDisplayDate = formatedDate;
							} else {
								formatedDate = CommonUtils.convertDateFormat(vm.mailingActionsData[i].currentDate);
								vm.mailingActionsData[i].mailRoomDisplayDate = formatedDate;
							}
							break;
						}
					}

				}; // End getMailRoomDate function
				
				// Function to allow pressing enter to search
				vm.searchKeyEvent = function($event) {
					if ($event.keyCode === CONSTANTS.ENTER_KEY) {
						vm.getMailingActions();
					}
				}; // End searchKeyEvent

			}); // End OutgoingMailController

})();