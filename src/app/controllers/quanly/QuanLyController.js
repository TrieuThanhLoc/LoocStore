const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
//San pham
const SanPham = require('../../../resources/models/SanPham');
const DonHang = require('../../../resources/models/DonHang');
const GioHang = require("../../../resources/models/GioHang");

const ChiTietDonHang = require('../../../resources/models/ChiTietDonHang');
const NhatKyDonHang = require('../../../resources/models/NhatKyDonHang');
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
//Bo dau tieng viet
function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"    
  ];
  for (var i=0; i<AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

class QuanLyController{
    async index(req,res){
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
        if(req.taikhoan.chucvu != undefined){
            if ((req.taikhoan.chucvu == 'nhap_hang')||(req.taikhoan.chucvu == 'ban_hang')||(req.taikhoan.chucvu == 'quan_ly')){
                return res.render('quanly/quanly',{
                    //Thong tin hiễn thị trên header
                    soluongsptronggio,
                    giohangs: multipleMongooseToObject(giohangs),
                    thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                });
            }else{
                return res.send('Không có quyền truy cặp trang quản lý');
            }
        }else{
            return res.send('Không có quyền truy cặp trang quản lý !');
        }
    }}
    async quanlysanpham(req,res, next){
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

            SanPham.find({}).then(sanphams => {
                res.render("quanly/quanlysanpham",{
                    sanphams: multipleMongooseToObject(sanphams),
                     //Thong tin hiễn thị trên header
                    soluongsptronggio,
                    giohangs: multipleMongooseToObject(giohangs),
                    thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                });
            })
            .catch(next);
        }
    }
    nhaphang(req, res, next){
        res.render('quanly/nhaphang');
    }
    luuhang(req, res, next){
        // Xu ly nhap hang 
        const sanpham = new SanPham();
        const trongluongvathietke = new TrongLuongVaThietKe(); 
        const boxuly = new BoXuLy();
        const camera = new Camera();
        const giaotiepvaketnoi = new GiaoTiepVaKetNoi();
        const hedieuhanh = new HeDieuHanh();
        const luutru = new LuuTru();
        const manhinh = new ManHinh();
        const pin = new Pin();
        const kho = new Kho();

        sanpham.masp = req.body.masp;
        sanpham.tensp = req.body.tensp;
        sanpham.giagoc = req.body.giagoc;
        sanpham.giaban = req.body.giaban;
        sanpham.anh = req.body.anh;
        sanpham.soluong = req.body.soluong;
        sanpham.hangsx = req.body.hangsx;
        sanpham.soluong = req.body.soluong;
        sanpham.loaisp = req.body.loaisp;

        trongluongvathietke.masp = req.body.masp;
        trongluongvathietke.kichthuoc = req.body.kichthuoc;
        trongluongvathietke.trongluong = req.body.trongluong;
        trongluongvathietke.khangnuoc = req.body.khangnuoc;
        trongluongvathietke.chatluong = req.body.chatluong;
        trongluongvathietke.mausac = req.body.mausac;

        boxuly.masp = req.body.masp;
        boxuly.cpu = req.body.cpu;
        boxuly.loaicpu = req.body.loaicpu;
        boxuly.sonhan = req.body.sonhan;

        manhinh.masp = req.body.masp;
        manhinh.tyledientichmanhinh = req.body.tyledientichmanhinh;
        manhinh.kichthuocmanhinh = req.body.kichthuocmanhinh;
        manhinh.maumanhinh = req.body.maumanhinh;
        manhinh.loaicamung = req.body.loaicamung;
        manhinh.tylekhunghinh = req.body.tylekhunghinh;
        manhinh.congnghemanhinh = req.body.congnghemanhinh;
        manhinh.chuanmanhinh = req.body.chuanmanhinh;
        manhinh.dophangiai = req.body.dophangiai;
        manhinh.tansoquet = req.body.tansoquet;
        manhinh.kichthuocmanhinhphu = req.body.kichthuocmanhinhphu;

        luutru.masp = req.body.masp;
        luutru.ram = req.body.ram;
        luutru.loairam = req.body.loairam;
        luutru.rom = req.body.rom;
        luutru.thenhongoai = req.body.thenhongoai;

        camera.masp = req.body.masp;
        camera.camtruoc = req.body.camtruoc;
        camera.tinhnangcamtruoc = req.body.tinhnangcamtruoc;
        camera.quayphimcamtruoc = req.body.quayphimcamtruoc;
        camera.camgocrong = req.body.camgocrong;
        camera.camgocsieurong = req.body.camgocsieurong;
        camera.cammacro = req.body.cammacro;
        camera.tinhnangcamsau = req.body.tinhnangcamsau;
        camera.quayphimcamsau = req.body.quayphimcamsau;

        giaotiepvaketnoi.masp = req.body.masp;
        giaotiepvaketnoi.baomat = req.body.baomat;
        giaotiepvaketnoi.sosim = req.body.sosim;
        giaotiepvaketnoi.loaisim = req.body.loaisim;
        giaotiepvaketnoi.hotromang = req.body.hotromang;
        giaotiepvaketnoi.conggiaotiep = req.body.conggiaotiep;
        giaotiepvaketnoi.wifi = req.body.wifi;
        giaotiepvaketnoi.gps = req.body.gps;
        giaotiepvaketnoi.ketnoikhac = req.body.ketnoikhac;

        hedieuhanh.masp = req.body.masp;
        hedieuhanh.os = req.body.os;
        hedieuhanh.phienban = req.body.phienban;

        pin.masp = req.body.masp;
        pin.dungluongpin = req.body.dungluongpin;
        pin.congnghepin = req.body.congnghepin;

        kho.masp = req.body.masp;
        kho.mausac = req.body.mausac;
        kho.mamau = removeAccents(req.body.mausac);
        kho.ram = req.body.ram;
        kho.rom = req.body.rom;
        kho.soluong = req.body.soluong;
        kho.giaban = req.body.giaban;

        boxuly.save();
        camera.save();
        giaotiepvaketnoi.save();
        hedieuhanh.save();
        luutru.save();
        manhinh.save();
        pin.save();
        trongluongvathietke.save();
        sanpham.save();
        kho.save();
        res.redirect('../quanly/sanpham');
        // res.json(req.body)
    }
