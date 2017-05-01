var HotelLocatorApp = angular.module('HotelLocatorApp', []);

HotelLocatorApp.factory('LocatorFactory', ['$http', function ($http) {

    function getMethod(url_query){
      var request = $http.get('https://hotelgeolocator.herokuapp.com' + url_query).success(function (response) {
          return response;
      }).error(function (error, status) {
          console.log(error + ", " + status);
      });
      return request;
    };

    function mainInfo(lat, long){
      return getMethod('/nearest?keyword=hotel&lat='+lat+'&long='+long);
    };

    function getDetails(id){
      return getMethod('/details/'+id);
    };

    var factory = {};
    factory.getNearestHotels = function(lat, long) {
        return mainInfo(lat, long);
    };
    factory.searchDetails = function(id) {
        return getDetails(id);
    };

    return factory;
}]);

// controller to get user's location
HotelLocatorApp.controller('HotelController', ['LocatorFactory', '$scope', function (LocatorFactory, $scope) {

  function getLocation(position) {
    $scope.lat = position.coords.latitude;
    $scope.long = position.coords.longitude;
    $scope.found_location = true;
    $scope.$digest()
  }
  $scope.found_location = false;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocation);
  }
  $scope.cleanDetail = function () {
      $scope.hotel_detail = undefined
  }
  $scope.searchHotels = function () {
    LocatorFactory.getNearestHotels($scope.lat, $scope.long).then(function (response) {
      $scope.hotel_list = response.data;
    });
  }
  $scope.searchDetails = function (id) {
    LocatorFactory.searchDetails(id).then(function (response) {
      $scope.hotel_detail = response.data;
    });
  }

}]);
