(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('ListEmployeeController',
			function($modalInstance, $log, SiteFactory, CommonUtils) {
		
			var vm = this;
			
			vm.workersList = {};
			vm.findWorker = [];
			
			// Function to dismiss the modal
			vm.cancel = function () {
				$modalInstance.dismiss('cancel');
			}; // End cancel
			
			// Function to select the items in the modal
			vm.select = function () {
				$modalInstance.close(vm.solicitorsForm.selectedEmployee);
			}; // End select
			
			// This function will get the list of workers
			vm.getWorkers = function() {
				SiteFactory.getActions("actions/solicitors-office/workers")
				.then(
					function(response) {

						vm.workersList = response.workerList;
						vm.findWorker = vm.workersList.familyName;
						$log.log("Retrieving the worker list:");
						$log.log(vm.workersList);
					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			}; // End getWorkers
			
			vm.getWorkers();
			
		
			// Function to set the current case paper for the selected court case 
			vm.setCurrentEmployee = function(worker) {
				$log.log(worker);
				vm.solicitorsForm.selectedEmployee = worker;
			}; // End setCurrentPaper
			
						
		}); // End AppealsController

})();