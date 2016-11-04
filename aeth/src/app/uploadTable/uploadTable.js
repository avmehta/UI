(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('uploadTableController',
			function($compile, $filter, $window, $log, $scope,$http) {
		
			var vm = this;
			vm.title = "Uploading a CSV Table"
				
				

				vm.upload = function () {
			    var fileUpload = document.getElementById("fileUpload");
				            var reader = new FileReader();
				            reader.onload = function (e) {
				                var lines = e.target.result.split("\n");
				                var result = [];
				                var headers = lines[0].split(',');
				                for(var i = 1;i<lines.length;i++){
				                	var obj = {};
				                	var currentline = lines[i].split(',');
				                	
				                	for(var j = 0;j < headers.length; j++){
				                		obj[headers[j]] = currentline[j];
				                	}
				                	
				                	
				                	result.push(obj);
				                	
				                }
				                vm.head = headers;
				                vm.data = result;
				                
				             console.log(result);
				             console.log(headers)	
				             console.log(fileUpload.files[0])
				            }
				            reader.readAsText(fileUpload.files[0]);
				            vm.display = true;
				            vm.editTable = false
				            
				};
				
	
	
			vm.edit = function() {
				vm.display = false;
				vm.editTable = true;
				
				
			};
			vm.save = function() {
				
				
				
			};
			
			
			
						
		}); // End excelController

})();