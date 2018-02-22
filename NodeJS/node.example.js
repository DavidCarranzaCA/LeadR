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