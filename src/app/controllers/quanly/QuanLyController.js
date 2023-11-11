const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
const LayThongTinDangNhap = require('../../../util/laythongtinkhachhang');
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
const PhieuNhap = require('../../../resources/models/PhieuNhap');
//Nhan vien
const NhanVien = require ('../../../resources/models/NhanVien');
const KhachHang = require ('../../../resources/models/khachhang/KhachHang');
const DanhGia = require ('../../../resources/models/khachhang/DanhGia');

const Ngay = require('../../../util/ngay');


var storage = require('node-persist');


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
                    layout: 'admin'
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
                    layout: 'admin'

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
    }
// Quan ly kho ----------------------------------------
    async kho(req, res, next){
        var kho = await Kho.find({}).sort({tensp: 'asc'})
        res.render('quanly/kho/khohang',{
            kho: multipleMongooseToObject(kho),
            layout: 'admin'
        });
    }
    async quanlykho(req, res, next){
        res.render('quanly/kho/quanlykho',{
        layout: 'admin'
        });
    }
    async chonsanphamnhap(req, res, next){
        const sanphams = await SanPham.find({}).sort({hangsx: 'asc'});

        res.render('quanly/kho/chonsanphamnhap',{
            sanphams: multipleMongooseToObject(sanphams),
            layout:'admin',
        });
   }
   async nhapkho(req, res, next){
        var sanphams = [];
        const ngaynhaphang = Ngay.ngayhomnay();
        //Thông tin khách hàng lên header
        let thongtintaikhoan = new Object;
        await LayThongTinDangNhap(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        await Promise.all(req.body.masp.map(async (masp, i)=>{
            const sanpham = await SanPham.findOne({masp: masp})
            sanphams.push(sanpham)
        }))
        res.render('quanly/kho/phieunhapkho',{
            sanphams: multipleMongooseToObject(sanphams),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            ngaynhaphang,
            layout:'admin'
        });
   }
    async luukho(req, res, next){
        var tongtiennhaphang = 0;
        for(var i = 0; i < req.body.masp.length; i++){
            //Kiem tra trong kho co san pham nay chua 
            const trongkho = await Kho.findOne({masp: req.body.masp[i], mausac: req.body.mausac[i]});
            if(!trongkho){
                var kho = new Kho();
                kho.masp = req.body.masp[i];
                kho.tensp = req.body.tensp[i];
                kho.mausac = req.body.mausac[i];
                kho.soluongtrongkho = req.body.soluongnhap[i];
                kho.soluongdaban = 0;
                kho.gianhap = req.body.gianhap[i];
                kho.giaban =  Number(req.body.gianhap[i])*1.2;
                await kho.save();
                tongtiennhaphang += Number(req.body.gianhap[i])*req.body.soluongnhap[i];
            }else{
                var giaban = Number(req.body.gianhap[i])*1.2;
                var soluongtrongkho = trongkho.soluongtrongkho + Number(req.body.soluongnhap[i]);
                await Kho.updateOne({masp: req.body.masp[i], mausac: req.body.mausac[i]},{
                    soluongtrongkho: soluongtrongkho,
                    gianhap: Number(req.body.gianhap[i]),
                    giaban: giaban,
                })
            }
        }
        
        //Thông tin khách hàng lên header
        let thongtintaikhoan = new Object;
        await LayThongTinDangNhap(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        var phieunhap = new PhieuNhap();
        phieunhap.masp = req.body.masp;
        phieunhap.tensp = req.body.tensp;
        phieunhap.mausac = req.body.mausac;
        phieunhap.soluongsp = req.body.soluongnhap;
        phieunhap.gianhapsp = req.body.gianhap;
        phieunhap.manv = thongtintaikhoan.manv;
        phieunhap.ngaynhaphang = Ngay.ngayhomnay();
        phieunhap.tongtiennhaphang = tongtiennhaphang;
        await phieunhap.save();

        res.redirect('../quanly/kho')
    }
    async xoakho(req, res, next){
            await Kho.deleteOne({_id: req.params._id});
            res.redirect('back')
        }
    async phieunhap(req, res, next){
        const phieunhaps = await PhieuNhap.find({}).sort({ngaynhaphang: 'asc'})
        res.render('quanly/kho/quanlyphieunhap',{
            phieunhaps: multipleMongooseToObject(phieunhaps),
            layout: 'admin'
        })
    }
    
    // -------------------------------------Thóng kê-------------------------------------
    async thongke(req, res, next){
        //------Thống kê dòng tiền ------
        //TỔng doanh thu 
        const donhangstam = await DonHang.find({trangthai: 'hoan_thanh'});
        var doanhthuthang, doanhthunam;
        var thuthang = 0, thunam = 0;
        for(var i  = 0; i < donhangstam.length; i++){
            const thangdathang = donhangstam[i].ngaydathang.split('-',2)
            if(Number(thangdathang[1]) == Ngay.thangnay()){
                thuthang += Number(donhangstam[i].tienthanhtoan);
            }
            const namdathang = donhangstam[i].ngaydathang.split('-',3)
            if(Number(namdathang[2]) == Ngay.namnay()){
                thunam += Number(donhangstam[i].tienthanhtoan);
            }
        }
        doanhthuthang = ({thang: Ngay.thangnay(), doanhthu: thuthang})
        doanhthunam = ({nam: Ngay.namnay(), doanhthu: thunam})
        //Tổng phí nhập hàng 
        const phieunhaps = await PhieuNhap.find({});
        var phinhaphangthang;
        var phinhaphangnam;
        var nhapthang =0;
        var nhapnam = 0;
         for(var i  = 0; i < phieunhaps.length; i++){
            const thangdathang = phieunhaps[i].ngaynhaphang.split('-',2)
            if(Number(thangdathang[1]) == Ngay.thangnay()){
                nhapthang += Number(phieunhaps[i].tongtiennhaphang);
            }
            const namdathang = phieunhaps[i].ngaynhaphang.split('-',3)
            if(Number(namdathang[2]) == Ngay.namnay()){
                nhapnam += Number(phieunhaps[i].tongtiennhaphang);
            }
        }
        phinhaphangthang = ({thang: Ngay.thangnay(), phinhap: nhapthang})
        phinhaphangnam = ({nam: Ngay.namnay(), phinhap: nhapthang})

        //Lợi nhuận theo tháng, năm
        var loinhuanthang, loinhuannam;
        loinhuanthang = ({thang: Ngay.thangnay(), loinhuan: doanhthuthang.doanhthu - phinhaphangthang.phinhap})
        loinhuannam = ({nam: Ngay.namnay(), loinhuan: doanhthunam.doanhthu - phinhaphangnam.phinhap })
        
        //thông tin thống kê tổng quan 
        const donhangs = await DonHang.find({}).sort({ngaydathang: 'desc'})
        const tongdon = donhangs.length;

        const khachhangs = await KhachHang.find({});
        const tongtaikhoankh = khachhangs.length;

        const sanphams = await SanPham.find({});
        const tongsanpham = sanphams.length;

        const danhgias = await DanhGia.find({}).sort({sosao: 'desc'})
        const tongdanhgia = danhgias.length;

        //thông tin top
        for(var i = 0; i < khachhangs.length; i++){
            const sodonhang = (await DonHang.find({makh: khachhangs[i].makh, trangthai: {$ne: 'da_huy'}})).length;
            khachhangs[i]._doc.soluotmua = sodonhang;
            await KhachHang.updateOne({makh: khachhangs[i].makh},{
                soluotmua: sodonhang,
            })
        }

        //Khách hàng thân thiết
        const topkhachhangs = await KhachHang.find({}).sort({soluotmua: 'desc'})
        const top3kh = []
        for (var i = 0 ; i < 2 ; i++){
            if(topkhachhangs[i].soluotmua >= 1){
                top3kh.push(topkhachhangs[i])
            }
        }
        //top sảm phẩm bán chạy
        const khos = await Kho.find({}).sort({soluongban: 'desc'})
        var topsanphams = [];
        var temp = 5;
        if(khos.length < 5){
            temp = khos.length
        }
        for (var i = 0 ; i < temp; i++){
            if(khos[i].soluongdaban >= 1){
                const sanpham = await SanPham.findOne({masp: khos[i].masp})
                khos[i]._doc.anh = sanpham.anh;
                khos[i]._doc.hangsx = sanpham.hangsx;
                topsanphams.push(khos[i]);
            }
        }


        //San pham duoc danh gia cao
        var topdanhgia = [];
        var temp = 5;
        if(khos.length < 5){
            temp = khos.length
        }
        for (var i = 0 ; i < temp; i++){
            if(danhgias[i].sosao >= 1){
                const sanpham = await SanPham.findOne({masp: khos[i].masp})
                const kho = await Kho.findOne({masp: khos[i].masp})
                danhgias[i]._doc.anh = sanpham.anh;
                danhgias[i]._doc.tensp = sanpham.tensp;
                danhgias[i]._doc.hangsx = sanpham.hangsx;
                danhgias[i]._doc.giaban = kho.giaban;
                topdanhgia.push(danhgias[i]);
            }
        }

        //Đơn hàng mới nhất
        var donhangsmoi = [];
        var temp = 5;
        if(donhangs.length < 5){
            temp = donhangs.length
        }
        for (var i = 0 ; i < temp; i++){
            if(donhangs[i].trangthai != 'da_huy'){
                donhangsmoi.push(donhangs[i]);
            }
        }
        res.render('quanly/thongke/tongquan',{
            //tổng doanh thu
            doanhthuthang,
            doanhthunam,

            phinhaphangthang,
            phinhaphangnam,

            loinhuanthang,
            loinhuannam,
            //tong quan
            tongdon,
            tongtaikhoankh,
            tongsanpham,
            tongdanhgia,
            //top
            top3kh: multipleMongooseToObject(top3kh),
            topsanphams: multipleMongooseToObject(topsanphams),
            topdanhgia: multipleMongooseToObject(topdanhgia),
            donhangsmoi: multipleMongooseToObject(donhangsmoi),

            layout:'admin'
        })
    }
    async trangthaidonhang(req, res, next){
        const donhangs = await DonHang.find({});
        var trangthaidonhangs = [];
        var tiep_nhan = 0, van_chuyen = 0, dang_giao = 0, hoan_thanh = 0, da_huy = 0;
        for (var i = 0; i<donhangs.length; i++){
            if(donhangs[i].trangthai == 'da_tiep_nhan'){
                tiep_nhan++;
            }else if(donhangs[i].trangthai == 'van_chuyen'){
                van_chuyen++;
            }else if(donhangs[i].trangthai == 'dang_giao'){
                dang_giao++;
            }else if(donhangs[i].trangthai == 'hoan_thanh'){
                hoan_thanh++;
            }else if(donhangs[i].trangthai == 'da_huy'){
                da_huy++;
            }
        }
        trangthaidonhangs.push(tiep_nhan);
        trangthaidonhangs.push(van_chuyen);
        trangthaidonhangs.push(dang_giao);
        trangthaidonhangs.push(hoan_thanh);
        trangthaidonhangs.push(da_huy);
        res.render('quanly/thongke/trangthaidonhang',{
            trangthaidonhangs,
            layout:'admin'
        })
    }
    async doanhthu(req, res, next){
        if(req.query.xemtheo == 'ngay'){
             //Thống kê số lượng sản phẩm  theo tháng
            var doanhthungay = [0,0,0,0,0,0,0]
            var laybelsngay = [0,0,0,0,0,0,0];
            const today = new Date();
            const day = today.getDate();
            const donhangs = await DonHang.find({ngaydathang: {$gt : ''}, trangthai: 'hoan_thanh'});
            
            for(var i  = 0; i < donhangs.length; i++){
                var ngayganday = Number(day) - Number(donhangs[i].ngaydathang.split('-',1))

                if(Math.abs(ngayganday) < 7){
                    for(var j = 6; j >= 0; j--){
                        if(Math.abs(ngayganday) == j){
                            doanhthungay[6-j] += Number(donhangs[i].tienthanhtoan);
                        }
                    }
                }
                for(var j = 6; j >= 0; j--){
                    var ngayhomnay = today.getDate()-j;
                    if (ngayhomnay <= 0 && today.getMonth() == 2){
                        ngayhomnay += 28
                        
                    }else if(ngayhomnay <= 0 && 
                    (today.getMonth() == 1 
                    || today.getMonth() == 3 
                    || today.getMonth() == 5
                    || today.getMonth() == 7
                    || today.getMonth() == 9
                    || today.getMonth() == 11)
                    ){
                        ngayhomnay += 31
                    }
                    else if(ngayhomnay <= 0 &&
                    (today.getMonth() == 2
                    || today.getMonth() == 4
                    || today.getMonth() == 6
                    || today.getMonth() == 8
                    || today.getMonth() == 10
                    || today.getMonth() == 12)
                    ){
                        ngayhomnay += 30
                    }else{
                    }
                    laybelsngay[6-j] = ngayhomnay
                }
            }
            res.render('quanly/thongke/doanhthu',{
                doanhthungay,
                laybelsngay,
                layout:'admin'
            })
        }
        if(req.query.xemtheo == 'thang'){
             //Thống kê số lượng sản phẩm  theo tháng
            var doanhthuthang = [0,0,0,0,0,0,0,0,0,0,0,0]
            const donhangs = await DonHang.find({ngaydathang: {$gt : ''}, trangthai: 'hoan_thanh'});
            for(var i  = 0; i < donhangs.length; i++){
                for(var j = 1; j <= 12; j++){
                    const ngaydathang = donhangs[i].ngaydathang.split('-',2)
                    if(Number(ngaydathang[1]) == j){
                        doanhthuthang[j-1] += Number(donhangs[i].tienthanhtoan);
                    }
                }
            }
            res.render('quanly/thongke/doanhthu',{
                doanhthuthang,
                layout:'admin'
            })
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
            const giohangs = await GioHang.find({makh: makh}).sort({ngaythemvaogio: 'desc'});
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
                        layout: 'admin'
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
            const donhangs = await DonHang.find({}).sort({ngaydathang: 'desc'});
            res.render('quanly/quanlydonhang',{
                donhangs: multipleMongooseToObject(donhangs),
                 //Thong tin hiễn thị trên header
                soluongsptronggio,
                giohangs: multipleMongooseToObject(giohangs),
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                layout: 'admin'
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

        res.redirect('/quanly/donhang');
    }
    async capnhattrangthai (req, res, next){
        var nhatkydonhang = await NhatKyDonHang();
        nhatkydonhang.madh = req.params._id;

        await DonHang.updateOne({_id: req.params._id},{trangthai: req.body.trangthai})

        const daconhatky = await NhatKyDonHang.findOne({madh: req.params._id})
        if(daconhatky != undefined){
             if(req.body.trangthai == 'van_chuyen'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayvanchuyen: Ngay.ngaygiohomnay()})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'dang_giao'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngaygiaohang: Ngay.ngaygiohomnay()})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'hoan_thanh'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayhoanthanh: Ngay.ngaygiohomnay()})
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'da_huy'){
                await NhatKyDonHang.updateOne({madh:  req.params._id},{ngayhuyhang: Ngay.ngaygiohomnay()})
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
                nhatkydonhang.ngayvanchuyen = Ngay.ngaygiohomnay()
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'dang_giao'){
                nhatkydonhang.ngaygiaohang = Ngay.ngaygiohomnay()
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'hoan_thanh'){
                nhatkydonhang.ngayhoanthanh = Ngay.ngaygiohomnay()
                await nhatkydonhang.save();
                await DonHang.updateOne({_id:  req.params._id},req.body.trangthai)
            }else if(req.body.trangthai == 'da_huy'){
                nhatkydonhang.ngayhuy = Ngay.ngaygiohomnay()
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
                layout: 'admin'
            })
        }
    }



    quanlytaikhoan(req,res){
        res.render('quanly/quanlytaikhoan',{
            layout: 'admin'
        });
    }
}

module.exports = new QuanLyController;