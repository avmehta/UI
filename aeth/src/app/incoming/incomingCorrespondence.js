(function() {
	
	'use strict';
	
	angular
		.module('actionEngine')
		.controller('IncomingCorrController',
				function($compile, $filter, $log, NgTableParams, SiteFactory, CommonUtils, CONSTANTS) {
				
				var vm = this;
				
				var data = [];
				var index=0;
				
				vm.notification = {};
	
		// This function retrieves a list of incoming actions		
		vm.getIncomingActionList = function() {
			SiteFactory.getActions('actions/incoming')
			.then(
				function(response) {
					vm.actionGlobalList = response.standardActionList;
					vm.actionList = response.standardActionList;
				},
				function(response) {
					$log.log(response);
				}
			);
		}; // End getIncomingActionList
		
		vm.getIncomingActionList();
		
				
		var timeGrantedOptions=[];
		var timeGrant={};
		
		timeGrant.value='0';
		timeGrant.code='<NONE>';	
		timeGrantedOptions[0]=timeGrant;
		
		timeGrant={};
		timeGrant.value='1';
		timeGrant.code='1 Month';	
		timeGrantedOptions[1]=timeGrant;
		
		timeGrant={};
		timeGrant.value='2';
		timeGrant.code='2 Months';	
		timeGrantedOptions[2]=timeGrant;
		
		timeGrant={};
		timeGrant.value='3';
		timeGrant.code='3 Months';	
		timeGrantedOptions[3]=timeGrant;
		
		timeGrant={};
		timeGrant.value='4';
		timeGrant.code='4 Months';	
		timeGrantedOptions[4]=timeGrant;
		
		timeGrant={};
		timeGrant.value='5';
		timeGrant.code='5 Months';	
		timeGrantedOptions[5]=timeGrant;
		
		vm.timeGrantedOptions=timeGrantedOptions;
		
		// This function will get the selected action description
		vm.getSeletedActionDesc= function(){
			var descFound=false;
			var tempActionList = [];
			var j=0;
			for (var i = 0; i < vm.actionList.length; i++) {
				
				if(vm.incomingForm.postingTransaction==vm.actionList[i].transactionNo){
					vm.incomingForm.actionSelected=vm.actionList[i].contentEventCd;
					vm.incomingForm.actionDesc=vm.actionList[i].descriptionTx;
					descFound=true;
					tempActionList[j]=vm.actionList[i];
					j++;
					
					vm.transRespTable=false;
					if(vm.actionList[i].responseIn=='Y'){
						vm.respondTransactionData='';
						vm.transRespTable=true;
					}
				}
			}	
			
			if(tempActionList.length>0){
				
				tempActionList.sort(function(a, b){
					return a.transactionQualifier > b.transactionQualifier;
				});
				
			
			if(angular.isDefined(tempActionList[0].transactionQualifier)) {
				vm.qualifierList=tempActionList;
			vm.incomingForm.transactionQualifier=tempActionList[0].transactionQualifier;
			}else{
				vm.qualifierList='';
				vm.incomingForm.transactionQualifier='';
			}
			}
			if(!descFound){
				vm.incomingForm.actionSelected='';
				vm.incomingForm.actionDesc='';
			
				vm.incomingForm.errorFound=true;
				vm.incomingForm.errorMsg='Please enter correct Transaction Number';
			}else{
				vm.incomingForm.errorFound=false;
				vm.incomingForm.errorMsg='';
			}
			
		}; // End getSeletedActionDesc
		
		// This function will get a list of selected qualifiers 		
		vm.getSeletedQualifierDesc= function(){
			var descFound=false;

			for (var i = 0; i < vm.actionList.length; i++) {
				
				if((vm.incomingForm.postingTransaction==vm.actionList[i].transactionNo) && 
						(vm.incomingForm.transactionQualifier==vm.actionList[i].transactionQualifier)
					){
					vm.incomingForm.actionSelected=vm.actionList[i].contentEventCd;
					vm.incomingForm.actionDesc=vm.actionList[i].descriptionTx;
					//vm.incomingForm.transactionQualifier=vm.actionList[i].transactionQualifier;
					descFound=true;
					
					break;
				}
			}	
			
			if(!descFound){
				vm.incomingForm.actionSelected='';
				vm.incomingForm.actionDesc='';
			}
			
		}; // End getSeletedQualifierDesc
		
		// This function will get a list of the selected action number
		vm.getSeletedActionNo= function(){
			var tempActionList = [];
			var j=0;
			for (var i = 0; i < vm.actionList.length; i++) {
				
				if( vm.incomingForm.actionSelected==vm.actionList[i].contentEventCd){
					vm.incomingForm.postingTransaction=vm.actionList[i].transactionNo;
					vm.incomingForm.actionDesc=vm.actionList[i].descriptionTx;
					tempActionList[j]=vm.actionList[i];
					j++;
					vm.qualifierList=tempActionList;
					if(angular.isDefined(vm.actionList[i].transactionQualifier)){
					vm.incomingForm.transactionQualifier=vm.actionList[i].transactionQualifier;
					}else{					
							vm.incomingForm.transactionQualifier='';					
					}
					vm.transRespTable=false;
					if(vm.actionList[i].responseIn=='Y'){
						vm.respondTransactionData='';
						vm.transRespTable=true;
					}
					break;
				}
			}	
			
		}; // End getSeletedActionNo
		
		
		// This function will get a list of responsive action details
		vm.getRespActionsDetails= function(){
			var incomingTransactionInput={};
			incomingTransactionInput.applicationNumber=vm.incomingForm.applicationNumber;

			vm.responseActionDetail = function() {
				SiteFactory.responseActionDetails(incomingTransactionInput.applicationNumber, 'actions/incoming/awaiting-responses/')
				.then(
					function(response) {
						var data=response;
						
						for (var i = 0; i < data.length; i++) {				
							var formatedDate= CommonUtils.convertDateFormat(data[i].recordedDt);				 
							data[i].recordedDt =formatedDate;						
						}
						vm.respondTransactionData = data.respondActions;
						

						vm.respondTransactionTableParams = new NgTableParams(
								{
									page : 1, // show first page
									count : 10 // count per page
								},
								{
									total : data.length, // length of data
									getData : function($defer, params) {
										// use built-in angular filter
										var filteredData = params.filter() ? $filter(
												'filter')
												(data, params.filter())
												: data;
										var orderedData = params.sorting() ? $filter(
												'orderBy')(filteredData,
												params.orderBy())
												: data;

										params.total(orderedData.length); // set total for recalc pagination
										$defer
												.resolve(orderedData
														.slice(
																(params.page() - 1) * 
																		params
																				.count(),
																params.page() * 
																		params
																				.count()));
									}
								});
					},
					function(response, data) {
						$log.log("failure message: " + angular.toJson({data: data}));
					}
				);
			};
			
			vm.responseActionDetail();
			

		}; // End getRespActionsDetails
		
		// This function will clear all fields
		vm.clear = function(){
			vm.incomingForm.postingTransaction='';
			vm.incomingForm.transactionQualifier='';
			vm.incomingForm.actionSelected='';
			vm.incomingForm.mailRoomDate='';
			vm.incomingForm.applicationNumber='';
			vm.incomingForm.extnTime=false;
			vm.incomingForm.timeGranted='';
			vm.incomingForm.certificateMailDate='';
			vm.incomingForm.examinerNo='';
			vm.incomingForm.gau='';
			vm.incomingForm.errorFound=false;
			vm.incomingForm.successFound=false;
			vm.incomingForm.warningFound=false;
			vm.transRespTable=false;
			vm.respondTransactionData='';
			
			if (angular.isDefined(vm.notification.showNotice)) {
				vm.notification.showNotice = false;
			}
			
		}; // End clear
		
		// This function will post the actions
		vm.postAction = function(){

//		vm.incomingForm.errorFound=false;
//		vm.incomingForm.successFound=false;
		vm.notification.showNotice = false;
		
		var incomingTransactionInput={};
		incomingTransactionInput.applicationNumber=vm.incomingForm.applicationNumber;
		if(angular.isDefined(vm.incomingForm.mailRoomDate)){
			var mailRoomDate = new Date(vm.incomingForm.mailRoomDate);
			mailRoomDate.setUTCHours($filter('date')(Date.now(), 'HH'), $filter('date')(Date.now(), 'mm'), $filter('date')(Date.now(), 'ss'));
			mailRoomDate = $filter('date')(mailRoomDate, 'MM/dd/yyyy'); 
			
			incomingTransactionInput.mailRoomDate=mailRoomDate;
			incomingTransactionInput.actionDate=mailRoomDate;
			
		}
		
		if(angular.isDefined(vm.incomingForm.certificateMailDate)){
			var certificateMailDate = new Date(vm.incomingForm.certificateMailDate);
			certificateMailDate.setUTCHours($filter('date')(Date.now(), 'HH'), $filter('date')(Date.now(), 'mm'), $filter('date')(Date.now(), 'ss'));
			certificateMailDate = $filter('date')(certificateMailDate, 'MM/dd/yyyy');
			
			incomingTransactionInput.certificateMailDate=certificateMailDate;
		}
		
		if(angular.isDefined(vm.selectedRow1)){
			var parentDetails= angular.fromJson(vm.selectedRow1);
			incomingTransactionInput.sequenceNo=parentDetails.seqNo;
			incomingTransactionInput.parentPostingTransaction=parentDetails.contentEventCd;
			
		}
		for (var i = 0; i < vm.actionList.length; i++) {
			
			if(vm.incomingForm.actionSelected==vm.actionList[i].contentEventCd){
				incomingTransactionInput.postingTransaction=vm.actionList[i].contentEventCd;
				vm.incomingForm.actionDesc=vm.actionList[i].descriptionTx;
				break;
			}
		}	
		
		incomingTransactionInput.extendable=vm.incomingForm.extnTime;
		incomingTransactionInput.extnPeriodNo=vm.incomingForm.timeGranted;
		incomingTransactionInput.extnPeriodNoCd='M';
		incomingTransactionInput.examiner=vm.incomingForm.examinerNo;
		incomingTransactionInput.gau=vm.incomingForm.gau;

		
//		$http
//		//"rest/actionEngineTH/postAction"
//		.post("http://opsg.sit.uspto.gov/ActionEngineServices/aeServices/postActions", incomingTransactionInput)
//		.success(function(response) {
			

			SiteFactory.postActions(incomingTransactionInput, 'actions/incoming')
			.then(
				function(response) {
//					if(response.errorCode=='1' || response.errorCode=='2'){						
					if (CommonUtils.checkPositiveStatus(response)) {
						
						var transactionLog={};
						transactionLog.applId=vm.incomingForm.applicationNumber;
						transactionLog.desc=vm.incomingForm.postingTransaction+' :: '+vm.incomingForm.actionDesc;
						vm.clear();
						
						data[index]=transactionLog;
						index++;
						
						vm.data = data;

						vm.tableParams = new NgTableParams(
								{
									page : 1, // show first page
									count : 10
								// count per page
								},
								{
									total : data.length, // length of data
									getData : function($defer, params) {
										// use built-in angular filter
										var filteredData = params.filter() ? $filter(
												'filter')
												(data, params.filter())
												: data;
										var orderedData = params.sorting() ? $filter(
												'orderBy')(filteredData,
												params.orderBy())
												: data;

										params.total(orderedData.length); // set total for recalc pagination
										$defer
												.resolve(orderedData
														.slice(
																(params.page() - 1) * 
																		params
																				.count(),
																params.page() * 
																		params
																				.count()));
									}
								});
						
						} 
					
					vm.notification = CommonUtils.setNotification(response);
					
					/*if (response.errorCode=='1') {
						vm.incomingForm.successFound=true;
						vm.incomingForm.successMsg=response.messageDesc;
					}else if (response.errorCode=='2') {
							vm.incomingForm.warningFound=true;
							vm.incomingForm.warningMsg=response.messageDesc;
						}else{
							vm.incomingForm.errorFound=true;
							vm.incomingForm.successFound=false;
							vm.incomingForm.warningFound=false;
							vm.incomingForm.errorMsg=response.messageDesc;
						}*/
				},
				function(response, data) {
					alert("failure message: " + angular.toJson({data: data}));
				}
			);



	}; // End postAction
	
	// Function to allow pressing enter to search
	vm.searchKeyEvent = function($event) {
		if ($event.keyCode === CONSTANTS.ENTER_KEY) {
			vm.postAction();
		}
	}; // End searchKeyEvent

	}); // End IncomingCorrController

})();