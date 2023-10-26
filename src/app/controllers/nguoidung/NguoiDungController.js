const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
//San pham
const SanPham = require('../../../resources/models/SanPham');
const NhatKyDonHang = require('../../../resources/models/NhatKyDonHang');
const DiaChiKhachHang = require('../../../resources/models/khachhang/DiaChiKhachHang');
const TrongLuongVaThietKe = require('../../../resources/models/sanphaminfo/TrongLuongVaThietKe');
const BoXuLy = require('../../../resources/models/sanphaminfo/BoXuLy');
const Camera = require('../../../resources/models/sanphaminfo/Camera');
const GiaoTiepVaKetNoi = require('../../../resources/models/sanphaminfo/GiaoTiepVaKetNoi');
const HeDieuHanh = require('../../../resources/models/sanphaminfo/HeDieuHanh');
const LuuTru = require('../../../resources/models/sanphaminfo/LuuTru');
const ManHinh = require('../../../resources/models/sanphaminfo/ManHinh');
const Pin = require('../../../resources/models/sanphaminfo/Pin');
const Kho = require('../../../resources/models/Kho');
//Nhan vien
const NhanVien = require ('../../../resources/models/NhanVien');
const KhachHang = require ('../../../resources/models/khachhang/KhachHang');
const DonHang = require('../../../resources/models/DonHang');
const GioHang = require('../../../resources/models/GioHang');
const ChiTietDonHang = require('../../../resources/models/ChiTietDonHang');

