const responses = require('../models/responses');
const userService = require('../services/user.service')
const mailService = require('../services/mail.service')
const apiPrefix = '/api/user';
const crypto = require('crypto')
const helpers = require('../helpers/helpersAuthenticate')

module.exports = {
    getAll: _getAll,
    getByID: _getById,
    create: _create,
    update: _update,
    updateRegistrationConfirmation: _updateRegistrationConfirmation,
    updatePassword: _updatePassword,
    delete: _delete,
    login: _login,
    register: _register,
    recoverPassword: _recoverPassword,
    hashCookies: _createHashOfPassword,
    generateSalt: _generateSalt,
    logout: _logout
}

function _create(req, res) {

    userService.register(req.model)
        .then(newUser => {

            if (newUser !== null) {
                res.status(400).send(new responses.ErrorResponse("User already exists"))

            } else {
                randomPassword = crypto.randomBytes(16).toString("base64")
                req.model.password_salt = _generateSalt()
                req.model.password_hash = _createHashOfPassword(req.model.password_salt, randomPassword)
                req.model.isEmailConfirmed = true

                userService.create(req.model)
                    .then(user => {

                        mailService.sendUserTheirPassword(req.model.email, randomPassword)
                            .then(() => {
                                const responseModel = new responses.ItemResponse()
                                responseModel.item = user
                                res.status(201).json(responseModel)
                            })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponses(err))
        })
}

function _delete(req, res) {
    userService.delete(req.params.id)
        .then(() => {
            const responseModel = new responses.ItemResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _getAll(req, res) {
    userService.getAll()
        .then(users => {
            if (users) {
                const responseModel = new responses.ItemResponse()

                for (let i = 0; i < users.length; i++) {
                    users[i] = helpers.removeSensitiveData(users[i])
                }

                responseModel.items = users
                res.json(responseModel)

            } else {
                res.status(400).send(new responses.ErrorResponse("There are no users to show!"))
            }
        })
        .catch(error => {
            res.status(500).send(new responses.ErrorResponse(error))
        })
}

function _getById(req, res) {
    userService.getByID(req.params.id)
        .then(user => {
            const responseModel = new responses.ItemResponse()

            cleanUserDoc = helpers.removeSensitiveData(user)

            responseModel.items = cleanUserDoc
            res.json(responseModel)
        })
        .catch(err => {
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _login(req, res) {
    return userService.login(req.model)
        .then(user => {
            if (_isValidUser(req.model.password, user)) {
                helpers.sendAuthCookie.bind(null, req, res, user)()
            } else {
                res.status(401).send(new responses.ErrorResponse('Invalid Account Information'))
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _logout(req, res) {
    req.cookies.auth ? res.clearCookie('auth') : null
    req.cookies.auth_hash ? res.clearCookie('auth_hash') : null

    res.status(201).send("Logout successful")
}

///... Omitted


////... Omitted

function _update(req, res) {
    userService.update(req.params.id, req.model)
        .then(user => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

// Change password and salt.  Return auth cookie
function _updatePassword(req, res) {
    let salt = _generateSalt()
    let hashedPassword = _createHashOfPassword(salt, req.body.password)

    userService.updatePassword(req.params.key, salt, hashedPassword)
        .then(user => {
            if (user) {
                let loginInfo = {
                    user: user.value.email,
                    password: user.value.password
                }
                userService.login(loginInfo)
                    .then(user => {
                        if (_isValidUser(req.body.password, user)) {
                            helpers.sendAuthCookie.bind(null, req, res, user)()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send(new responses.ErrorResponse(err))
                    })
            } else {
                res.status(400).json(new responses.ErrorResponse('Failed'))
            }
        })
        .catch(err => res.status(500).json(new responses.ErrorResponse(err)))
}



