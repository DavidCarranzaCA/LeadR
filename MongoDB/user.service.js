const User = require('../models/users')
const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    getAll: _getAll,
    getByID: _getByID,
    create: _create,
    update: _update,
    getDocWithEmailKey: _getDocWithEmailKey,
    setPasswordRecoveryToken: _setPasswordRecoveryToken,
    updateRegistrationConfirmation: _updateRegistrationConfirmation,
    updatePassword: _updatePassword,
    delete: _delete,
    login: _login,
    register: _register,
    getByEmail: _getByEmail
}

function _getAll(queryParam) {
    let query = queryParam || {}
    return conn.db().collection('leadr_user').find(query)
        .map(user => {
            return user
        })
        .toArray()
}

function _getByID(id) {
    return conn.db().collection('leadr_user').find({ _id: new ObjectId(id) }).limit(1)
        .map(user => {
            user._id = user._id.toString()
            return user
        })
        .next()
}

//... Omitted

function _register(model) {
    conn.db().collection('leadr_user').createIndex({ email: 1 }, { collation: { locale: "en", strength: 2 } });
    return conn.db().collection('leadr_user').find({ email: model.email }).collation({ locale: "en", strength: 2 })
        .map(newUser => {
            return newUser
        })
        .next()
}

function _create(model) {
    return conn.db().collection('leadr_user').insert(model)
}

/// .. Omitted
function _getDocWithEmailKey(key) {
    return conn.db().collection('leadr_user').findOne({ "emailKey": key.toString() })
        .then(docWithEmailKey => {
            return docWithEmailKey
        })
}

///
/// Omitted
///

function _delete(id) {
    return conn.db().collection('leadr_user').deleteOne({ _id: new ObjectId(id) })
        .then(result => Promise.resolve())
}

function _login(model) {
    return conn.db().collection('leadr_user').find({ email: { $eq: model.email } })
        .map(user => {
            return user
        })
        .next()
}