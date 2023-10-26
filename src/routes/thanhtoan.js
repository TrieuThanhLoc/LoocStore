const express = require('express');
const router = express.Router();
const middleware = require('../app/controllers/middleware/middleware');

const thanhtoanController = require('../app/controllers/nguoidung/ThanhToanController');

router.get('/muangay/:masp', middleware.kiemtratoken, thanhtoanController.muangay)
router.post('/dathang', middleware.kiemtratoken, thanhtoanController.dathang)
router.post('/luugiohangthanhtoan', middleware.kiemtratoken, thanhtoanController.luugiohangthanhtoan)
router.get('/', middleware.kiemtratoken, thanhtoanController.index)

module.exports = router;