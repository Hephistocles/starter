angular.module("myapp", [])
	.controller("HelloController", function($scope, $http) {
		
		// Immediate Angular action
		$scope.world = "World";  
		$scope.apiMsg = "Loading...";

		// try to dynamically fetch content from the api
		$http.get('/api/foo').
			success(function(data) {
				// this callback will be called asynchronously
				// when the response is available
				if (data.success) {
					$scope.apiMsg = data.result;
				} else {
					$scope.apiMsg = "Error: " +  data.error.message;
				}
			}).
			error(function(data) {
				console.error(data);
				$scope.apiMsg = "Error: " + data.error.message;
			});
	});