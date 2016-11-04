(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('NoaController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;
			vm.noaForm = {};
			vm.noaForm.addressInfo = {};

			
			//This function will get NOA information associated with application number
			vm.getNoaInfo=function(){
				vm.isLoading=true;
				NProgress.start();
				SiteFactory.getActions("actions/noa/" + vm.noaForm.applicationNo)
				.then(
					function(response) {

						if (CommonUtils.checkSuccess(response)) {
							
							vm.noaForm = response.noticeOfAllowanceInfo;
							$log.log("Notice of allowance information: ");
							$log.log(response);
							
						}
						
						NProgress.done();
						vm.isLoading=false;
						vm.notification = CommonUtils.setNotification(response);

					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			
				
				
			}; // End getNoaInfo
			
			
			//This function will get the address information associated with a customer number
			vm.getCustomerInfo=function(){
				/*vm.isLoading=true;
				NProgress.start();
				SiteFactory.getActions("actions/noa/" + vm.noaForm.applicationNo)
				.then(
					function(response) {

						if (CommonUtils.checkSuccess(response)) {
							
							vm.noaForm = response.noticeOfAllowanceInfo;
							$log.log("Notice of allowance information: ");
							$log.log(response);
							
						}
						
						NProgress.done();
						vm.isLoading=false;
						vm.notification = CommonUtils.setNotification(response);

					},
					function(response) {
						$log.log("Error" + response);
					}
				);
			
				
				*/
			}; // End getCustomerInfo
			
			// Function to allow pressing enter to search
			vm.searchKeyEvent = function($event) {
				if ($event.keyCode === CONSTANTS.ENTER_KEY) {
					vm.getNoaInfo();
				}
			}; // End searchKeyEvent
			
		}); // End AppealsController

})();