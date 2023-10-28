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
const Ngay = require('../../../util/ngay');
const KhachHang = require("../../../resources/models/khachhang/KhachHang");


class GioHangController {
     async themgiohang(req,res, next){
        const giohang = await GioHang();
        const masp = req.params.masp;
        const sanpham = await SanPham.findOne({masp: masp})
         // Lay thong tin khach hang
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
            //  Lay ma khach hang
        if(thongtintaikhoan.manv != undefined){
            makh = thongtintaikhoan.manv
        }else if(thongtintaikhoan.makh != undefined){
            makh = thongtintaikhoan.makh
        }
        }else {
        return res.render('khac/dangnhap')
        }
        giohang.masp = masp;
        giohang.makh = makh;
        giohang.anh = sanpham.anh;
        giohang.giaban = sanpham.giaban;
        giohang.hangsx = sanpham.hangsx;
        giohang.tensp = sanpham.tensp;
        giohang.ngaythemvaogio = Ngay.ngayhomnay();

        //Kiem tra san pham trong gio hang da co chua ?
        var sanphamtronggio = await GioHang.findOne({makh: giohang.makh, masp: giohang.masp })
        if(sanphamtronggio){
            sanphamtronggio.soluongsp += 1;
            await GioHang.updateOne({masp: giohang.masp, makh: giohang.makh}, sanphamtronggio)
            return res.redirect('back');
        }else{
            giohang.soluongsp = 1;
            giohang.save()
            return res.redirect('back');
        }
    }
    async giohang(req,res){
        // Lay thong tin khach hang
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
                //  Lay ma khach hang
            if(thongtintaikhoan.manv != undefined){
                makh = thongtintaikhoan.manv
            }else if(thongtintaikhoan.makh != undefined){
                makh = thongtintaikhoan.makh
            }
         }else {
            return res.render('khac/dangnhap')
         }

        var giohangs = await GioHang.find({makh: makh}).sort({ngaythemvaogio: 'desc'});
        for(var i = 0; i < giohangs.length; i++){
            giohangs[i]._doc.giagiam = giohangs[i].giaban*0.9;
         }

        res.render('nguoidung/giohang',{
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            giohangs: multipleMongooseToObject(giohangs),
        });
    }
    async xoasanphamgiohang(req, res, next){
        const masp = req.params.masp;
         var thongtintaikhoan;
         if(req.taikhoan != undefined){
            if(req.taikhoan.chucvu != undefined){
                var manv = req.taikhoan.id;
                thongtintaikhoan = await NhanVien.findOne({manv: manv});
            }else{
                var makh = req.taikhoan.id;
                thongtintaikhoan = await KhachHang.findOne({makh: makh});
            }
         }
         var makh;
        if(thongtintaikhoan.manv != undefined){
            makh = thongtintaikhoan.manv
        }else if(thongtintaikhoan.makh != undefined){
            makh = thongtintaikhoan.makh
        }

        await GioHang.deleteOne({masp: masp, makh: makh});
        res.redirect('back')
    }
    xoatatca(req, res, next){
         GioHang.deleteMany({_id: {$in: req.body.san_pham_chon}})
        .then(()=>{
            res.redirect('back');
        }).catch(next);
    }
}
module.exports = new GioHangController;
