module.exports = function SapXep(req, res, next){
    res.locals._sapxep = {
        enabled: false,
        type: 'default',
    };

    if(req.query.hasOwnProperty('_sapxep')){
        res.locals._sapxep.enabled = true;
        res.locals._sapxep.type = req.query.type;
        res.locals._sapxep.tencot = req.query.tencot;
    }
    next();
}