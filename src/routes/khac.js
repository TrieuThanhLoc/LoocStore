const express = require('express');
const router = express.Router();

const khaController = require('../app/controllers/khac/KhacController');
const middleware = require('../app/controllers/middleware/middleware');


// Tim kiem san pham 
router.get('/timkiemsanpham', middleware.kiemtratoken, khaController.timkiemsanpham)
router.get('/xoalichsu', middleware.kiemtratoken, khaController.xoalichsu)

router.get('/dangnhap', khaController.dangnhap)
router.get('/dangsuat', khaController.dangsuat)

//Đổi mật khẩu
router.get('/quenmatkhau', khaController.quenmatkhau)
router.get('/nhapmaxacthuc/:emailkh', khaController.nhapmaxacthuc)
router.post('/doimatkhau', khaController.doimatkhau)
router.post('/luumatkhaumoi/:emailkh', khaController.luumatkhaumoi)



router.get('/dangky', khaController.dangky)
router.post('/dangkykh', khaController.dangkykh)
router.post('/dangnhap/xacthuc', khaController.xacthuc)
router.get('/', middleware.kiemtratoken, khaController.index)


module.exports = router;
