const express = require('express');
const router = express.Router();
const middleware = require('../app/controllers/middleware/middleware');

const sanphamController = require('../app/controllers/nguoidung/SamPhamController');

//xem san pham theo danh muc
router.get('/danhmuc',middleware.kiemtratoken, sanphamController.danhmuc);

router.get('/thong_tin_chi_tiet_show/:masp',middleware.kiemtratoken, sanphamController.thong_tin_chi_tiet_show);
router.get('/', middleware.kiemtratoken,middleware.kiemtratoken, sanphamController.chitiet)
// router.get('/', sanphamController.index);

module.exports = router;
