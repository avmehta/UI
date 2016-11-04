(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('ApplNumListController',
			function($modalInstance, $log, SiteFactory, CommonUtils, solicitorsForm) {
		
			var vm = this;
			
			vm.solicitorsForm = solicitorsForm;
			
			// Function to dismiss the modal
			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			}; // End cancel
			
			// Function to select the items in the modal
			vm.select = function () {
				$modalInstance.close(vm.solicitorsForm);
			}; // End select
			
			// This function will get the list of applications
			vm.getApplications = function() {
				SiteFactory.getActions("actions/solicitors-office/court-case-applications/" + vm.solicitorsForm.searchByDocketNo)
				.then(
					function(response) {
						vm.applicationList = response.solicitorApplications;
						$log.log("Retrieving the application list:");
						$log.log(vm.applicationList);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End getApplications
			
			vm.getApplications();
			
		
			// Function to set the current case paper for the selected court case 
			vm.setCurrentApplication = function(application) {
				$log.log("Selected application number:");
				$log.log(application);
				vm.solicitorsForm.applicationNumber = application;
			}; // End setCurrentPaper
			
						
		}); // End AppealsController

})();