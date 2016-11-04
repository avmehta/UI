(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('scrollController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;

			vm.show = false;
			vm.showC = false;
			vm.showA = false;
			
			vm.showAttorney = false;
			vm.companies = [];
			vm.attorneys = [];
			vm.companies1 = [];
			vm.attorneys1 = [];
			vm.addRow = function(){	
/*				if (vm.companies.length < 4){
				vm.companies.push({ 'name':vm.name, 'residence': vm.residence});
				}
				else{
				vm.companies1.push({ 'name':vm.name, 'residence': vm.residence});
				}*/
				vm.name='';
				vm.residence='';
				vm.show = false;
			};
			vm.addRowAttorney = function(){		
/*				if (vm.attorneys.length < 4){
				vm.attorneys.push({ 'name':vm.attorney, 'firm': vm.firm});
				}
				else{
				vm.attorneys1.push({ 'name':vm.attorney, 'firm': vm.firm});
				}*/
				vm.attorney='';
				vm.firm='';
				vm.showAttorney = false;
			};
/*			vm.showAllA = function(){
				vm.showA = true;
			
			};
			vm.showAllC = function(){
				vm.showC = true;
			
			};*/
	
			vm.add = function(){
				vm.show = true;
			};
			vm.addAttorney = function(){
				vm.showAttorney = true;
			};
			vm.clear = function(){
				vm.showA = false;
				vm.showC = false;
				delete vm.companies;
				delete vm.attorneys;
				vm.show = false;
				vm.showAttorney = false;
				
				
			};
				
			//This function will get NOA information associated with application number
		
			
		}); // End AppealsController

})();