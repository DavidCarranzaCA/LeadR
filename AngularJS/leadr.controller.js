
//// CODE OMITTED FO SECURITY
//// CODE OMITTED FO SECURITY
//// CODE OMITTED FO SECURITY
//// CODE OMITTED FO SECURITY
//// CODE OMITTED FO SECURITY

function ProviderServiceDropdownCtrl(providerServiceService, roles, $stateParams) {
    let $ctrl = this
    $ctrl.roles = roles
    $ctrl.providerServiceService = providerServiceService
    $ctrl.id = null
    $ctrl.currentServiceId = null

    // if the variable $ctrl.providerId does exits when it comes into this component
    // run the service call with the optional query
    // Success and Error handling 
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
}