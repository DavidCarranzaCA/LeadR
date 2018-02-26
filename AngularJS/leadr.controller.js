(function () {
    'use strict'

    angular.module('client.providerService').component('providerServiceDropdown', {
        templateUrl: 'client/components/provider-service-dropdown/provider-service.components.html',
        bindings: {
            formReference: '<',
            providerId: '<',
            serviceId: '&',
            currentServiceId: '<',
            selectId: '&',
            currentLoggedInUserRole: '<',
            userEdit: '<',
            pageType: '<'

        },
        controller: ProviderServiceDropdownCtrl
    })


    ProviderServiceDropdownCtrl.$inject = ['providerServiceService', 'roles', '$stateParams']

    function ProviderServiceDropdownCtrl(providerServiceService, roles, $stateParams) {
        let $ctrl = this
        $ctrl.roles = roles
        $ctrl.providerServiceService = providerServiceService
        $ctrl.id = null
        $ctrl.currentServiceId = null

        $ctrl.$onChanges = function() {
            if($ctrl.providerId) {
                providerServiceService.readAll(`?providerId=${$ctrl.providerId}`)
                .then(onSuccess)
                .catch(onError) 
            }
        }
        function onSuccess(data) {
            $ctrl.providerServices = data.items
        }

        function onError() {
            console.log('error')
        }
        $ctrl.setUserRole = function (role) {
            let doc = $ctrl.user
            doc.role = role
            $ctrl.userEdit(doc)
        }
    }
})();