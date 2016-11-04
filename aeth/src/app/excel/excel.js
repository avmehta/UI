(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('excelController',
			function($compile, $filter, $window, $log, $scope,$http) {
		
			var vm = this;
			vm.title = "Uploading a CSV file"

/*			$scope.readCSV = function() {
			    var fileUpload = document.getElementById("fileUpload");
			    var reader = new FileReader();
			    reader.readAsText(fileUpload)
			    reader.then(processData);
			    
			    $http.get('C:/Users/amehta2/Documents/book1.csv').then($scope.processData);
			};
			$scope.processData = function(allText) {
				// split content based on new line
				var allTextLines = allText.split(/\r\n|\n/);
				var headers = allTextLines[0].split(',');
				console.log(headers)
				var lines = [];

				for ( var i = 0; i < allTextLines.length; i++) {
					// split content based on comma
					var data = allTextLines[i].split(',');
					if (data.length == headers.length) {
						var tarr = [];
						for ( var j = 0; j < headers.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
				}
				$scope.data = lines;
			};		*/	
				vm.upload = function () {
				    var fileUpload = document.getElementById("fileUpload");
				    var lines = [];
				            var reader = new FileReader();
				            reader.onload = function (e) {
				                var rows = e.target.result.split("\n");
				                var headers = rows[0].split(',');
				                for (var i = 0; i < rows.length; i++) {
				                    var data = rows[i].split(",");
				                    

				                    var tarr = [];
				                    for ( var j = 0; j < headers.length; j++) {
				                        tarr.push(data[j]);
				                    }
				                    lines.push(tarr);
				                    console.log(tarr);

				                 
				                }
				                console.log(lines);
					            vm.name = lines;
					            

				            }
				            reader.readAsText(fileUpload.files[0]);

				};
			
	
			
			
			
			
			
						
		}); // End excelController

})();