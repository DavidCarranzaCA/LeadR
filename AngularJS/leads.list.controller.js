(function () {
    'use strict'
 
    angular.module('client.components')
       .component('leadsList', {
          templateUrl: 'client/components/leads-list/leads-list.component.html',
          bindings: {
             listType: '<',
             leadId: '<'
          },
          controller: LeadsListController
       })
 
    LeadsListController.$inject = ['providerService', 'userService', 'toastr', '$stateParams']
 
    function LeadsListController(providerService, userService, toastr, $stateParams) {
       var $ctrl = this
 
       $ctrl.$onInit = function () {
 
          if ($stateParams.id) {
 
             switch ($ctrl.listType) {
 
                case 'leadsByProvider':
                   return providerService.getByProviderId($ctrl.leadId, 10)
                      .then(onSuccess)
                      .catch(onError)
                   break;
 
                case 'leadsByUser':
                   return userService.getByUserId($ctrl.leadId, 20)
                      .then(onSuccess)
                      .catch(onError)
                   break;
 
                default:
                   return toastr.error("Hey Developer, you've entered in the wrong 'type'", 'Error');
                   break;
             }
          }
       }
 
       function onSuccess(data) {
          if (data && data.items) {
             $ctrl.leadsById = data.items
          }
       }
 
       function onError(e) {
          console.log(e)
       }
    }
 })()