const express = require('express');
const router = express.Router();

const nguoidungController = require('../app/controllers/nguoidung/NguoiDungController');
const middleware = require('../app/controllers/middleware/middleware');

router.get('/yeucauhuydon/:_id',middleware.kiemtratoken, nguoidungController.yeucauhuydon);
router.get('/chitietdonhang/:_id',middleware.kiemtratoken, nguoidungController.chitietdonhang);
router.post('/themdiachi/:makh',middleware.kiemtratoken, nguoidungController.themdiachi);
router.post('/donhang/timkiemdonhang',middleware.kiemtratoken, nguoidungController.timkiemdonhang);
router.get('/donhang',middleware.kiemtratoken, nguoidungController.index);

//Đánh giá 
router.get('/danhgia',middleware.kiemtratoken, nguoidungController.danhgia);
router.post('/thuchiendanhgia/:madh',middleware.kiemtratoken, nguoidungController.thuchiendanhgia);
//Binh luan
router.get('/binhluan/:masp',middleware.kiemtratoken, nguoidungController.binhluan);
router.get('/traloibinhluan/:mabl',middleware.kiemtratoken, nguoidungController.traloibinhluan);
//quản lý tài khoản của tôi 
router.get('/taikhoancuatoi',middleware.kiemtratoken, nguoidungController.taikhoancuatoi);



module.exports = router;