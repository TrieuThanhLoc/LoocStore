const sanphamRouter = require('./sanphams');
const khacRouter = require('./khac');
const quanlyRouter = require('./quanly');
const thanhtoanrRouter = require('./thanhtoan');
const giohangRouter = require('./giohang');
const nguoidungRouter = require('./nguoidung');


function route(app){

    app.use('/sanpham', sanphamRouter);

    app.use('/nguoidung', nguoidungRouter);

    app.use('/giohang', giohangRouter);

    app.use('/thanhtoan', thanhtoanrRouter);

    app.use('/quanly', quanlyRouter);
    
    app.use('/', khacRouter);
   
};

module.exports = route;
