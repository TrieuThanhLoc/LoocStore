const { taikhoan } = require("../nguoidung/SamPhamController");
const jwt = require('jsonwebtoken');
const cookies = require("../../../config/cookie");
const NhanVien = require("../../../resources/models/NhanVien");
const KhachHang = require("../../../resources/models/khachhang/KhachHang");
const SanPham = require('../../../resources/models/SanPham')
const { MongooseToObject, multipleMongooseToObject } = require("../../../util/mongoose");
const Ngay = require("../../../util/ngay");
const GioHang = require("../../../resources/models/GioHang");

const Kho = require('../../../resources/models/Kho')

//Lay thong tin khach hang
const LayThongTinKhachHang = require("../../../util/laythongtinkhachhang");

//Gui email
const nodemailer = require("nodemailer");
const GuiEmail = require('../khac/guiemail/guimaxacthuc')

//timkiem
const LichSuTimKiem = require("../../../resources/models/khachhang/LichSuTimKiem");
const DanhGia = require("../../../resources/models/khachhang/DanhGia");



class KhacController{
    async index(req,res){
        const sanphams = await SanPham.find({});
        //Lay thong tin khach hang
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        // Sản phẩm bán chạy 
        const khos = await Kho.find({}).sort({soluongdaban: 'desc'})
        var topsanphams = [];
        var temp = 4;
        if(khos.length < 4){
            temp = khos.length
        }
        for (var i = 0 ; i < temp; i++){
            if(khos[i].soluongdaban >= 1){
                const sanpham = await SanPham.findOne({masp: khos[i].masp})
                khos[i]._doc.anh = sanpham.anh;
                khos[i]._doc.hangsx = sanpham.hangsx;
                khos[i]._doc.hidden = sanpham.hidden
                topsanphams.push(khos[i]);
            }
        }
        //Cặp nhặt giá bán và số lượng từ kho
        for(var i = 0; i < topsanphams.length; i++){
            const khos = await Kho.find({masp: topsanphams[i].masp}).sort({giaban: 'asc'});
            var soluongspcon = 0;
            // ketquatimkiems[i].giaban = await khos[1].giaban;
            for(var j = 0; j < khos.length; j++){
                soluongspcon += khos[j].soluongtrongkho
            }
            topsanphams[i].soluong = soluongspcon
        }

        //top dien duoc danh gia cao 
        const  danhgias = await DanhGia.find({sosao: {$gte: 4}}).sort({sosao: 'desc'});
        var topsanphamdanhgias = [];
        var temp = 4;
        if(danhgias.length < 4){
            temp = danhgias.length
        }
        const sanphamtheosaodanhgia = await SanPham.find({}).sort({saodanhgia: 'desc'})
        for (var i = 0 ; i < temp; i++){
            if(sanphamtheosaodanhgia[i].saodanhgia >= 3){
                topsanphamdanhgias.push(sanphamtheosaodanhgia[i]);
            }
        }
        //Cặp nhặt giá bán và số lượng từ kho
        for(var i = 0; i < topsanphamdanhgias.length; i++){
            const khos = await Kho.find({masp: topsanphamdanhgias[i].masp}).sort({giaban: 'asc'});
            var soluongspcon = 0;
            // ketquatimkiems[i].giaban = await khos[1].giaban;
            for(var j = 0; j < khos.length; j++){
                soluongspcon += khos[j].soluongtrongkho
            }
            topsanphamdanhgias[i]._doc.soluongtrongkho = soluongspcon
        }
        res.render('khac/home',{
            topsanphams: multipleMongooseToObject(topsanphams),
            topsanphamdanhgias: multipleMongooseToObject(topsanphamdanhgias),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
    }
    lienhe(req,res){
        res.render('khac/lienhe');
    }
    dangky(req,res){
        if(req.query._emaildacotk){
            const emailkh = req.query._emaildacotk
            return res.render('khac/dangky',{
                emailkh,
            });
        }else{
            res.render('khac/dangky');
        }
    }
    async dangkykh(req,res){
        req.body.emailkh = req.body.emailkh.toLowerCase();
        const khachhang = await KhachHang(req.body);
        const khachhangdatao = await KhachHang.findOne({makh: khachhang.makh})
        if(!khachhangdatao){
            khachhang.ngaytao = Ngay.ngaygiohomnay();
            khachhang.save().then(
            res.redirect('/dangnhap')
            )
        }else{
            const emailkh = khachhang.emailkh
            const URL = 'dangky?_emaildacotk=' + emailkh
            res.redirect(URL)
        }
    }
    dangnhap(req,res){
        if(req.query.loginfalse == "false"){
            const saimatkhau = true;
            const email = req.query.email
            return res.render('khac/dangnhap',{
                email, saimatkhau
            });
        }
        res.render('khac/dangnhap');
    }
    dangsuat(req,res,next){
        const xoatoken = ""
        res.status(200).cookie('token',xoatoken).redirect('/');
    }
    async xacthuc(req,res,next){
        const email = await req.body.email.toLowerCase();
        const matkhau = await req.body.matkhau;
        KhachHang.findOne({
            emailkh: email,
            matkhaukh: matkhau
        }).then(khachhang=>{
            if(khachhang){
                //Tai khoan khach hang bi vo hieu hoa
                if(khachhang.vohieuhoa){
                    return res.redirect('../dangnhap/?loginfalse=false&email='+email)
                }/////
            
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
                        //Tai khoan nhan vien bi vo hieu hoa
                        if(nhanvien.vohieuhoa){
                            return res.redirect('../dangnhap/?loginfalse=false&email='+email)
                        }/////
                        var tokennhanvien = jwt.sign({
                            id: nhanvien.manv,
                            chucvu: nhanvien.chucvu
                        },'thanhloc')
                        return res.status(200).cookie('token',tokennhanvien).redirect('/');
                    }else{
                        return res.redirect('../dangnhap/?loginfalse=false&email='+email)
                    }
                })
                .catch( next);
            }
        })
        .catch( next);
    }

    // Tim kiem san pham
    async timkiemsanpham(req, res, next){
        var sanphams;
        if(req.query.sapxep == 'desc'){
            sanphams = await SanPham.find({}).sort({giaban: 'desc'});
        }else{
            sanphams = await SanPham.find({}).sort({giaban: 'asc'});
        }
        const tukhoatimkiem = req.query.tukhoatimkiem;
        var ketquatimkiems = sanphams.filter((ketqua)=>{
            return ketqua.tensp.toLowerCase().includes(tukhoatimkiem.toLowerCase())
                    || ketqua.loaisp.toLowerCase().includes(tukhoatimkiem.toLowerCase())
        })
         //Hiễn thị thông tin tài khoản đã đăng nhập
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        // cặp nhật số lượng và giá tièn sản phẩm từ kho
        for(var i = 0; i < ketquatimkiems.length; i++){
            const khos = await Kho.find({masp: ketquatimkiems[i].masp}).sort({giaban: 'asc'});
            var soluongspcon = 0;
            // ketquatimkiems[i].giaban = await khos[1].giaban;
            for(var j = 0; j < khos.length; j++){
                soluongspcon += khos[j].soluongtrongkho
            }
            ketquatimkiems[i].soluong = soluongspcon
        }
        //Luu lich su tim kiem
        const datim = await LichSuTimKiem.findOne({makh: thongtintaikhoan._doc.makh, noidungtimkiem: tukhoatimkiem})
        console.log(datim)
        if(thongtintaikhoan != '' && datim == null){
            const lichsutimkiem = new LichSuTimKiem();
            lichsutimkiem.makh = thongtintaikhoan._doc.makh;
            lichsutimkiem.ngaytimkiem = Ngay.ngaygiohomnay();
            lichsutimkiem.noidungtimkiem = tukhoatimkiem;
            lichsutimkiem.save();
        }
        res.render('khac/timkiem', {
            ketquatimkiems: multipleMongooseToObject(ketquatimkiems),
            tukhoatimkiem,
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
        })
    }
    async xoalichsu(req, res, next){
        const makh = req.query.khachhang;
        await LichSuTimKiem.deleteMany({makh: makh}).then(
            res.redirect('back')
        )
    }

