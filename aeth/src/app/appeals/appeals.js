(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('AppealsController',
			function($compile, $filter, $window, $log) {
		
			var vm = this;
			vm.title = "Uploading a CSV file"

			
			//Put your code below here
			
				vm.upload = function () {
				    var fileUpload = document.getElementById("fileUpload");
				    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
				    if (regex.test(fileUpload.value.toLowerCase())) {
				        if (typeof (FileReader) != "undefined") {
				            var reader = new FileReader();
				            reader.onload = function (e) {
				                var table = document.createElement("table");
				                console.log(e.target.result)
				                var rows = e.target.result.split("\n");
				                for (var i = 0; i < rows.length; i++) {
				                    var row = table.insertRow(-1);
				                    var cells = rows[i].split(",");
				                    for (var j = 0; j < cells.length; j++) {
				                       var cell = row.insertCell(-1);
				                       var t = document.createElement("input");

				                       cell.innerHTML = cells[j];
				                       
					                    cell.style.border = "1px solid black"

				                    }
				                }
				                var dvCSV = document.getElementById("dvCSV");
				                dvCSV.innerHTML = "";
				                dvCSV.appendChild(table);
				            }
				            $log.log(reader.readAsText(fileUpload.files[0]));
				            reader.readAsText(fileUpload.files[0]);
				        } else {
				            alert("This browser does not support HTML5.");
				        }
				    } else {
				        alert("Please upload a valid CSV file.");
				    }
				};
			
			
			
			
			
			
			// Don't put any code below here
			
						
		}); // End AppealsController

})();