const express = require('express');
const router = express.Router();

const khaController = require('../app/controllers/khac/KhacController');
const middleware = require('../app/controllers/middleware/middleware');


// Tim kiem san pham 
router.post('/timkiemsanpham', middleware.kiemtratoken, khaController.timkiemsanpham)

router.get('/dangnhap', khaController.dangnhap)
router.get('/dangsuat', khaController.dangsuat)
router.get('/dangky', khaController.dangky)
router.post('/dangkykh', khaController.dangkykh)
router.post('/dangnhap/xacthuc', khaController.xacthuc)
router.get('/', middleware.kiemtratoken, khaController.index)


module.exports = router;
