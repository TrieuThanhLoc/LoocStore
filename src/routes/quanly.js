const express = require('express');
const router = express.Router();

const quanlyController = require('../app/controllers/quanly/QuanLyController');
const middleware = require('../app/controllers/middleware/middleware');

//Quan ly san pham
router.get('/:masp/anhien', middleware.kiemtratoken,quanlyController.anhien);
router.post('/:masp/xoa', middleware.kiemtratoken,quanlyController.xoa);
router.get('/sanpham', middleware.kiemtratoken,quanlyController.quanlysanpham);
router.get('/:masp/sua', middleware.kiemtratoken,quanlyController.sua);
router.post('/luu', quanlyController.luuhang);
router.post('/:masp/capnhathang', middleware.kiemtratoken,quanlyController.capnhathang);
router.get('/nhaphang',middleware.kiemtratoken, quanlyController.nhaphang);
//Thống kê 
router.get('/thongke/dongtien',middleware.kiemtratoken, quanlyController.dongtien);
router.get('/thongke/doanhthu',middleware.kiemtratoken, quanlyController.doanhthu);
router.get('/thongke/trangthaidonhang',middleware.kiemtratoken, quanlyController.trangthaidonhang);
router.get('/thongke',middleware.kiemtratoken, quanlyController.thongke);


//Quan ly kho
router.post('/nhapkho',middleware.kiemtratoken, quanlyController.nhapkho);
router.get('/phieunhap',middleware.kiemtratoken, quanlyController.phieunhap);
router.get('/xoakho/:_id',middleware.kiemtratoken, quanlyController.xoakho);
router.post('/luukho',middleware.kiemtratoken, quanlyController.luukho);
router.get('/kho',middleware.kiemtratoken, quanlyController.kho);
router.get('/quanlykho',middleware.kiemtratoken, quanlyController.quanlykho);
router.get('/chonsanphamnhap',middleware.kiemtratoken, quanlyController.chonsanphamnhap);


//Quan ly nhan vien
router.get('/nhanvien/suathongtinnhanvien/:manv',middleware.kiemtratoken, quanlyController.suathongtinnhanvien);
router.post('/nhanvien/luusuathongtinnhanvien/:manv',middleware.kiemtratoken, quanlyController.luusuathongtinnhanvien);

router.post('/nhanvien/sathai/:manv',middleware.kiemtratoken, quanlyController.sathainhanvien);
router.get('/nhanvien/channhanvien/:manv',middleware.kiemtratoken, quanlyController.channhanvien);

router.get('/nhanvien/themnhanvien',middleware.kiemtratoken, quanlyController.themnhanvien);
router.post('/nhanvien/luunhanvien', quanlyController.luunhanvien);
router.get('/nhanvien',middleware.kiemtratoken, quanlyController.qunalynhanvien);



//quan ly don hang
router.post('/donhang/xoadon/:_id', middleware.kiemtratoken, quanlyController.xoadon);
router.get('/donhang/quanlymotdonhang/:_id', middleware.kiemtratoken, quanlyController.quanlymotdonhang);
router.post('/donhang/capnhattrangthai/:_id', middleware.kiemtratoken, quanlyController.capnhattrangthai);
router.get('/donhang', middleware.kiemtratoken, quanlyController.quanlydonhang);



//Quan ly tai khoan khach hang
router.post('/taikhoan/xoakhachhang/:makh',middleware.kiemtratoken, quanlyController.xoakhachhang);
router.get('/camkhachhang/:makh',middleware.kiemtratoken, quanlyController.camtaikhoankh);
router.get('/taikhoan', middleware.kiemtratoken, quanlyController.quanlytaikhoan);
router.get('/',middleware.kiemtratoken, quanlyController.index);

module.exports = router;
