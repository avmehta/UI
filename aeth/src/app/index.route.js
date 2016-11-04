(function() {
	'use strict';

	angular.module('actionEngine').config(routeConfig);

	function routeConfig($routeProvider) {
		$routeProvider.when('/incoming', {
			templateUrl : 'app/incoming/incomingCorrespondence.html',
			controller : 'IncomingCorrController',
			controllerAs : 'vm'
		}).when('/outgoing', {
			templateUrl : 'app/outgoing/outgoingMail.html',
			controller : 'OutgoingMailController',
			controllerAs : 'vm'
		}).when('/caseaction', {
			templateUrl : 'app/caseaction/caseAction.html',
			controller : 'CaseActionController',
			controllerAs : 'vm'
		}).when('/preappeals', {
			templateUrl : 'app/preappeals/preAppeals.html',
			controller : 'PreAppealsController',
			controllerAs : 'vm'
		}).when('/appeals', {
			templateUrl : 'app/appeals/appeals.html',
			controller : 'AppealsController',
			controllerAs : 'vm'
		}).when('/adjustments', {
			templateUrl : 'app/patent_term_adj/patentTermAdj.html',
			controller : 'PTAController',
			controllerAs : 'vm'
		}).when('/extensions', {
			templateUrl : 'app/patent_term_ext/patentTermExt.html',
			controller : 'PTEController',
			controllerAs : 'vm'
		}).when('/withdrawl', {
			templateUrl : 'app/withdrawl/withdrawl.html',
			controller : 'WithdrawlController',
			controllerAs : 'vm'
		}).when('/petitions', {
			templateUrl : 'app/petitions/petitions.html',
			controller : 'PetitionsController',
			controllerAs : 'vm'
		}).when('/unlock', {
			templateUrl : 'app/unlock/unlock.html',
			controller : 'UnlockController',
			controllerAs : 'vm'
		}).when('/reExam', {
			templateUrl : 'app/reExam/reExam.html',
			controller : 'ReExamController',
			controllerAs : 'vm'
		}).when('/crf', {
			templateUrl : 'app/crf/crf.html',
			controller : 'CrfController',
			controllerAs : 'vm'
		}).when('/solicitor', {
			templateUrl : 'app/solicitors/solicitors.html',
			controller : 'SolicitorsController',
			controllerAs : 'vm'
		}).when('/generaldispatch', {
			templateUrl : 'app/dispatch/generalDispatch.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/receive', {
			templateUrl : 'app/dispatch/receive.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/dispatchtolocation', {
			templateUrl : 'app/dispatch/dispatchToLocation.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/dispatchtoemployee', {
			templateUrl : 'app/dispatch/dispatchToEmployee.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/dispatchpcttogau', {
			templateUrl : 'app/dispatch/dispatchPCTToGAU.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/dispatchboxtolocation', {
			templateUrl : 'app/dispatch/dispatchBoxToLocation.html',
			controller : 'DispatchController',
			controllerAs : 'vm'
		}).when('/noa', {
			templateUrl : 'app/noa/noa.html',
			controller : 'NoaController',
			controllerAs : 'vm'
		}).when('/creditCalculator', {
			templateUrl : 'app/creditCalculator/creditCalculator.html',
			controller : 'creditController',
			controllerAs : 'vm'
		}).when('/timeRecord', {
			templateUrl : 'app/timeRecord/timeRecord.html',
			controller : 'timeController',
			controllerAs : 'vm'
		}).when('/excel', {
			templateUrl : 'app/excel/excel.html',
			controller : 'excelController',
			controllerAs : 'vm'
		}).when('/uploadTable', {
			templateUrl : 'app/uploadTable/uploadTable.html',
			controller : 'uploadTableController',
			controllerAs : 'vm'
		}).when('/editTable', {
			templateUrl : 'app/editTable/editTable.html',
			controller : 'editTableController',
			controllerAs : 'vm'
		}).when('/fee', {
			templateUrl : 'app/fee/fee.html',
			controller : 'feeController',
			controllerAs : 'vm'
		}).when('/finalEdit', {
			templateUrl : 'app/finalEdit/finalEdit.html',
			controller : 'finalEditController',
			controllerAs : 'vm'
		}).when('/scroll', {
			templateUrl : 'app/scroll/scroll.html',
			controller : 'scrollController',
			controllerAs : 'vm'
		}).when('/searchDisplay', {
			templateUrl : 'app/searchDisplay/searchDisplay.html',
			controller : 'searchController',
			controllerAs : 'vm'
		}).when('/programService', {
			templateUrl : 'app/programService/programService.html',
			controller : 'programServiceController',
			controllerAs : 'vm'
		}).when('/blueSlip1', {
			templateUrl : 'app/blueSlip1/blueSlip1.html',
			controller : 'blueSlip1Controller',
			controllerAs : 'vm'
		}).when('/blueSlip2', {
			templateUrl : 'app/blueSlip2/blueSlip2.html',
			controller : 'blueSlip2Controller',
			controllerAs : 'vm'
		}).otherwise({
			redirectTo : '/programService'
		});
	}

})();
