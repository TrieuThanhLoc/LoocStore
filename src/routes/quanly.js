const express = require('express');
const router = express.Router();

const quanlyController = require('../app/controllers/quanly/QuanLyController');
const middleware = require('../app/controllers/middleware/middleware');

//Quan ly san pham
router.post('/:masp/xoa', middleware.kiemtratoken,quanlyController.xoa);
router.get('/sanpham', middleware.kiemtratoken,quanlyController.quanlysanpham);
router.get('/:masp/sua', middleware.kiemtratoken,quanlyController.sua);
router.post('/luu', quanlyController.luuhang);
router.post('/:masp/capnhathang', middleware.kiemtratoken,quanlyController.capnhathang);
router.get('/nhaphang',middleware.kiemtratoken, quanlyController.nhaphang);
//Quan ly kho
router.get('/:masp/kho',middleware.kiemtratoken, quanlyController.kho);
router.post('/capnhatkho/luuthaydoikho',middleware.kiemtratoken, quanlyController.luuthaydoikho);
router.post('/capnhatkho',middleware.kiemtratoken, quanlyController.capnhatkho);
router.post('/:masp/luumausanpham',middleware.kiemtratoken, quanlyController.luumausanpham);//Luu mau san pham
router.get('/:masp/themmausanpham',middleware.kiemtratoken, quanlyController.themmausanpham);//them mau san pham


//Quan ly nhan vien
router.get('/nhanvien',middleware.kiemtratoken, quanlyController.qunalynhanvien);
router.get('/nhanvien/themnhanvien',middleware.kiemtratoken, quanlyController.themnhanvien);
router.post('/nhanvien/luunhanvien', quanlyController.luunhanvien);



//quan ly don hang
router.get('/donhang/xoadon/:_id', middleware.kiemtratoken, quanlyController.xoadon);
router.get('/donhang/quanlymotdonhang/:_id', middleware.kiemtratoken, quanlyController.quanlymotdonhang);
router.post('/donhang/capnhattrangthai/:_id', middleware.kiemtratoken, quanlyController.capnhattrangthai);
router.get('/donhang', middleware.kiemtratoken, quanlyController.quanlydonhang);




router.get('/taikhoan', middleware.kiemtratoken, quanlyController.quanlytaikhoan);
router.get('/',middleware.kiemtratoken, quanlyController.index);

module.exports = router;