// Quan ly kho
    async kho(req, res, next){
        const masp = req.params.masp
        var kho = await Kho.find({masp: masp})
        res.render('quanly/kho',{
            kho: multipleMongooseToObject(kho),
            masp,
        });
    }
    async capnhatkho(req, res, next){
        const masp = req.body.masp;
        const mamau = req.body.mamau;
        const kho = await Kho.findOne({masp: masp, mamau: mamau});
        res.render('quanly/capnhatkho',{
            kho: MongooseToObject(kho),
        })
    }
    async luuthaydoikho (req, res, next){
        const masp = req.body.masp;
        const mamau = req.body.mamau;
        const soluong = req.body.soluong;
        await  SanPham.updateOne({masp: masp}, {soluong: soluong})
        await Kho.updateOne({masp: masp, mamau: mamau}, req.body)
        res.redirect('../../quanly/sanpham')
    }
    async themmausanpham (req, res, next){
        const sanpham = await SanPham.findOne({masp: req.params.masp})
        return res.render('quanly/themmausp',{
            sanpham: MongooseToObject(sanpham),
        })
    }
    async luumausanpham(req, res, next){
        const kho = await Kho(req.body);
        const mamau = removeAccents(req.body.mausac);
        kho.mamau = mamau;
        kho.masp =  req.params.masp;
        const timmausp = await Kho.findOne({ mamau: mamau, masp: req.params.masp});
        if(timmausp != undefined){
            await Kho.updateOne({masp: req.params.masp, mamau: mamau},req.body)
            res.redirect('back')
        }else{
            kho.save()
            res.redirect('back')
        }
      
       
    }

    async sua(req, res, next){
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
        const kho = await Kho.findOne({masp: masp});

        res.render("quanly/chinhsua",{
            sanpham: MongooseToObject(sanpham),
            trongluongvathietke: MongooseToObject(trongluongvathietke),
            boxuly: MongooseToObject(boxuly),
            camera: MongooseToObject(camera),
            giaotiepvaketnoi: MongooseToObject(giaotiepvaketnoi),
            hedieuhanh: MongooseToObject(hedieuhanh),
            luutru: MongooseToObject(luutru),
            manhinh: MongooseToObject(manhinh),
            pin: MongooseToObject(pin),
            kho: MongooseToObject(kho),
        })
    }
    async capnhathang(req, res, next){  
        const masp = req.params.masp;
        await SanPham.updateOne({masp: masp},req.body);
        await TrongLuongVaThietKe.updateOne({masp: masp},req.body);
        await BoXuLy.updateOne({masp: masp},req.body);
        await Camera.updateOne({masp: masp},req.body);
        await GiaoTiepVaKetNoi.updateOne({masp: masp},req.body);
        await HeDieuHanh.updateOne({masp: masp},req.body);
        await LuuTru.updateOne({masp: masp},req.body);
        await ManHinh.updateOne({masp: masp},req.body);
        await Pin.updateOne({masp: masp},req.body);
        await Kho.updateOne({masp: masp},req.body);
        var mamau = removeAccents(req.body.mausac);
        await Kho.updateOne({masp: masp},{mamau: mamau});
        res.redirect('../../quanly/sanpham');
    }
    async xoa(req, res, next){
        const masp = req.params.masp;
        await SanPham.deleteOne({masp: masp});
        await TrongLuongVaThietKe.deleteOne({masp: masp});
        await BoXuLy.deleteOne({masp: masp});
        await Camera.deleteOne({masp: masp});
        await GiaoTiepVaKetNoi.deleteOne({masp: masp});
        await HeDieuHanh.deleteOne({masp: masp});
        await LuuTru.deleteOne({masp: masp});
        await ManHinh.deleteOne({masp: masp});
        await Pin.deleteOne({masp: masp});
        await Kho.deleteOne({masp: masp});
        res.redirect('back');
    }