class thanhtoanController{
    async index (req,res, next){
        var thongtintaikhoan;
        var makh;

    if(req.taikhoan != undefined){
        if(req.taikhoan.chucvu != undefined){
            var manv = req.taikhoan.id;
            thongtintaikhoan = await NhanVien.findOne({manv: manv});
        }else{
            var makh = req.taikhoan.id;
            thongtintaikhoan = await KhachHang.findOne({makh: makh});
        }
            if (thongtintaikhoan.makh != undefined){
            makh = thongtintaikhoan.makh
        }else if (thongtintaikhoan.manv != undefined){
            makh = thongtintaikhoan.manv
        }
        }
        var donhangs = await DonHang.find({makh: makh})
        for(var i = 0; i < donhangs.length; i++){
            if(donhangs[i].trangthai == 'da_tiep_nhan'){
                donhangs[i]._doc.da_tiep_nhan = true;
            }else if(donhangs[i].trangthai == 'van_chuyen'){
                donhangs[i]._doc.van_chuyen = true;
            }else if(donhangs[i].trangthai == 'dang_giao'){
                donhangs[i]._doc.dang_giao = true;
            }else if(donhangs[i].trangthai == 'hoan_thanh'){
                donhangs[i]._doc.hoan_thanh = true;
            }else if(donhangs[i].trangthai == 'da_huy'){
                donhangs[i]._doc.da_huy = true;
            }
            var chitietdonhangs = await ChiTietDonHang.find({madh: donhangs[i]._id})
            var sanphamstams = [];
            for (var j = 0; j < chitietdonhangs.length; j++){
                 var sanpham = await SanPham.findOne({masp: chitietdonhangs[j].masp})
                sanpham._doc.mausacdat = chitietdonhangs[j].mausacdat;
                sanpham._doc.soluongdat = chitietdonhangs[j].soluongdat;
                 sanphamstams.push(sanpham)
            }
            donhangs[i]._doc.sanphams = sanphamstams;
        }
        var donhangssort = donhangs.sort({ngaydathang: 1})
        res.render('nguoidung/donhang',{
            donhangs: multipleMongooseToObject(donhangs),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
    }

    async yeucauhuydon(req, res, next){
        var donhang = await DonHang.findOne({_id: req.params._id })
        donhang.yeucauhuydon = true;
        await donhang.save()
        res.redirect('back')
    }
    
    async chitietdonhang(req, res, next){
        //Load Nhật ký dơn hàng
        var nhatkydonhang = await NhatKyDonHang.findOne({madh: req.params._id})
        var thongtintaikhoan;
        if(req.taikhoan != undefined){
            if(req.taikhoan.chucvu != undefined){
                var manv = req.taikhoan.id
                thongtintaikhoan = await NhanVien.findOne({manv: manv})
            }else{
                var makh = req.taikhoan.id
                thongtintaikhoan = await KhachHang.findOne({makh: makh})
            }}
        //Hiễn thị các sản phẩm trong giỏ hàng
        if(thongtintaikhoan != undefined){
                var makh = "makh";
                if (thongtintaikhoan.manv){
                    makh = thongtintaikhoan.manv
                }else{
                    makh = thongtintaikhoan.makh
                }
                const giohangs = await GioHang.find({makh: makh});
                const soluongsptronggio = giohangs.length;

                const donhang = await DonHang.findOne({_id: req.params._id})

                var chitietdonhangs = await ChiTietDonHang.find({madh: req.params._id})
                var sanphamstams = [];
                for (var j = 0; j < chitietdonhangs.length; j++){
                    var sanpham = await SanPham.findOne({masp: chitietdonhangs[j].masp})
                    sanpham._doc.mausacdat = chitietdonhangs[j].mausacdat;
                    sanpham._doc.soluongdat = chitietdonhangs[j].soluongdat;
                    sanphamstams.push(sanpham)
                }
                donhang._doc.sanphams = sanphamstams;

        res.render('nguoidung/chitietdonhang',{
                nhatkydonhang: MongooseToObject(nhatkydonhang),
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                donhang: MongooseToObject(donhang),
                soluongsptronggio,
        })
        }
    }
    async themdiachi(req, res, next){
        const diachimoi = new DiaChiKhachHang(req.body)
        diachimoi.makh = req.params.makh;
        diachimoi.save();
        res.redirect('back')
    }
    async timkiemdonhang(req, res, next){
        var thongtintaikhoan;
        var makh;
        var tukhoatimdonhang = req.body.tukhoatimdonhang

    if(req.taikhoan != undefined){
        if(req.taikhoan.chucvu != undefined){
            var manv = req.taikhoan.id;
            thongtintaikhoan = await NhanVien.findOne({manv: manv});
        }else{
            var makh = req.taikhoan.id;
            thongtintaikhoan = await KhachHang.findOne({makh: makh});
        }
            if (thongtintaikhoan.makh != undefined){
            makh = thongtintaikhoan.makh
        }else if (thongtintaikhoan.manv != undefined){
            makh = thongtintaikhoan.manv
        }
        }
        const tatcadonhang = await DonHang.find({makh: makh});
        for (var i = 0; i < tatcadonhang.length; i++){
            const chitietdonhangs = await ChiTietDonHang.find({madh: tatcadonhang[i]._id});
            var masp = '';
            for (var j = 0; j < chitietdonhangs.length; j++){
                masp = masp + chitietdonhangs[j].masp;
            }
            tatcadonhang[i].masp = masp;
        }
        var donhangs = tatcadonhang.filter((donhang, i)=>{
            return donhang.masp.toLowerCase().includes(tukhoatimdonhang.toLowerCase())
        })
        for(var i = 0; i < donhangs.length; i++){
            if(donhangs[i].trangthai == 'da_tiep_nhan'){
                donhangs[i]._doc.da_tiep_nhan = true;
            }else if(donhangs[i].trangthai == 'van_chuyen'){
                donhangs[i]._doc.van_chuyen = true;
            }else if(donhangs[i].trangthai == 'dang_giao'){
                donhangs[i]._doc.dang_giao = true;
            }else if(donhangs[i].trangthai == 'hoan_thanh'){
                donhangs[i]._doc.hoan_thanh = true;
            }else if(donhangs[i].trangthai == 'da_huy'){
                donhangs[i]._doc.da_huy = true;
            }
            var chitietdonhangs = await ChiTietDonHang.find({madh: donhangs[i]._id})
            var sanphamstams = [];
            for (var j = 0; j < chitietdonhangs.length; j++){
                 var sanpham = await SanPham.findOne({masp: chitietdonhangs[j].masp})
                sanpham._doc.mausacdat = chitietdonhangs[j].mausacdat;
                sanpham._doc.soluongdat = chitietdonhangs[j].soluongdat;
                 sanphamstams.push(sanpham)
            }
            donhangs[i]._doc.sanphams = sanphamstams;
        }
        res.render('nguoidung/donhang',{
            donhangs: multipleMongooseToObject(donhangs),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
    }
}
module.exports = new thanhtoanController;
