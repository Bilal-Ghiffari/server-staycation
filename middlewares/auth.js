const isLogin = (req, res, next) => {
    if(req.session.user == null || req.session.user == undefined){
        req.flash('alertMessage', 'Silahkan Signin kembali')
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/signin')
    } else {
        next()
        //next(): akan memastikan sisa fungsi ini tidak berjalan
    } 
}

module.exports = isLogin