//Quan ly nhan vien
    async qunalynhanvien(req,res,next){
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

            if ((req.taikhoan.chucvu != 'quan_ly')){
                return res.send('Không có quyền truy cặp quản lý');
            }
            const nhanviens = await NhanVien.find({})
            if(nhanviens){
                res.render('quanly/quanlynhanvien', 
                    {
                        nhanviens: multipleMongooseToObject(nhanviens),
                        //Thong tin hiễn thị trên header
                        soluongsptronggio,
                        giohangs: multipleMongooseToObject(giohangs),
                        thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                    }
                )
            }   
        }
    }
     themnhanvien(req,res,next){
        res.render('quanly/themnhanvien');
    }
    luunhanvien(req,res,next){
        const nhanviens = new NhanVien(req.body);
        nhanviens.save()
                        .then(() => res.redirect('../../quanly/nhanvien'))
                        .catch(next);
    }
    //Quản lý đơn hàng
    async quanlydonhang(req,res){
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
            const donhangs = await DonHang.find({});
            res.render('quanly/quanlydonhang',{
                donhangs: multipleMongooseToObject(donhangs),
                 //Thong tin hiễn thị trên header
                soluongsptronggio,
                giohangs: multipleMongooseToObject(giohangs),
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            })
        }
    }
    async xoadon(req,res){
        await DonHang.deleteOne({_id: req.params._id});
        const chitietdonhangs = await ChiTietDonHang.find({madh: req.params._id});

        for(var i = 0; i < chitietdonhangs.length; i++){
            var sanpham = await SanPham.findOne({masp: chitietdonhangs[i].masp});
            sanpham.soluong = sanpham.soluong + 1;
            sanpham.save();
        }

        res.redirect('/');
    }
    async capnhattrangthai (req, res, next){
        var nhatkydonhang = await NhatKyDonHang();
        nhatkydonhang.madh = req.params._id;
        //ngay dat hang
        var today = new Date()
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();

        await DonHang.updateOne({_id: req.params._id},{trangthai: req.body.trangthai})

        const daconhatky = await NhatKyDonHang.findOne({madh: req.params._id})
        if(daconhatky != undefined){
             if(req.body.trangthai == 'van_chuyen'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayvanchuyen: date + ' ' + time})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'dang_giao'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngaygiaohang: date + ' ' + time})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'hoan_thanh'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayhoanthanh: date + ' ' + time})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'da_huy'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayhuyhang: date + ' ' + time})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
                //xoá yêu cầu huỷ đơn của khách hàng
                await DonHang.findOne({_id: req.params._id})
                    .then((donhang)=>{
                        const chitietdonhangs = ChiTietDonHang.find({madh: donhang._id});
                        for(var i = 0; i < chitietdonhangs.length; i++){
                            var sanpham = SanPham.findOne({masp: chitietdonhangs[i].masp});
                            sanpham.soluong = sanpham.soluong + 1;
                            sanpham.save();
                        }
                        donhang.yeucauhuydon = false;
                        donhang.save();
                    })
            }
        }else{
            if(req.body.trangthai == 'van_chuyen'){
                nhatkydonhang.ngayvanchuyen = date + ' ' + time
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'dang_giao'){
                nhatkydonhang.ngaygiaohang = date + ' ' + time
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'hoan_thanh'){
                nhatkydonhang.ngayhoanthanh = date + ' ' + time
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'da_huy'){
                nhatkydonhang.ngayhuy = date + ' ' + time
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
                //xoá yêu cầu huỷ đơn của khách hàng
                await DonHang.findOne({_id: req.params._id})
                    .then((donhang)=>{
                        const chitietdonhangs = ChiTietDonHang.find({madh: req.params._id});
                        for(var i = 0; i < chitietdonhangs.length; i++){
                            var sanpham = SanPham.findOne({masp: chitietdonhangs[i].masp});
                            sanpham.soluong = sanpham.soluong + 1;
                            sanpham.save();
                        }
                        donhang.yeucauhuydon = false;
                        donhang.save();
                })
            }
        }
        res.redirect('back')
    }
    async quanlymotdonhang(req, res, next){
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

            const donhang = await DonHang.findOne({_id: req.params._id});
            const chitietdonhangs = await ChiTietDonHang.find({madh: req.params._id});
            var sanphams = [];
            for(var i = 0; i < chitietdonhangs.length; i++){
                const sanpham = await SanPham.findOne({masp: chitietdonhangs[i].masp});
                sanpham._doc.mausacdat = chitietdonhangs[i].mausacdat;
                sanpham._doc.soluongdat = chitietdonhangs[i].soluongdat;
                sanphams.push(sanpham);
            }
            const nhatkydonhang = await NhatKyDonHang.findOne({madh: req.params._id})
            res.render('quanly/quanlymotdonhang',{
                donhang: MongooseToObject(donhang),
                nhatkydonhang: MongooseToObject(nhatkydonhang),
                chitietdonhangs: multipleMongooseToObject(chitietdonhangs),
                sanphams: multipleMongooseToObject(sanphams),
                 //Thong tin hiễn thị trên header
                soluongsptronggio,
                giohangs: multipleMongooseToObject(giohangs),
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            })
        }
    }



    quanlytaikhoan(req,res){
        res.render('quanly/quanlytaikhoan');
    }
}

module.exports = new QuanLyController;