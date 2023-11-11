const express = require('express');
const router = express.Router();
const middleware = require('../app/controllers/middleware/middleware');

const giohangcontroller = require('../app/controllers/nguoidung/GioHangController');

// router.post('/luudonhangmuangay',middleware.kiemtratoken,giohangcontroller.luudonhangmuangay);
router.get('/themgiohang',middleware.kiemtratoken,giohangcontroller.themgiohang);
router.post('/xoatatca',middleware.kiemtratoken,giohangcontroller.xoatatca);
router.get('/xoa/:masp',middleware.kiemtratoken,giohangcontroller.xoasanphamgiohang);
router.get('/',middleware.kiemtratoken,giohangcontroller.giohang);

module.exports = router;