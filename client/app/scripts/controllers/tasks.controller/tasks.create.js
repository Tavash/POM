'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TasksCreateCtrl
 * @description
 * # TasksCreateCtrl
 * Controller of the tasks create
 */

angular.module('pomApp').controller('TasksCreateCtrl', TasksCreateCtrl);

function TasksCreateCtrl($scope, $state, $mdDialog, $stateParams,utilsService, databaseService, flashService) {

  var vm = this;
  var collaborateursId = [];
  var collaboratorsIds = [];

  vm.createTask = createTask;
  vm.showCollaboratorPicker = showCollaboratorPicker;
  vm.showCancelDialog = showCancelDialog;
  vm.filterOnlyWeekDays = utilsService.filterOnlyWeekDays;

  /**
   * Création d'une tâche et stockage en base de donnée
   */
  function createTask() {

    databaseService.getObjectById('projects',$stateParams.id)
      .success(function (data) {

        if(!vm.task.startDate) vm.task.startDate = new Date();
        if(!vm.task.endDate) vm.task.endDate = new Date();

        if(data.taches.length > 0){
          var maxCode = 0, newCode;
          for (var i = data.taches.length - 1; i >= 0; i--) {
            if(data.taches[i].code){
              var numCode = parseInt(data.taches[i].code.substring(9,12));
              if(maxCode < numCode)
                maxCode = numCode;
            } else
                maxCode = 0;
          }
          newCode = maxCode + 1;
          vm.code = data.code + 'T' + utilsService.addZero(newCode,3);
        } else
          vm.code = data.code + 'T001';

        var task = {
          "libelle" : vm.task.name,
          "code" : vm.code,
          "categorie" : vm.task.categorie,
          "date_debut" : vm.task.startDate,
          "description" : vm.task.description,
          "date_fin_theorique" : vm.task.endDate,
          "statut" : "Initial",
          "collaborateurs" : collaborateursId,
          "projet_id" : $stateParams.id,
          "date_derniere_modif" : new Date()
        };

        data.taches.push(task);

        databaseService.updateObject('projects', $stateParams.id, data)
          .success(function (data) {
            flashService.success("Création de la tâche " + vm.task.name + " réussie.", "", "bottom-right", true, 4);
            $state.go("projects.details.tasks");
          })
          .error(function (err) {
            console.log(err);
          });
      })
      .error(function (err) {
        console.log(err);
      });
  }

  /**
   * Lancement au chargement de la page
   */
  $scope.$on('$viewContentLoaded', function() {

    databaseService.getSettings('statuts').success(function(data){ vm.statuts = data; });

    databaseService.getSettings('categories').success(function(data){ vm.categories = data; });

    databaseService.getObjectById('projects',$stateParams.id)
      .success(function (data) {

        var projectCollaborators = [];
        collaboratorsIds = data.collaborateurs;
        vm.minDate = new Date(data.date_debut);
        vm.maxDate = new Date(data.date_fin_theorique);

        for (var i=0; i < collaboratorsIds.length; i++) {

          databaseService.getObjectById('collaborators',collaboratorsIds[i])
            .success(function (data) {
              projectCollaborators.push(data);
            })
            .error(function (err) {
              console.log(err);
            });
        }
        vm.collaborators = projectCollaborators;
      })
      .error(function (err) {
        console.log(err);
      });
  });

  /**
   * Affiche la boite de dialogue de confirmation d'annulation
   *
   * @param event
   */
  function showCancelDialog(event) {

    var confirm = $mdDialog.confirm()
      .title('Alerte')
      .textContent('Etes-vous sûr d\'annuler la création de la tâche ?')
      .ariaLabel('Annulation')
      .targetEvent(event)
      .ok('Oui')
      .cancel('Non');

    $mdDialog.show(confirm).then(function() {
      $state.go("projects.details.tasks");
    }, function() {

    });
  }

  /**
   * Affiche la boite de dialogue de choix des collaborateurs
   *
   * @param ev
   */
  function showCollaboratorPicker(ev) {

    $mdDialog.show({
      controller: _CollaboratorPickerController,
      templateUrl: 'views/shared/collaborators.picker.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false,
      locals: {
        collaborators: vm.collaborators
      }
    });
  }

  /**
   * Controller de la boite de dialogue de choix des collaborateurs
   * @param $rootScope
   * @param $scope
   * @param $mdDialog
   * @param collaborators
   * @private
   */
  function _CollaboratorPickerController($rootScope, $scope, $mdDialog, collaborators) {

    $scope.collaborators = collaborators;
    $scope.selection = collaborateursId;
    $scope.hide = function() { $mdDialog.hide($scope.selection); };
    $scope.userRole = $rootScope.userRole;

    $scope.selectCollaborator = function (collaborator) {
      if(collaborateursId.indexOf(collaborator._id) < 0) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;
        var indexCol =  collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) { collaborateursId.splice(indexCol, 1); }
      }
    };
  }

}