//Email can doi pass cua khach hang
    async quenmatkhau(req, res, next){
        res.render('khac/doimatkhau/quenmatkhau')
    }
    async nhapmaxacthuc(req, res, next){
        const emailkh = req.params.emailkh;
        const khachhang = await KhachHang.findOne({emailkh: emailkh})
        if(khachhang != undefined){
            const maxacthuc = GuiEmail.taoMa();
            GuiEmail.guimaxacthuc(emailkh, maxacthuc);
            await KhachHang.updateOne({emailkh: emailkh},{maxacthuc: maxacthuc})
            return res.render('khac/doimatkhau/nhapmaxacthuc',{
                emailkh,
            })
        }else {
            const chuacotaikhoan = true;
            return res.render('khac/doimatkhau/quenmatkhau',{
                chuacotaikhoan,
                emailkh,
            })
        }
    }
    async doimatkhau(req, res, next){
        const emailkh = req.body.emailkh;
        const khachhang = await KhachHang.findOne({emailkh: emailkh})
        if(khachhang.maxacthuc == req.body.maxacthuc){
            res.render('khac/doimatkhau/doimatkhau',{
                emailkh,
            })
        }else{
            const saimaxacthuc = true;
            res.render('khac/doimatkhau/nhapmaxacthuc',{
                emailkh,saimaxacthuc
            })
        }
    }
     async luumatkhaumoi(req, res, next){
        const emailkh = req.params.emailkh;
        const matkhaukh = req.body.matkhaukh;

        await KhachHang.updateOne({emailkh: emailkh},{matkhaukh: matkhaukh, maxacthuc: ''});
        res.redirect('../dangnhap')

    }
}

module.exports = new KhacController;