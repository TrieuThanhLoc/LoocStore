const SanPham = require('../../../resources/models/SanPham');
const GioHang = require('../../../resources/models/GioHang');
const TrongLuongVaThietKe = require('../../../resources/models/sanphaminfo/TrongLuongVaThietKe');
const BoXuLy = require('../../../resources/models/sanphaminfo/BoXuLy');
const Camera = require('../../../resources/models/sanphaminfo/Camera');
const GiaoTiepVaKetNoi = require('../../../resources/models/sanphaminfo/GiaoTiepVaKetNoi');
const HeDieuHanh = require('../../../resources/models/sanphaminfo/HeDieuHanh');
const LuuTru = require('../../../resources/models/sanphaminfo/LuuTru');
const ManHinh = require('../../../resources/models/sanphaminfo/ManHinh');
const Pin = require('../../../resources/models/sanphaminfo/Pin');
const NhanVien = require('../../../resources/models/NhanVien')

const {MongooseToObject, multipleMongooseToObject} = require('../../../util/mongoose');
const KhachHang = require("../../../resources/models/khachhang/KhachHang");


class SanPhamController{
    index(req,res){
        res.render('nguoidung/sanpham');
    }
    async chitiet(req, res, next){
        const masp = req.params.masp;
        if(masp != undefined){

        const khachhang = await KhachHang.findOne({makh: makh})
        const sanpham = await SanPham.findOne({masp: masp});
        const trongluongvathietke = await TrongLuongVaThietKe.findOne({masp: masp});
        const boxuly = await BoXuLy.findOne({masp: masp});
        const camera = await Camera.findOne({masp: masp});
        const giaotiepvaketnoi = await GiaoTiepVaKetNoi.findOne({masp: masp});
        const hedieuhanh = await HeDieuHanh.findOne({masp: masp});
        const luutru = await LuuTru.findOne({masp: masp});
        const manhinh = await ManHinh.findOne({masp: masp});
        const pin = await Pin.findOne({masp: masp});
        
        //Thông tin khách hàng lên header
        var thongtintaikhoan;
        var makh;

        if(req.taikhoan != undefined){
            if(req.taikhoan.chucvu != undefined){
                var manv = req.taikhoan.id
                thongtintaikhoan = await NhanVien.findOne({manv: manv})
            }else{
                var makh = req.taikhoan.id
                thongtintaikhoan = await KhachHang.findOne({makh: makh})
            }
            if (thongtintaikhoan.makh != undefined){
                makh = thongtintaikhoan.makh
            }else if (thongtintaikhoan.manv != undefined){
                makh = thongtintaikhoan.manv
        }
        }   
        var trangthaiconhang = true;
        //Hiễn thị các sản phẩm trong giỏ hàng
        
        const giohangs = await GioHang.find({makh: makh});
        const soluongsptronggio = giohangs.length;
        res.render('nguoidung/chitietsanpham', {
            sanpham: MongooseToObject(sanpham),
            trongluongvathietke: MongooseToObject(trongluongvathietke),
            boxuly: MongooseToObject(boxuly),
            camera: MongooseToObject(camera),
            giaotiepvaketnoi: MongooseToObject(giaotiepvaketnoi),
            hedieuhanh: MongooseToObject(hedieuhanh),
            luutru: MongooseToObject(luutru),
            manhinh: MongooseToObject(manhinh),
            pin: MongooseToObject(pin),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            soluongsptronggio,
            giohangs: multipleMongooseToObject(giohangs),
        });
    } }
    donhang(req,res){
        res.render('nguoidung/donhang');
    }
    taikhoan(req,res){
        res.render('nguoidung/taikhoan');
    }
     async thong_tin_chi_tiet_show(req,res){
        const masp = req.params.masp
        const sanpham = await SanPham.findOne({masp: masp});
        const trongluongvathietke = await TrongLuongVaThietKe.findOne({masp: masp});
        const boxuly = await BoXuLy.findOne({masp: masp});
        const camera = await Camera.findOne({masp: masp});
        const giaotiepvaketnoi = await GiaoTiepVaKetNoi.findOne({masp: masp});
        const hedieuhanh = await HeDieuHanh.findOne({masp: masp});
        const luutru = await LuuTru.findOne({masp: masp});
        const manhinh = await ManHinh.findOne({masp: masp});
        const pin = await Pin.findOne({masp: masp});


        return res.render('nguoidung/thong_tin_chi_tiet_show',
        {
            sanpham: MongooseToObject(sanpham),
            trongluongvathietke: MongooseToObject(trongluongvathietke),
            boxuly: MongooseToObject(boxuly),
            camera: MongooseToObject(camera),
            giaotiepvaketnoi: MongooseToObject(giaotiepvaketnoi),
            hedieuhanh: MongooseToObject(hedieuhanh),
            luutru: MongooseToObject(luutru),
            manhinh: MongooseToObject(manhinh),
            pin: MongooseToObject(pin),
            layout: false,
        }
        );
    }
}

module.exports = new SanPhamController;