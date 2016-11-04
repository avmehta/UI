(function() {
	'use strict';
	angular
		.module('actionEngine')
		.controller('editTableController',
			function($compile, $filter, $window, $log, $scope,$http) {
		
			var vm = this;
			vm.title = "Uploading a CSV Table"
			vm.index = 0;
				
				
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
				                	if (obj[headers[1]] == undefined){
				                		continue;
				                	}
				                	result.push(obj);
				                	
				                }
				                vm.head = headers;
				                vm.data = result;
				                
				             console.log(result);
				             console.log(headers)
				             console.log(vm.data)

				            }
				            reader.readAsText(fileUpload.files[0]);

				            vm.editTable = false
				            vm.display = true;
				};
				
	
	
			vm.edit = function(ind) {

				vm.editTable = true;
				var line = "";
				vm.editfun = angular.copy(vm.data[ind])
				vm.head.forEach(function(entry) {
					console.log(entry + ' | ' + vm.data[ind][entry]);
					vm.index = ind;
				});
				
			};
			vm.save = function(ind) {
				vm.data[ind] = vm.editfun;
				vm.editTable = false;
				console.log(vm.data)
				
				
			};
			
			vm.down = function () {
			    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
			    var arrData = vm.data;
			    
			    var CSV = '';    
			    //Set Report title in first row or line
			    
			    CSV += "Download" + '\r\n\n';

			    //This condition will generate the Label/Header

			        var row = "";
			        
/*			        //This loop will extract the label from 1st index of on array
			        for (var index in arrData[0]) {
			            
			            //Now convert each value to string and comma-seprated
			            row += index + ',';
			        }

			        row = row.slice(0, -1);

			        //append Label row with line break
			        CSV += row + 'hii \r\n';*/
			    
			    for (var j = 0; j < vm.head.length; j++){
			    	var row = "";
			    	row += '"' + vm.head[j] + '",';
			    	row.slice(0,-1);
			    	CSV += row 
			  
			    }
			    CSV += '\r\n';
			    //1st loop is to extract each row
			    for (var i = 0; i < arrData.length; i++) {
			        var row = "";
			        
			        //2nd loop will extract each column and convert it in string comma-separated
			        for (var index in vm.head) {
			        	index = vm.head[index]
			            row += '"' + arrData[i][index] + '",';
			        }

			        row.slice(0, row.length - 1);
/*			        if (row.slice(0,5) == "object"){
			        		continue;
			        }*/
			        //add a line break after each row
			        CSV += row + '\r\n';
			    }

			    if (CSV == '') {        
			        alert("Invalid data");
			        return;
			    }   
			    
			    //Generate a file name
			    var fileName = "MyReport_";
			    //this will remove the blank-spaces from the title and replace it with an underscore
			    fileName += "Download".replace(/ /g,"_");   
			    
			    //Initialize file format you want csv or xls
			    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
			    
			    // Now the little tricky part.
			    // you can use either>> window.open(uri);
			    // but this will not work in some browsers
			    // or you will not get the correct file extension    
			    
			    //this trick will generate a temp <a /> tag
			    var link = document.createElement("a");    
			    link.href = uri;
			    
			    //set the visibility hidden so it will not effect on your web-layout
			    link.style = "visibility:hidden";
			    link.download = fileName + ".csv";
			    
			    //this part will append the anchor tag and remove it after automatic click
			    document.body.appendChild(link);
			    link.click();
			    document.body.removeChild(link);
			};
			
						
		}); // End excelController

})();