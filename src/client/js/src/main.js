angular.module("myapp", [])
	.controller("HelloController", function($scope, $http) {
		$scope.world = "World!";
		$scope.apiMsg = "Loading...";
		$http.get('/api/foo').
			success(function(data) {
				// this callback will be called asynchronously
				// when the response is available
				if (data.success) {
					$scope.apiMsg = "Message: " + data.result;
				} else {
					$scope.apiMsg = "Error: " +  data.error.message;
				}
			}).
			error(function(data) {
				console.error(data);
				$scope.apiMsg = "Error: " + data.error.message;
			});
	});