(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('SolicitorsController',
			function($compile, $filter, $window, $modal, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;
			vm.solicitorsForm = {};
			vm.solicitorsForm.courtType = {};
			var courtCaseDetailsTransactionInput = {};
			vm.courtCases = {};
			vm.notification = {};
			
			// Function to open employee name modal in court case details
			vm.openEmployeeName = function () {
				var employeeNameModalInstance = $modal.open({
					templateUrl: 'app/solicitors/listEmployee.html',
					controller: 'ListEmployeeController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						items: function () {
							return vm.solicitorsForm;
						}
					}
					
				});
				
				employeeNameModalInstance.result.then(function (selectedEmployee) {
					vm.solicitorsForm.selectedEmployee = selectedEmployee;
					vm.solicitorsForm.employeeNo = selectedEmployee.empNo;
					vm.solicitorsForm.employeeName = selectedEmployee.familyName + ", " + selectedEmployee.givenName;
					$log.log("Returning selected employee");
					$log.log(vm.solicitorsForm.selectedEmployee);
				}, function () {
					$log.log('Modal selection returned');
				});
			}; // End openEmployeeName
			
			
			// Function to open modal to add case in case papers
			vm.addCasePapers = function () {
				var casePapersModalInstance = $modal.open({
					templateUrl: 'app/solicitors/courtPapers.html',
					controller: 'CourtPapersController',
					controllerAs: 'vm',
					resolve: {
						items: function () {
							return vm.solicitorsForm;
						}
					}
				}); 
					
				casePapersModalInstance.result.then(function (selectedCourtPaper) {
					vm.solicitorsForm.courtPaper = selectedCourtPaper;
					
					/////////////////////////////////////////////.
					
					$log.log("Current application number");
					
					vm.solicitorsForm.applicationNumber = vm.saveApplicationNumber;
					$log.log(vm.solicitorsForm.applicationNumber);
					vm.solicitorsForm.searchByDocketNo = null;
					vm.getCourtCases();
					
					/////////////////////////////////////////////
					
					$log.log("Returning selected court paper");
					$log.log(vm.solicitorsForm.courtPaper);
				}, function () {
					$log.log('Modal selection returned');
				});
			
			}; // End addCase
			
			
			// Function to open modal to find applications with docket number
			vm.findApplWithDocketNo = function () {
				var docketNoModalInstance = $modal.open({
					templateUrl: 'app/solicitors/listApplNumber.html',
					controller: 'ApplNumListController',
					controllerAs: 'vm',
					size: 'sm',
					resolve: {
						solicitorsForm: function () {
							return vm.solicitorsForm;
						}
					}
				}); 
					
				docketNoModalInstance.result.then(function (selectedApplication) {
					vm.solicitorsForm.applicationNumber = selectedApplication.applicationNumber.trim();
					$log.log("Returning selected application number");
					$log.log(vm.solicitorsForm.applicationNumber);
					vm.getCourtCases();
				}, function () {
					$log.log('Modal selection returned');
				});
			
			}; // End findApplWithDocketNo
			
			
			// This function will clear all the fields on the forms
			vm.clear = function() {
//				vm.solicitorsForm = {};
				if (angular.isDefined(vm.currentCase)) {
					vm.currentCase = null;
				}
				vm.solicitorsForm.docketNo = null;
				vm.solicitorsForm.palmLocation = '';
				vm.solicitorsForm.inventionTitle = '';
				vm.solicitorsForm.courtType = '';
				vm.solicitorsForm.employeeName = '';
				vm.solicitorsForm.courtCases = '';
				vm.solicitorsForm.selectedCourtType = '';
				vm.notification = {};
				vm.courtCaseValue = null;
				vm.currentCaseValue = null;
				
				if (angular.isDefined(vm.notification.showNotice)) {
					vm.notification.showNotice = false;
				}
				
				if (angular.isDefined(vm.solicitorsForm.applicationNumber)) {
					vm.solicitorsForm.applicationNumber = '';
				}
				
				if (angular.isDefined(vm.solicitorsForm.employeeNo)) {
					vm.solicitorsForm.employeeNo = '';
				}
				
			}; // End clear
			
			
			// This function will get the court cases
			vm.getCourtCases = function() {
				
				if (angular.isDefined(vm.solicitorsForm.applicationNumber)) {
					
					vm.saveApplicationNumber = angular.copy(vm.solicitorsForm.applicationNumber);
					
					if (angular.isUndefined(vm.solicitorsForm.searchByDocketNo)) {
						vm.solicitorsForm.searchByDocketNo = null;
					}
				
					SiteFactory.getActions("actions/solicitors-office/court-cases/" + vm.solicitorsForm.applicationNumber + "/" + vm.solicitorsForm.searchByDocketNo)
					.then(
						function(response) {
							
							if (CommonUtils.checkSuccess(response)) {
								vm.solicitorsForm = response;
								vm.getCourtType();
								$log.log("getCourtCase response:");
								$log.log(response);
	
							}
							
							if (response.reasonCode !== "8") {
								vm.notification = CommonUtils.setNotification(response);
							}
							
							vm.courtCaseValue = null;
							if (vm.currentCaseValue) {
								vm.currentCase = vm.solicitorsForm.courtCases[parseInt(vm.currentCaseValue)];
								vm.courtCaseValue = vm.currentCaseValue;	
							}
							

							//vm.solicitorsForm.courtCases
							//vm.currentCase.casePapers
							

							
						},
						function(response) {
							$log.log("Error" + response);
						}
					);
				
				} else if (angular.isDefined(vm.solicitorsForm.searchByDocketNo)) { 
					vm.findApplWithDocketNo();
				}
				
			}; // End getCourtCases
			
		
			// This function will add the court case details
			vm.addCourtCaseDetails = function() {
				
				prepareTransactionInput(courtCaseDetailsTransactionInput);
				
				SiteFactory.postActions(courtCaseDetailsTransactionInput, "actions/solicitors-office/court-details")
				.then(
					function(response) {

						if (CommonUtils.checkSuccess(response)) {
							
							/*var courtCase = {
								solicitorCourtInfo : courtCaseDetailsTransactionInput
							}
							
							vm.solicitorsForm.courtCases.push(courtCase);*/
							
							vm.solicitorsForm.selectedDocketNo = vm.solicitorsForm.docketNo;
							vm.solicitorsForm.docketNo = null;
							vm.courtCaseValue = null;
							vm.getCourtCases();
														
							$log.log("addCourtCases response:");
							$log.log(response);
							
							
						
						}
						
						vm.notification = CommonUtils.setNotification(response);
						$log.log(vm.courtCases);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End addCourtCases
			
			
			// This function will update the court case details
			vm.updateCourtCaseDetails = function () {
				
				prepareTransactionInput(courtCaseDetailsTransactionInput);
				
				SiteFactory.updateCourtCaseDetails(courtCaseDetailsTransactionInput, "actions/solicitors-office/court-details")
				.then(
					function(response) {
						vm.notification = CommonUtils.setNotification(response);
						
//						updateCaseModel(courtCaseDetailsTransactionInput);
						
						$log.log("updateCourtCaseDetails response:");
						$log.log(response);
						
						vm.solicitorsForm.selectedDocketNo = vm.solicitorsForm.docketNo;
						vm.solicitorsForm.docketNo = null;
						vm.courtCaseValue = null;
						vm.getCourtCases();
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
				
			}; // End updateCourtCaseDetails
			
			
			// This function will prepare the object needed to add or update court case details
			function prepareTransactionInput (courtCaseDetailsTransactionInput) {
				courtCaseDetailsTransactionInput.applicationNumber = vm.solicitorsForm.applicationNumber;
				if (angular.isUndefined(vm.solicitorsForm.selectedCourtType)) {
					courtCaseDetailsTransactionInput.courtType = null;
				} else {
					courtCaseDetailsTransactionInput.courtType = vm.solicitorsForm.selectedCourtType.codeValue;
					courtCaseDetailsTransactionInput.courtTypeDesc = vm.solicitorsForm.selectedCourtType.description;
				}
				courtCaseDetailsTransactionInput.docketNo = vm.solicitorsForm.docketNo;
				courtCaseDetailsTransactionInput.employeeNo = vm.solicitorsForm.employeeNo;
				courtCaseDetailsTransactionInput.secondaryIdentifier = vm.solicitorsForm.secondaryIdentifier;
				return courtCaseDetailsTransactionInput;
			} // End prepareTransactionInput
			
			
			// This function will update the court case table with the updated case
			function updateCaseModel(updateData) {
				angular.forEach(vm.solicitorsForm.courtCases, function(aCase) {
					if (aCase.solicitorCourtInfo.docketNo === vm.currentCase.solicitorCourtInfo.docketNo && aCase.solicitorCourtInfo.courtType===vm.currentCase.solicitorCourtInfo.courtType && 
							aCase.solicitorCourtInfo.employeeNo === vm.currentCase.solicitorCourtInfo.employeeNo) {
						aCase.solicitorCourtInfo = updateData;
					}
				});
			} // End updateCaseModel
			
			
			// This function will get the court cases
			vm.getCourtType = function() {
				SiteFactory.getActions("actions/solicitors-office/court-types/COURT_TYPE")
				.then(
					function(response) {

						vm.solicitorsForm.courtTypeList = response.ictCdValList;
						$log.log("Getting the list of court types");
						$log.log(vm.solicitorsForm.courtTypeList);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End getCourtCases
			
			vm.getCourtType();

			
			// Function to set the current case paper for the selected court case 
			vm.setCurrentPaper = function(courtCase) {
				$log.log(courtCase);
				vm.currentCase = courtCase;
				vm.currentCaseValue = vm.courtCaseValue;
				vm.solicitorsForm.docketNo = courtCase.solicitorCourtInfo.docketNo;
				vm.solicitorsForm.courtTypeDesc = courtCase.solicitorCourtInfo.courtTypeDesc;
				
//				vm.solicitorsForm.selectedCourtType = courtCase.solicitorCourtInfo.courtTypeDesc;
				
				vm.solicitorsForm.courtTypeList.forEach(function(obj) {
					if (obj.description === courtCase.solicitorCourtInfo.courtTypeDesc) {
						
//						obj.description=courtCase.solicitorCourtInfo.courtTypeDesc;
						vm.solicitorsForm.selectedCourtType = obj;
						//return vm.solicitorsForm.selectedCourtType;
					}
		
				});
				
				
//				vm.solicitorsForm.courtTypeDesc = courtCase.solicitorCourtInfo.courtTypeDesc;
				vm.solicitorsForm.employeeNo = courtCase.solicitorCourtInfo.employeeNo;
				vm.solicitorsForm.secondaryIdentifier = courtCase.solicitorCourtInfo.secondaryIdentifier;
				//vm.getCourtType();
			}; // End setCurrentPaper
						
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.getCourtCases();
				}
			}; // End searchKeyEvent
			
			
			
			
			
			
			
			
						
		}); // End SolicitorsController

})();