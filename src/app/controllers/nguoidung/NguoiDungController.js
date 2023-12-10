const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
const LayThongTinKhachHang = require('../../../util/laythongtinkhachhang');
const Ngay = require('../../../util/ngay');
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

const BinhLuan = require('../../../resources/models/sanphaminfo/BinhLuan');
const TraLoiBinhLuan = require('../../../resources/models/sanphaminfo/TraLoiBinhLuan');

const Kho = require('../../../resources/models/Kho');
//Nhan vien
const NhanVien = require ('../../../resources/models/NhanVien');
const KhachHang = require ('../../../resources/models/khachhang/KhachHang');
const DanhGia = require ('../../../resources/models/khachhang/DanhGia');
const ChatLuongDichVu = require ('../../../resources/models/khachhang/ChatLuongDichVu');
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
        var donhangs = await DonHang.find({makh: makh}).sort({ngaydathang: 'desc'})
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
        // donhangs = donhangs.sort(function(dh1, dh2){
        //     let a = dh1.ngaydathang;
        //     let b = dh2.ngaydathang;
        //     if (a > b) return -1;
        //     if (a < b) return 1;
        //     return 0;
        // })
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
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        const giohangs = await GioHang.find({makh: thongtintaikhoan.makh});
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
        var chuadanhgia = false
        if(donhang.trangthai == 'hoan_thanh' && donhang.danhgia == false){
            chuadanhgia = true
        }
        res.render('nguoidung/chitietdonhang',{
                nhatkydonhang: MongooseToObject(nhatkydonhang),
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                donhang: MongooseToObject(donhang),
                chuadanhgia,
                soluongsptronggio,
        })
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
    async danhgia(req, res, next){
        const madh = req.query.ma_don
        const chitietdonhangs = await ChiTietDonHang.find({madh: madh});
        var donhang = await DonHang.findOne({_id: madh});
        var sanphams = [];

        for(var i = 0; i < chitietdonhangs.length; i++){
            const sanpham = await SanPham.findOne({masp: chitietdonhangs[i].masp});
            sanphams.push(sanpham);
        }
        donhang._doc.sanphams = sanphams
        res.render('nguoidung/danhgia',{
            madh,
            donhang: MongooseToObject(donhang),
        })
    } 
    async thuchiendanhgia(req, res, next){
        const masp = req.body.masp;
        const sosao = req.body.sosao;
        const noidungdanhgia = req.body.noidungdanhgia;

         //Lay thong tin khach hang
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })

        for(var i = 0; i < masp.length; i ++){
            const danhgia = new DanhGia();
            const chatluongdichvu = new ChatLuongDichVu();
            const sanpham = new SanPham();
            if(masp[i] == 'chat_luong_dich_vu'){
                chatluongdichvu.makh = thongtintaikhoan._doc.makh;
                chatluongdichvu.sosao = sosao[i];
                chatluongdichvu.noidungdanhgia = noidungdanhgia[i];

                chatluongdichvu.ngaydanhgia = Ngay.ngaygiohomnay()
                await chatluongdichvu.save();
            }else{
                danhgia.makh = thongtintaikhoan._doc.makh;
                danhgia.masp = masp[i];
                danhgia.sosao = sosao[i];
                danhgia.noidungdanhgia = noidungdanhgia[i];
                danhgia.ngaydanhgia = Ngay.ngaygiohomnay();
                await danhgia.save();

                //Cap nhat sao danh gia 
                const danhgias = await DanhGia.find({masp: masp[i]});
                var tongsao = 0;
                for(var j = 0; j < danhgias.length; j++){
                    tongsao += danhgias[j].sosao
                }
                var trungbinhsao = tongsao / danhgias.length;
                await SanPham.updateOne({masp: masp[i]}, {
                    saodanhgia: trungbinhsao,
                });
            }
        }
        await DonHang.updateOne({_id: req.params.madh},{
            danhgia: true,
        })
        await NhatKyDonHang.updateOne({madh: req.params.madh},{
            ngaydanhgia: Ngay.ngaygiohomnay(),
        })
        res.redirect('../../nguoidung/donhang')
    }
    //Binh luan san pham 
    async binhluan(req, res, next){
        //Lay thong tin nguoi dung
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })

        var binhluan = new BinhLuan();
        binhluan.makh = thongtintaikhoan._doc.makh;
        binhluan.masp = req.params.masp;
        binhluan.noidungbinhluan = req.query.noidungbinhluan;
        binhluan.ngaybinhluan = Ngay.ngaygiohomnay();
        await binhluan.save();
        res.redirect('back');
    }
     async traloibinhluan(req, res, next){
        //Lay thong tin nguoi dung
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })

        var traloibinhluan = new TraLoiBinhLuan();
        traloibinhluan.makh = thongtintaikhoan._doc.makh;
        traloibinhluan.mabl = req.params.mabl;
        traloibinhluan.noidungtraloi = req.query.noidungtraloi;
        traloibinhluan.ngaytraloi = Ngay.ngaygiohomnay();
        await traloibinhluan.save();
        res.redirect('back');
    }

    //tài khoản của tôi 
    async taikhoancuatoi(req, res, next){
        //Lay thong tin nguoi dung
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        const donhangs = await DonHang.find({makh: thongtintaikhoan.makh})
        let tongtienthanhtoan = 0;
        let sosanphammua = 0
        for(var i = 0 ; i < donhangs.length; i++){
            tongtienthanhtoan += Number(donhangs[i].tienthanhtoan);
            const chitietdonhangs = await ChiTietDonHang.find({madh: donhangs[i]._id})
            for(var j = 0 ; j < chitietdonhangs.length; j++){
                sosanphammua += chitietdonhangs[j].soluongdat
            }
        }

        res.render('nguoidung/taikhoancuatoi',{
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            donhangs: multipleMongooseToObject(donhangs),
            sosanphammua,
            tongtienthanhtoan,


        })
    }
}
module.exports = new thanhtoanController;
