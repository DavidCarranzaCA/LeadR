(function () {
    'use strict'

    angular.module('client.components').component('providerOurTeam', {
        templateUrl: 'client/components/provider-our-team/provider-team.components.html',
        bindings: {
            member: '<',
            newTeamName: '&',
            newTeamPosition: '&',
            newTeamPhoto: '&',
            newTeamDescription: '&'
        },
        controller: providerTeamController
    })

    providerTeamController.$inject = ['fileUploadService', '$timeout']

    function providerTeamController(fileUploadService, $timeout) {
        let $ctrl = this;
        $ctrl.newMember = {};

        $ctrl.$onChanges = function (changesObj) {
            $ctrl.uploadPicture = function (file) {
                if (file.length > 0) {
                    fileUploadService.signingAndUpload(file[0])
                        .then(onSuccess)
                        .catch(onError)
                }
            }
            angular.copy($ctrl.member, $ctrl.newMember)
        }

        function onSuccess(response) {
            $ctrl.photoUrl = response.config.url.split('?');
            $ctrl.newMember.photo = $ctrl.photoUrl[0]
            $ctrl.newTeamPhoto({
                photo: $ctrl.newMember.photo
            })
        }

        function onError(err) {
            console.log(err)
        }
    }
})();