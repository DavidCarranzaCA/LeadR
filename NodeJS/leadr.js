////
function disburse(req, res) {
    let batchSelectedLeads = {};
    batchSelectedLeads.selectedLeadsArray = req.model;

    leadsService.paypalBatch(batchSelectedLeads)
        .then(id => {
            return paypalService.disbursePayment(batchSelectedLeads.selectedLeadsArray, id)
                .then(payout => {
                    return leadsService.updateBatchPayout(id, payout.batch_header.payout_batch_id)
                        .then(result => {
                            return leadsService.updatePaidLeadsStatus(batchSelectedLeads.selectedLeadsArray, payout.batch_header.payout_batch_id)
                                .then(result => {
                                    console.log("Disburse Payments Success")
                                    res.json(new responses.SuccessResponse())
                                })
                                .catch(err => res.send(new responses.ErrorResponse(err)));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
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

function authenticate(req, res, next) {

    if (!req.cookies.auth && !req.cookies.auth_hash) {
        return next()
    } 
    else if (req.cookies.auth && req.cookies.auth_hash) {
        let cookieHashCheck = userController.hashCookies(process.env.AUTH_COOKIE_SALT, req.cookies.auth);

        if (cookieHashCheck === req.cookies.auth_hash) {
            let auth = JSON.parse(req.cookies.auth)
            req.auth = {
                userId: auth._id,
                firstName: auth.firstName,
                lastName: auth.lastName,
                userRole: auth.role,
                providerId: auth.providerId,
                imgUrl: auth.imgUrl
            }
            return next()
        } 
        else {

            if (req.cookies.auth_hash && req.cookies.auth) {

                res.clearCookie('auth_hash')
                res.clearCookie('auth')
                res.sendStatus(401)
            } else {
                return false
            }
        }
    }
    ///////// Omitted for security 
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
    ///////// Omitted for security
}