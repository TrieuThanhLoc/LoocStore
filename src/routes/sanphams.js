const express = require('express');
const router = express.Router();
const middleware = require('../app/controllers/middleware/middleware');

const sanphamController = require('../app/controllers/nguoidung/SamPhamController');

router.get('/thong_tin_chi_tiet_show/:masp', sanphamController.thong_tin_chi_tiet_show);
router.get('/:masp', middleware.kiemtratoken, sanphamController.chitiet)
// router.get('/', sanphamController.index);

module.exports = router;
