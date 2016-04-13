'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $location, $http, $rootScope, authenticateService){
  	
  	$scope.authenticate = function() {
	    authenticateService.authenticate(JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			$location.path('main');
	    		}
	    		else
	    		{
	    			console.log("erreur connexion");
	    		}
	    	});
	};

	$scope.$on('$viewContentLoaded', function() {
		if (authenticateService.getCurrentUser() !== null) {
			console.log("déconnecter l'user");
			authenticateService.clearCredentials();
		}
    });
  });
