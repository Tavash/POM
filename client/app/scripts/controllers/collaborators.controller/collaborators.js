'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('CollaboratorsCtrl', function ($scope, databaseService) {


    $scope.showAllCollaborators = function() {
      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          $scope.collaborators = data;
        })
        .error(function (err) {
          console.error(err);
        });
    };




    $scope.deleteCollaborator = function(id) {
      databaseService.deleteObject('collaborators', id)
        .success(function (data) {
          // Update liste projets
          $scope.showAllCollaborators();
        })
        .error(function(err) {
          console.log(err);
        });
    };


/*
    $scope.showFormCreateCollaborator = function () {
      $scope.showForm = true;

      $scope.dateLaunchCollaboratorNewCollaborator = new Date();

      $scope.showAllCollaborators();

      $scope.roles = ["Admin", "Manager", "Collaborateur"];
    };

    $scope.hideFormCreateCollaborator = function () {
      $scope.showForm = false;
    };


*/








    // Permet de lancer au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      $scope.showAllCollaborators();

      // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
     // $scope.hideFormCreateCollaborator();

    });

  });
