(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('PetitionsController',
			function($compile, $filter, $window, $log, NgTableParams, SiteFactory, CommonUtils) {
		
			var vm = this;
			
			vm.petitionsForm = {};
			vm.petitionActionsLogData=[];
			vm.deliveryInfo = {};
			vm.deliveryInfo.deliveryMode = '';
			vm.deliveryInfo.nxtBusDayInd = '';
			vm.deliveryInfo.nxtBusDayDisableChk = '';
						
			// This function will clear all the fields on the forms
			vm.clear = function() {
				delete vm.petitionsForm.applicationNo;
				delete vm.petitionsForm.mailRoomDate;
				delete vm.petitionsForm.decisionSelected;
				delete vm.petitionsForm.petitionTypeSelected;
				delete vm.petitionsForm.decidedPetitionTypeSelected;
				
				delete  vm.petitionsForm.decisionMailDate ;
				delete vm.deliveryInfo;
			
				delete vm.petitionsForm.decisionDate;
				delete vm.petitionsForm.certificateMailDate;
			
				
				
				vm.petitionsForm.adjustmentDuration='';
	
			};
			vm.clearAll = function() {
				vm.clear();

				
				if (angular.isDefined(vm.petitionsForm.errorFound)) {
					vm.petitionsForm.errorFound = false;
				}
				
				if (angular.isDefined(vm.petitionsForm.successFound)) {
					vm.petitionsForm.successFound = false;
				}
				if (angular.isDefined(vm.petitionsForm.warningFound)) {
					vm.petitionsForm.warningFound = false;
				}
				delete vm.petitionActionsLogData;
			};
			// This function will get a list of decisions
			vm.getPetitionsDecisionList = function() {
//				SiteFactory.petitionsDecisionList('petitionsDecision')
				SiteFactory.getActions('actions/petitions/decisions')
				.then(
					function(response) {
						vm.decisionList = response.decisionTypeList;
						$log.log(vm.decisionList);
						
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			};
			
			vm.getPetitionsDecisionList();
			
	
			
			// This function will get a list of petition types
			vm.getPetitionsTypeList = function() {
				SiteFactory.getActions('actions/petitions/types')
				.then(
					function(response) {
						//$log.log(response);
//						vm.petitionsForm = {
//								petitionTypeSelected : ''		
//						};
						vm.petitionsTypeList = response.petitionTypeList;
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			};
			
			vm.getPetitionsTypeList();
			
			
			// This function will get a list of petition types
			vm.getDecisionTypeList = function() {
				SiteFactory.getActions('actions/petitions/types')
				.then(
					function(response) {
						//$log.log(response);
//						vm.petitionsForm = {
//								petitionTypeSelected : ''		
//						};
						vm.decisionTypeList = response.petitionTypeList;
						$log.log(response);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			};
			
			vm.getDecisionTypeList();
			
			// This function will convert the date format
			vm.convertDateFormat = function(inputDate) {

				var mailRoomDate = new Date(inputDate);
				mailRoomDate = $filter('date')(mailRoomDate, 'MM/dd/yyyy');
				return mailRoomDate;
				
			}; // End convertDateFormat function
			
			
			var petitionActionsLogArray = [];
			var index = 0;
		
						
			// This function will post the Petition Actions
			vm.postPetitionsAction = function() {
				var outgoingPetitionTransaction = {};
				var	temPetitionAction={};
				outgoingPetitionTransaction.applicationNumber = vm.petitionsForm.applicationNo;
				if (angular.isDefined(vm.petitionsForm.certificateMailDate)){
				outgoingPetitionTransaction.certificateMailDate = vm.convertDateFormat(vm.petitionsForm.certificateMailDate);
				}
				
				if (angular.isUndefined(vm.petitionsForm.petitionTypeSelected)) {
					outgoingPetitionTransaction.initialPetitionType = '';
				} else {
					outgoingPetitionTransaction.initialPetitionType = vm.petitionsForm.petitionTypeSelected.petitionTypeCd;
				}
				outgoingPetitionTransaction.adjDuration = vm.petitionsForm.adjustmentDuration;
				
				$log.log(outgoingPetitionTransaction);
				
				//if decision selected , then do validations first, if validation success then call initial then decision
				//else just call initial only
				if (angular.isDefined(vm.petitionsForm.decisionSelected) || angular.isDefined(vm.petitionsForm.decidedPetitionTypeSelected)) {
					
					outgoingPetitionTransaction.decision = vm.petitionsForm.decisionSelected;
					if(angular.isDefined(vm.petitionsForm.decidedPetitionTypeSelected) && 
							angular.isDefined(vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd)){
					outgoingPetitionTransaction.decidedPetitionType = vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd;
					}
					outgoingPetitionTransaction.mailRoomDate= vm.petitionsForm.decisionMailDate;
					outgoingPetitionTransaction.actionDate=vm.petitionsForm.decisionDate;						
					$log.log(outgoingPetitionTransaction);
					
					$log.log("Calling validate-petition-decision");
					outgoingPetitionTransaction.petitionDecisionInd=true;
					SiteFactory.postActions(outgoingPetitionTransaction, 'actions/petitions/validate-petition-decision')
					.then(
						function(response) {
							if (response.errorCode == '1') {	
								
								if (angular.isDefined(vm.petitionsForm.errorFound)) {
									vm.petitionsForm.errorFound = false;
								}
								
								if (angular.isDefined(vm.petitionsForm.successFound)) {
									vm.petitionsForm.successFound = false;
								}
								if (angular.isDefined(vm.petitionsForm.warningFound)) {
									vm.petitionsForm.warningFound = false;
								}
								
								outgoingPetitionTransaction.mailRoomDate = vm.convertDateFormat(vm.petitionsForm.mailRoomDate);
								outgoingPetitionTransaction.actionDate = vm.convertDateFormat(vm.petitionsForm.mailRoomDate);
				$log.log("Calling initial petition");
				outgoingPetitionTransaction.petitionDecisionInd=false;
				SiteFactory.postActions(outgoingPetitionTransaction, 'actions/petitions')
				.then(
					function(response) {
						
						if (response.errorCode == '1') {								
							vm.petitionsForm.successFound = true;
							vm.petitionsForm.successMsg = response.messageDesc;					

						}else if (response.errorCode=='2') {
							vm.petitionsForm.warningFound=true;
							vm.petitionsForm.warningMsg=response.messageDesc;							
					
						} else {
							vm.petitionsForm.errorFound = true;
							vm.petitionsForm.successFound=false;
							vm.petitionsForm.warningFound=false;
							vm.petitionsForm.errorMsg = response.messageDesc;
						}						
						
						if(vm.petitionsForm.successFound ||
								vm.petitionsForm.warningFound	){
							temPetitionAction.applicationNumber = outgoingPetitionTransaction.applicationNumber;
							temPetitionAction.initialPetitionType = outgoingPetitionTransaction.initialPetitionType;							
							temPetitionAction.mailRoomDate = outgoingPetitionTransaction.mailRoomDate;						
							temPetitionAction.type='Initial';							
							vm.showPetitionActionLogData = true;
							
							
						
							
							
						}						
					},
					function(response) {
						$log.log("Error" + response);
					}
				)
				.then(function(response) {
					//make the conditional call
					
					if (angular.isDefined(vm.petitionsForm.decisionSelected) || angular.isDefined(vm.petitionsForm.decidedPetitionTypeSelected)) {
						outgoingPetitionTransaction.decision = vm.petitionsForm.decisionSelected;
						outgoingPetitionTransaction.decidedPetitionType = vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd;			
	
						
						outgoingPetitionTransaction.mailRoomDate= vm.petitionsForm.decisionMailDate;
						outgoingPetitionTransaction.actionDate = vm.convertDateFormat(vm.petitionsForm.decisionDate);					
						$log.log(outgoingPetitionTransaction);
						
						$log.log("Calling decided type petition");
						outgoingPetitionTransaction.petitionDecisionInd=true;
						SiteFactory.postActions(outgoingPetitionTransaction, 'actions/petitions')
						.then(
							function(response) {
								
								if (response.errorCode == '1') {								
									
									vm.petitionsForm.successFound = true;
									vm.petitionsForm.successMsg = response.messageDesc;							

								}else if (response.errorCode=='2') {
									vm.petitionsForm.warningFound=true;
									vm.petitionsForm.warningMsg=response.messageDesc;								
								
								
								} else {
									vm.petitionsForm.errorFound = true;
									vm.petitionsForm.successFound=false;
									vm.petitionsForm.warningFound=false;
									vm.petitionsForm.errorMsg = response.messageDesc;
								}
								
								if(vm.petitionsForm.successFound ||
										vm.petitionsForm.warningFound	){
							
									
									temPetitionAction.applicationNumber = outgoingPetitionTransaction.applicationNumber;
									temPetitionAction.initialPetitionType = outgoingPetitionTransaction.initialPetitionType;
									
									temPetitionAction.mailRoomDate = outgoingPetitionTransaction.mailRoomDate;
		
									if (angular.isDefined(vm.petitionsForm.decidedPetitionTypeSelected)) {
										temPetitionAction.decidedPetitionType = vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd;
									}
									if (angular.isDefined(vm.petitionsForm.decisionSelected)) {
										temPetitionAction.decision = vm.petitionsForm.decisionSelected;
									}
								
									temPetitionAction.type='Decision';
							
									
									vm.showPetitionActionLogData = true;
									
									vm.petitionActionsLogData.push(temPetitionAction);
									vm.clear();
								}
								
							},
							function(response) {
								$log.log("Error" + response);
							}
						);
						
					}else{
						
						vm.petitionActionsLogData.push(temPetitionAction);
					}
					
					
					
					//push into list
				},
				function() {
					
				});
			
							}
							else {
								vm.petitionsForm.errorFound = true;
								vm.petitionsForm.successFound=false;
								vm.petitionsForm.warningFound=false;
								vm.petitionsForm.errorMsg = response.messageDesc;
							}	
				},
				function(response) {
					$log.log("Error" + response);
				}
			);
				}else{
					outgoingPetitionTransaction.mailRoomDate = vm.convertDateFormat(vm.petitionsForm.mailRoomDate);
					outgoingPetitionTransaction.actionDate = vm.convertDateFormat(vm.petitionsForm.mailRoomDate);
					$log.log("Calling initial petition");
					outgoingPetitionTransaction.petitionDecisionInd=false;
					SiteFactory.postActions(outgoingPetitionTransaction, 'actions/petitions')
					.then(
						function(response) {
							
							if (response.errorCode == '1') {								
								vm.petitionsForm.successFound = true;
								vm.petitionsForm.successMsg = response.messageDesc;					

							}else if (response.errorCode=='2') {
								vm.petitionsForm.warningFound=true;
								vm.petitionsForm.warningMsg=response.messageDesc;							
						
							} else {
								vm.petitionsForm.errorFound = true;
								vm.petitionsForm.successFound=false;
								vm.petitionsForm.warningFound=false;
								vm.petitionsForm.errorMsg = response.messageDesc;
							}						
							
							if(vm.petitionsForm.successFound ||
									vm.petitionsForm.warningFound	){
								vm.clear();
								temPetitionAction.applicationNumber = outgoingPetitionTransaction.applicationNumber;
								temPetitionAction.initialPetitionType = outgoingPetitionTransaction.initialPetitionType;							
								temPetitionAction.mailRoomDate = outgoingPetitionTransaction.mailRoomDate;						
								temPetitionAction.type='Initial';							
								vm.showPetitionActionLogData = true;	
								vm.petitionActionsLogData.push(temPetitionAction);
							}						
						},
						function(response) {
							$log.log("Error" + response);
						}
					);
				}
				
			//	vm.clear();
				
				
				
			}; // End postPetitionsAction
			
			
			// This function will get the mail room date
			vm.getMailRoomDate = function(nxtBusDayInd) {
				
				var formatedDate;

						if (nxtBusDayInd) {
							formatedDate =vm.convertDateFormat(vm.deliveryInfo.nextBusDate);
							vm.petitionsForm.decisionMailDate = formatedDate;
						} else {
							formatedDate =vm.convertDateFormat(vm.deliveryInfo.currentDate);
							vm.petitionsForm.decisionMailDate = formatedDate;
						}


		

			}; // End getMailRoomDate function
			
			// This function will get the delivery mode information
			vm.getDeliveryInfo = function() {
				$log.log(vm.petitionsForm.applicationNo);
				$log.log(vm.petitionsForm.decisionSelected);
				$log.log(vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd);
				SiteFactory.getActions("actions/petitions/delivery-mode-info/" + vm.petitionsForm.applicationNo + "/" + vm.petitionsForm.decisionSelected + "/" + vm.petitionsForm.decidedPetitionTypeSelected.petitionTypeCd)
				.then(
					function(response) {
//						if (response.errorCode == '1') {
						if (CommonUtils.checkSuccess(response)) {
							vm.deliveryInfo = response;
							if (vm.deliveryInfo.mailRoomDate !== null) {
								 vm.petitionsForm.decisionMailDate = vm.deliveryInfo.mailRoomDate;
							} else {
								 vm.petitionsForm.decisionMailDate = null;
								 vm.petitionsForm.decisionMailDate = true;
							}
							if (vm.deliveryInfo.actionDate !== null) {
								 vm.petitionsForm.decisionDate = vm.deliveryInfo.actionDate;
							} else {
								 vm.petitionsForm.decisionDate = null;
								 vm.petitionsForm.decisionDate = true;
							}
							
						
							
						} else {
							vm.deliveryInfo.nxtBusDayDisableChk=true;
						}
						$log.log(vm.deliveryInfo);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End getDeliveryInfo
			
						
		});

})();