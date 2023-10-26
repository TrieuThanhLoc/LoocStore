const jwt = require('jsonwebtoken');

class middleware{
    kiemtratoken(req, res, next){
        try {
            var token = req.cookies.token
            if(!token){
                // return res.render('khac/home')
                next()
            }else{
                var ketquakiemtra = jwt.verify(token,'thanhloc',(err, taikhoan)=>{
                if(err){
                    return res.send('Không có quyền truy cặp')
                }
                req.taikhoan = taikhoan
                next();
            })
            }
        } catch (error) {
            res.send('LỖI!!!')
        }
    }
    //  kiemtratokenkhachhang(req, res, next){
    //     try {
    //         var token = req.cookies.tokenkhachhang
    //         if(!token && token == undefined){
    //             return next()
    //         }else{
    //             jwt.verify(token,'thanhloc',(err, khachhang)=>{
    //             if(err){
    //                 return next()
    //             }
    //             req.khachhang = khachhang
    //             next();
    //         })
    //         }
    //     } catch (error) {
    //         res.send('LỖI!!!')
    //     }
    // }
}
module.exports = new middleware;