(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('blueSlip1Controller',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS) {
		
			var vm = this;

			vm.show = false;
			
			vm.showAttorney = false;

			
			vm.companies = [];
			vm.attorneys = [];
			vm.addRow = function(){		
				vm.companies.push({ 'name':vm.name, 'residence': vm.residence, 'category':vm.category });
				vm.name='';
				vm.residence='';
				vm.category='';
				vm.show = false;
			};
			vm.addRowAttorney = function(){		
				vm.attorneys.push({ 'name':vm.attorney, 'firm': vm.firm});
				vm.attorney='';
				vm.firm='';
				vm.showAttorney = false;
			};
			
			vm.getfeeInfo = function(){
				vm.appNo = '59483';
				vm.filingDate = 'hi';
				vm.investor = 'hi';
				vm.docketNo = 'hhi';
				vm.confirmationNo = 'hi';
				vm.appType = 'hi';
				vm.status = 'hi';
				vm.issueFee = 'hi';
				vm.pubFee= 'hi';
				vm.prevPay= 'hi';
				vm.totalFee = 'hi';
				vm.dateDue = 'hi';
				vm.Examiner = 'hi';
				vm.artUnit = 'hi';
				vm.classSub  = 'hi';
			};
			
			vm.add = function(){
				vm.show = true;
			};
			vm.addAttorney = function(){
				vm.showAttorney = true;
			};
			vm.Delete = function (index) {
			    vm.companies.splice(index, 1);
			};
			vm.DeleteAttorney = function (index) {
			    vm.attorneys.splice(index, 1);
			};
			vm.clear = function(){
				delete vm.applicationNo;
				delete vm.appNo;
				delete vm.filingDate;
				delete vm.investor; 
				delete vm.docketNo;
				delete vm.confirmationNo;
				delete vm.appType; 
				delete vm.status;
				delete vm.issueFee;
				delete vm.pubFee;
				delete vm.prevPay;
				delete vm.totalFee;
				delete vm.dateDue; 
				delete vm.Examiner; 
				delete vm.artUnit; 
				delete vm.classSub;
				delete vm.companies;
				delete vm.attorneys;
				delete vm.attorney;
				delete vm.firm;
				delete vm.change,
				delete vm.feeAddress;
				vm.show = false;
				delete vm.issFee;
				delete vm.publicationFee;
				delete vm.copies;
				delete vm.checkEnclosed;
				delete vm.payCredit;
				delete vm.authorize;
				delete vm.micro;
				delete vm.entSmall;
				delete vm.entReg;
				vm.showAttorney = false;
				
				
			};
				
			//This function will get NOA information associated with application number
		
			
		}); // End AppealsController

})();