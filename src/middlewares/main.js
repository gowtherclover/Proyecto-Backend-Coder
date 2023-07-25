export const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.render('errorLogin',{msg:'Authentication Error'});
    }
    next()
}

export const isAdmin = (req, res, next) => {
    if (req.session.user.role != 'admin' ) {
        return res.render('errorLogin',{msg:'Authorization Error'});
    }
    next()
}