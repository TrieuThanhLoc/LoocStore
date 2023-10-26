const { taikhoan } = require("../nguoidung/SamPhamController");
const jwt = require('jsonwebtoken');
const cookies = require("../../../config/cookie");
const NhanVien = require("../../../resources/models/NhanVien");
const KhachHang = require("../../../resources/models/khachhang/KhachHang");
const SanPham = require('../../../resources/models/SanPham')
const { MongooseToObject, multipleMongooseToObject } = require("../../../util/mongoose");
const GioHang = require("../../../resources/models/GioHang");



class KhacController{
    async index(req,res){
        const sanphams = await SanPham.find({});

        //Hiễn thị thông tin tài khoản đã đăng nhập
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
            res.render('khac/home',{
                    sanphams: multipleMongooseToObject(sanphams),
                    //Thong tin hiễn thị trên header
                    soluongsptronggio,
                    giohangs: multipleMongooseToObject(giohangs),
                    thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
        }else{
             res.render('khac/home',{
                sanphams: multipleMongooseToObject(sanphams),})
        }
    }
    lienhe(req,res){
        res.render('khac/lienhe');
    }
    dangky(req,res){
        res.render('khac/dangky');
    }
    async dangkykh(req,res){
        const khachhang = await KhachHang(req.body);
        const khachhangdatao = await KhachHang.findOne({makh: khachhang.makh})
        if(!khachhangdatao){
            khachhang.save().then(
            res.redirect('/dangnhap')
            )
        }else{
            const emailkh = khachhang.emailkh
            return res.render('khac/dangky', {emailkh})
        }
    }
    dangnhap(req,res){
        res.render('khac/dangnhap');
    }
    dangsuat(req,res,next){
        const xoatoken = ""
        res.status(200).cookie('token',xoatoken).redirect('/');
    }
    async xacthuc(req,res,next){
        const email = await req.body.email;
        const matkhau = await req.body.matkhau;
        KhachHang.findOne({
            emailkh: email,
            matkhaukh: matkhau
        }).then(khachhang=>{
            if(khachhang){
                var tokenkhachhang = jwt.sign({
                    id: khachhang.makh,
                },'thanhloc')
                return res.status(200).cookie('token',tokenkhachhang).redirect('/');
            }else{
                NhanVien.findOne({
                emailnv: email,
                matkhaunv: matkhau
                 })
                .then(nhanvien=>{
                    if(nhanvien){
                        var tokennhanvien = jwt.sign({
                            id: nhanvien.manv,
                            chucvu: nhanvien.chucvu
                        },'thanhloc')
                        return res.status(200).cookie('token',tokennhanvien).redirect('/');
                    }else{
                        return res.status(404).json('Sai mat khau')
                    }
                })
                .catch( next);
            }
        })
        .catch( next);
    }
    timkiem(req,res){
        res.render('khac/timkiem');
    }





    // Tim kiem san pham
    async timkiemsanpham(req, res, next){
        const sanphams = await SanPham.find({});
        const tukhoatimkiem = req.body.tukhoasp;
        var ketquatimkiems = sanphams.filter((ketqua)=>{
            return ketqua.tensp.toLowerCase().includes(tukhoatimkiem.toLowerCase())
                    || ketqua.loaisp.toLowerCase().includes(tukhoatimkiem.toLowerCase())
        })
         //Hiễn thị thông tin tài khoản đã đăng nhập
        var thongtintaikhoan;
        var makh
        if(req.taikhoan != undefined){
            if(req.taikhoan.chucvu != undefined){
                var manv = req.taikhoan.id
                thongtintaikhoan = await NhanVien.findOne({manv: manv})
            }else{
                var makh = req.taikhoan.id
                thongtintaikhoan = await KhachHang.findOne({makh: makh})
            }
             if (thongtintaikhoan.manv){
                makh = thongtintaikhoan.manv
            }else{
                makh = thongtintaikhoan.makh
            }
        }
            const giohangs = await GioHang.find({makh: makh});
            const soluongsptronggio = giohangs.length;
        res.render('khac/timkiem', {
            ketquatimkiems: multipleMongooseToObject(ketquatimkiems),
            soluongsptronggio,
            giohangs: multipleMongooseToObject(giohangs),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
    }
}

module.exports = new KhacController;