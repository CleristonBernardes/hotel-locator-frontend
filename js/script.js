var HotelLocatorApp = angular.module('HotelLocatorApp', []);

// create the controller and inject Angular's $scope
HotelLocatorApp.controller('IssueController', ['ReadInfoFactory', '$scope', function (ReadInfoFactory, $scope) {

    $scope.result;
    $scope.hasValue = true;
    $scope.loadingService = false;

    $scope.LoadData = function () {

        $scope.loadingService = true;
        var now = new Date().getTime();
        while (new Date().getTime() < now + 1000) { /* do nothing */ }; //loading..

        ReadInfoFactory.getMainInfo().then(function (response) {

            $scope.result = response.data;
            $scope.hasValue = (response.data.length > 0);
        })
        .finally(function () {
            $scope.loadingService = false;
        });
    }

    $scope.CleanData = function () {
        $scope.result = undefined;
        $scope.hasValue = false;
    }

    $scope.GetDateDifference = function(inputDate) {

        var temp = inputDate.split(" ");
        var data = temp[0].split("-");
        var time = temp[1];
        var formatInput = data[1] + "/" + data[2] + "/" + data[0] + " " + time;

        var startTime = new Date();
        var endTime = new Date(formatInput);
        var resultInSeconds = Math.abs(endTime.getTime() - startTime.getTime()) / 1000;

        if (resultInSeconds < 60)
        {
            return resultInSeconds + " seconds";
        }
        else
        {
            var resultInMinutes = Math.round(resultInSeconds / 60);
            if (resultInMinutes < 60) {
                return resultInMinutes + " minutes";
            }
            else {
                var resultInHours = Math.round(resultInMinutes / 60);
                if (resultInHours < 24) {
                    return resultInHours + " hours";
                }
                else {
                    return Math.round(resultInHours / 24) + " days";
                }
            }
        }


    }


}]);

HotelLocatorApp.factory('LocatorFactory', ['$http', function ($http) {

    function mainInfo(lat, long){
      var request = $http.get('http://localhost:8081/nearest?keyword=hotel&format=jsonp&lat='+lat+'&long='+long).success(function (response) {
          return response;
      }).error(function (error, status) {
          alert(error + ", " + status);
      });
      return request;
    };
    var factory = {};
    factory.getMainInfo = function(lat, long) {
        return mainInfo(lat, long);
    };
    return factory;
}]);

// controller to get user's location
HotelLocatorApp.controller('HotelController', ['LocatorFactory', '$scope', function (LocatorFactory, $scope) {

  function getLocation(position) {
    $scope.$apply(function(){
      $scope.lat = position.coords.latitude;
      $scope.long = position.coords.longitude;
      $scope.found_location = true;
    });
  }
  $scope.found_location = false;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocation);
  }
  $scope.searchHotels = function () {

    LocatorFactory.getMainInfo($scope.lat, $scope.long).then(function (response) {
      console.debug("response",response);
    });
  }

}]);
