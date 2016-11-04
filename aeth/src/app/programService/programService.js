(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('programServiceController',
			function($compile, $filter, $window, $log, SiteFactory, CommonUtils, CONSTANTS, $http) {
		
			var vm = this;
			vm.postObj = [];
/*			vm.show = false;
			
			vm.showAttorney = false;*/

/*			vm.companies = [
			                    { 'name':'Infosys Technologies',
			                    	'employees': 125000,
			                    	'headoffice': 'Bangalore'},
			                    	{ 'name':'Cognizant Technologies',
				                    	'employees': 100000,
				                    	'headoffice': 'Bangalore',
				                    	'columns': 7851},
				                    	{ 'name':'Wipro',
					                    	'employees': 115000,
					                    	'headoffice': 'Bangalore',
					                    	'columns': 5984},
					                    	{ 'name':'Tata Consultancy Services (TCS)',
						                    	'employees': 150000,
						                    	'headoffice': 'Bangalore',
						                    	'columns':3684},
						                    	{ 'name':'HCL Technologies',
							                    	'employees': 90000,
							                    	'headoffice': 'Noida',
							                    	'columns': 3634},
			                    ];*/
			
/*		    $http({
			      url:"http://localhost:5000/hi",
			      method: "GET",
			      data: JSON.stringify(dataset)
			    }).success(function(data) {})*/
			
			$http.get("http://localhost:8080/DATAModernizationServices/program-services").then(function(response){
				vm.companies = response.data;
				console.log(vm.companies)
			
			});
			$http.get("http://localhost:8080/DATAModernizationServices/data-elements").then(function(response){
				vm.dataelement = response.data;
			
			});
			$http.get("http://localhost:8080/DATAModernizationServices/table-columns").then(function(response){
				vm.col = response.data;
			
			});
			
			
			vm.populate1 = function(){
				vm.programSource = vm.program;
				vm.dataElement = [];
				for (var i = 0; i < vm.dataelement.length;i++){
					if (vm.program.description === vm.dataelement[i].programServiceInfo.description){
						vm.dataElement.push(vm.dataelement[i].description)
					}
				}

			};
			vm.populate2 = function(){
				vm.tableCol = [];
				for (var j=0;j<vm.col.length;j++){
					var colstring = '';
					if (vm.element.includes(vm.col[j].dataElement.description)){
						colstring = colstring.concat(vm.col[j].tableColumnId, " ", vm.col[j].instanceName," ",vm.col[j].schemaName," ", vm.col[j].tableName," ",vm.col[j].columnName);
						console.log(colstring)
						vm.tableCol.push(colstring)
					}
				}
			};
			vm.clear = function(){
				delete vm.dataelement
				delete vm.col
				delete vm.dataElement;
				delete vm.programSource;
				delete vm.tableCol;
				delete vm.element;
				delete vm.column;
				delete vm.source;
				delete vm.program;
				
			};
/*			vm.submit = function(){
				vm.obj = []
				vm.obj.push({'name':vm.program.name})
				vm.obj.push({'source':vm.source.source})
				vm.obj.push({'element':vm.element})
				vm.obj.push({'column':vm.column.col})
				console.log(vm.obj)
				
			};*/
			vm.clearPost = function(){
				delete vm.elementID;
				delete vm.programID;
				delete vm.sourceID;
				delete vm.element;
				delete vm.elementVal;
				delete vm.elementVal;
				delete vm.dataElementPost;
				delete vm.tablecolPost;
				delete vm.tablekeyVal;
				delete vm.previousdataelementVal;
				delete vm.currentdataelementVal;
				delete vm.actionType;
			};
			vm.submitPost = function(){
				vm.postObj = {}
				vm.postObj.keyElement  = {}
				vm.postObj.keyElement.description = vm.elementID
				vm.postObj.sourceSystem  = {}
				vm.postObj.sourceSystem.description = vm.sourceID
				vm.postObj.programService  = {}
				vm.postObj.programService.description = vm.programID
				vm.postObj.keyElementValueTx = vm.elementVal
/*				vm.postObj.push({'keyElement':{"description":vm.elementID}})
				vm.postObj.push({'sourceSystem':{"description":vm.sourceID}})
				vm.postObj.push({'programService':{"description":vm.programID}})
				vm.postObj.push({'keyElementValueTx':{"description":vm.elementVal}})
*/				$http.post("http://localhost:8080/DATAModernizationServices/history-capture/data-events", vm.postObj).then(function(response){
					console.log(vm.postObj)
					
				});
				
			};
		/*	vm.attorneys = [];
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
				
				
			};*/
				
			//This function will get NOA information associated with application number
		
			
		}); // End AppealsController

})();