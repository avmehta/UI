(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('CourtPapersController',
			function($modalInstance, $log, SiteFactory, CommonUtils, items) {
		
			var vm = this;
			vm.solicitorsForm = items;
			vm.radioOptions = {};
			var solicitorTransactionInput = {};
			
			
			// Function to dismiss the modal
			vm.cancel = function () {
				vm.solicitorsForm.courtPapersMailDate = '';
				$modalInstance.dismiss('cancel');
			}; // End cancel
			
			// Function to select the items in the modal
			vm.select = function () {
				solicitorTransactionInput.applicationNumber = vm.solicitorsForm.applicationNumber;
				solicitorTransactionInput.mailRoomDate = CommonUtils.convertDateFormat(vm.solicitorsForm.courtPapersMailDate);
				solicitorTransactionInput.actionDate = CommonUtils.convertDateFormat(vm.solicitorsForm.courtPapersMailDate);
				solicitorTransactionInput.inOutIndicator = vm.solicitorsForm.inOutIndicator;
				solicitorTransactionInput.selectedActionCd = vm.solicitorsForm.selectedActionCd;
				solicitorTransactionInput.solicitorCourtInfo = {};
				solicitorTransactionInput.solicitorCourtInfo.applicationNumber = vm.solicitorsForm.applicationNumber;
				solicitorTransactionInput.solicitorCourtInfo.courtType = vm.solicitorsForm.courtType;
				solicitorTransactionInput.solicitorCourtInfo.docketNo = vm.solicitorsForm.docketNo;
				solicitorTransactionInput.solicitorCourtInfo.employeeNo = vm.solicitorsForm.employeeNo;
				solicitorTransactionInput.solicitorCourtInfo.secondaryIdentifier = vm.solicitorsForm.secondaryIdentifier;
				solicitorTransactionInput.solicitorCourtInfo.courtTypeDesc = vm.solicitorsForm.courtTypeDesc;
				
				SiteFactory.postActions(solicitorTransactionInput, 'actions/solicitors-office')
				.then(
					function(response) {

						if (CommonUtils.checkPositiveStatus(response)) {
							$modalInstance.close(vm.solicitorsForm.courtPaper);
						}
						
						$log.log(response.messageDesc);
						vm.notification = CommonUtils.setNotification(response);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End select
//				$modalInstance.close(vm.solicitorsForm.courtPaper);
			
			
			// This function will get the court cases
			vm.getOptions = function() {
				SiteFactory.getActions("actions/solicitors-office/court-types/COURT_PAPER_LABEL")
				.then(
					function(response) {

						vm.radioOptions = response.ictCdValList;
						$log.log("Getting the list of court papers");
						$log.log(vm.radioOptions);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End getCourtCases
			
			vm.getOptions();
			
			vm.solicitorsForm.postingDate = CommonUtils.convertDateFormat(vm.solicitorsForm.courtPapersMailDate);
			$log.log(vm.solicitorsForm.postingDate);
			
						
		}); // End AppealsController

})();