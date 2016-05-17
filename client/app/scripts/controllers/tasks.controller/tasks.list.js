/**
 * Created by sarra on 26/04/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('TasksListCtrl', TasksListCtrl);

function TasksListCtrl($scope, $state, databaseService, flashService, $stateParams, utilsService, NgTableParams) {

  var vm = this;

  vm.showAllTasks = showAllTasks;
  vm.deleteTask = deleteTask;
  vm.redirectTasksDetails = redirectTasksDetails;
  vm.isFiltersEnabled = false;

  function redirectTasksDetails(event,id){ $state.go('projects.details.tasks.details',{"idtask":id}); }

  function showAllTasks(){
    
    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {
        vm.projectName = data.nom;
        vm.tasks = data.taches;
        for (var i = data.taches.length - 1; i >= 0; i--) {
          switch (data.taches[i].categorie)
          {
            case 'Etude de projet': data.taches[i].categorie = utilsService.categoriesColors().etude;
            break;
            case 'Spécification': data.taches[i].categorie = utilsService.categoriesColors().spec;
            break;
            case 'Développement': data.taches[i].categorie = utilsService.categoriesColors().dev;
            break;
            case 'Recette': data.taches[i].categorie = utilsService.categoriesColors().rec;
            break;
            case 'Mise en production': data.taches[i].categorie = utilsService.categoriesColors().mep;
            break;
          }
          switch (data.taches[i].statut)
          {
            case 'Initial': data.taches[i].statut = utilsService.statusColors().initial;
            break;
            case 'En cours': data.taches[i].statut = utilsService.statusColors().en_cours;
            break;
            case 'Terminé(e)': data.taches[i].statut = utilsService.statusColors().termine;
            break;
            case 'Annulé(e)': data.taches[i].statut = utilsService.statusColors().annule;
            break;
            case 'Archivé': data.taches[i].statut = utilsService.statusColors().archive;
            break;
          }
        }

        vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: data.taches });

      })
      .error(function (err) {
        console.error(err);
      });
  };

  function deleteTask(id) {
    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {

        var tasks = data.taches;
        var indexTaskToDelete = utilsService.arrayObjectIndexOf(tasks, id, "_id");

        if(indexTaskToDelete > -1) {
          tasks.splice(indexTaskToDelete, 1);
          vm.tasks.splice(indexTaskToDelete, 1 );
          databaseService.updateObject('projects',$stateParams.id,data).success(function (data) {});

          vm.tableParams.reload().then(function(data) {
              if (data.length === 0 && vm.tableParams.total() > 0) {
              vm.tableParams.page(vm.tableParams.page() - 1);
              vm.tableParams.reload();
            }
          });
          flashService.success("Succès ! ", "La tâche a été supprimée", "bottom-right", true, 4);
        }
      })
      .error(function(err) {
        console.log(err);
      });
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {

    vm.showAllTasks();
  });

};

