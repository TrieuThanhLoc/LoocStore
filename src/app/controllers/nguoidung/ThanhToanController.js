const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
const Ngay = require('../../../util/ngay');
const LayThongTinKhachHang = require('../../../util/laythongtinkhachhang');
//San pham
const SanPham = require('../../../resources/models/SanPham');
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
const ThanhToan = require ('../../../resources/models/khachhang/ThanhToan');
const LuuGioHangThanhToan = require ('../../../resources/models/khachhang/LuuGioHangThanhToan');
const DonHang = require('../../../resources/models/DonHang');
const GioHang = require('../../../resources/models/GioHang');
const ChiTietDonHang = require('../../../resources/models/ChiTietDonHang');
const NhatKyDonHang = require('../../../resources/models/NhatKyDonHang');
const DiachiKhachHang = require('../../../resources/models/khachhang/DiaChiKhachHang');



class thanhtoanController{

    async index(req, res, next){
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        const giohangthanhtoan = await LuuGioHangThanhToan.findOne({makh: req.taikhoan.id})
        const diachikhachhangs = await DiachiKhachHang.find({makh: req.taikhoan.id})
        res.render('nguoidung/thanhtoan',{
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            giohangthanhtoan: MongooseToObject(giohangthanhtoan),
            diachikhachhangs: multipleMongooseToObject(diachikhachhangs),

        })

    }

    async luugiohangthanhtoan(req, res, next){
        var sanphamchons = req.body.san_pham_chon;
        var giohangthanhtoan = new LuuGioHangThanhToan();
        var giohangs = [];
        var tongtienthanhtoan = 0;
        var tongtien = 0 ;
        var giamgia = 0;

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
        
        for(var i = 0; i < sanphamchons.length; i++){
            await GioHang.updateOne({_id: sanphamchons[i]},{mausac: req.body.mausac[i], soluongsp: req.body.soluongsp[i]});
            const giohangtam = await GioHang.findOne({_id: sanphamchons[i]});
            giohangtam._doc.tongtamtinhspnay = giohangtam.giaban * giohangtam.soluongsp;
            tongtien += giohangtam.giaban * giohangtam.soluongsp;
            giohangs.push(giohangtam);
        }
        giohangthanhtoan.makh = req.taikhoan.id;
        giohangthanhtoan.giohang = giohangs;
        giohangthanhtoan.tongtien = tongtien;
        giohangthanhtoan.giamgia = giamgia;
        giohangthanhtoan.tongtienthanhtoan = tongtien - giamgia;
        
        const kiemtrasanphamtronggiohangtam = await LuuGioHangThanhToan.findOne({makh: giohangthanhtoan.makh})
        if(kiemtrasanphamtronggiohangtam != undefined){
            await LuuGioHangThanhToan.findOneAndReplace({makh: req.taikhoan.id},{
                makh: giohangthanhtoan.makh,
                giohang: giohangthanhtoan.giohang,
                tongtien: giohangthanhtoan.tongtien,
                giamgia: giohangthanhtoan.giamgia,
                tongtienthanhtoan: giohangthanhtoan.tongtienthanhtoan,
            })
        }else{
            await giohangthanhtoan.save()
        }
        
        res.redirect('/thanhtoan')
    }

    async dathang(req, res, next){
        const donhang = DonHang(req.body);
        donhang.ngaydathang = Ngay.ngayhomnay();
        donhang.trangthai = 'da_tiep_nhan';

        const nhatkydonhang = NhatKyDonHang();
        nhatkydonhang.madh = donhang._id;
        nhatkydonhang.ngaytiepnhan =  Ngay.ngayhomnay();
        await nhatkydonhang.save();
        await Promise.all( req.body.masp.map( async(masp, i) => {
            const chitietdonhang = new ChiTietDonHang();
            chitietdonhang.masp = masp
            chitietdonhang.madh = donhang._id
            chitietdonhang.soluongdat = req.body.soluongsp[i]
            chitietdonhang.mausacdat = req.body.mausac[i]
            var sanpham = await SanPham.findOne({masp: masp});
            sanpham.soluong = sanpham.soluong - 1;
            await sanpham.save();
            return await chitietdonhang.save()
        }))
        donhang.save();
        await GioHang.deleteMany({makh: req.body.makh, masp: {$in: req.body.masp}})
        await LuuGioHangThanhToan.deleteOne({_id: req.body._idgiohangthanhtoan})
        res.redirect('/')
    }
    async muangay(req, res, next){
        const giohang = await GioHang();
        var thongtintaikhoan;
        const masp = req.params.masp;
        if(masp != undefined){
        const sanpham = await SanPham.findOne({masp: masp})
         if(req.taikhoan != undefined){
            if(req.taikhoan.chucvu != undefined){
                var manv = req.taikhoan.id;
                thongtintaikhoan = await NhanVien.findOne({manv: manv});
            }else{
                var makh = req.taikhoan.id;
                thongtintaikhoan = await KhachHang.findOne({makh: makh});
            }
            giohang.masp = masp;
            giohang.anh = sanpham.anh;
            giohang.giaban = sanpham.giaban;
            giohang.hangsx = sanpham.hangsx;
            giohang.tensp = sanpham.tensp;
            if(thongtintaikhoan.manv != undefined){ 
                giohang.makh = thongtintaikhoan.manv
            }else{
                giohang.makh = thongtintaikhoan.makh
            }
            //Kiem tra san pham trong gio hang da co chua ?
            var sanphamtronggio = await GioHang.findOne({makh: giohang.makh, masp: giohang.masp })
            if(sanphamtronggio){
                sanphamtronggio.soluongsp += 1;
                await GioHang.updateOne({masp: giohang.masp, makh: giohang.makh}, sanphamtronggio)
                return res.redirect('/giohang');
            }else{
                giohang.soluongsp = 1;
                giohang.save()
                return res.redirect('/giohang');
            }
        }else{
            res.redirect('/giohang');
        }
    }else{
        return next();
    }
    }
}
module.exports = new thanhtoanController;