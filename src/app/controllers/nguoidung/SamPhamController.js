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


const BinhLuan = require('../../../resources/models/sanphaminfo/BinhLuan');
const TraLoiBinhLuan = require('../../../resources/models/sanphaminfo/TraLoiBinhLuan');


const Kho = require('../../../resources/models/Kho')

const {MongooseToObject, multipleMongooseToObject} = require('../../../util/mongoose');
const KhachHang = require("../../../resources/models/khachhang/KhachHang");
//Lay thong tin khach hang
const LayThongTinKhachHang = require("../../../util/laythongtinkhachhang");
const DanhGia = require ('../../../resources/models/khachhang/DanhGia');


class SanPhamController{
    index(req,res){
        res.render('nguoidung/sanpham');
    }
    async chitiet(req, res, next){
        const masp = req.query.masp;
        if(masp != undefined){
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
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        
        //số sao đánh giá 
        const danhgias = await DanhGia.find({masp: masp});
        var danhgiasanpham = new Object();
        var motsao = 0, haisao = 0, basao = 0, bonsao = 0, namsao = 0;
        var tongsao = 0;
        danhgiasanpham.luotdanhgia = danhgias.length;
        for(var i = 0; i < danhgias.length; i++){
            tongsao += danhgias[i].sosao;
            if(danhgias[i].sosao == 1){
                motsao++
            }else if(danhgias[i].sosao == 2){
                haisao++
            }else if(danhgias[i].sosao == 3){
                basao++
            }else if(danhgias[i].sosao == 4){
                bonsao++
            }else if(danhgias[i].sosao == 5){
                namsao++
            }
        }
        danhgiasanpham.trungbinhsao = (tongsao/danhgias.length).toFixed(1);
        danhgiasanpham.motsao = Math.round((motsao/(motsao + haisao + basao + bonsao + namsao))*100)
        danhgiasanpham.haisao = Math.round((haisao/(motsao + haisao + basao + bonsao + namsao))*100)
        danhgiasanpham.basao = Math.round((basao/(motsao + haisao + basao + bonsao + namsao))*100)
        danhgiasanpham.bonsao = Math.round((bonsao/(motsao + haisao + basao + bonsao + namsao))*100)
        danhgiasanpham.namsao = Math.round((namsao/(motsao + haisao + basao + bonsao + namsao))*100)

         //Cặp nhặt giá bán và số lượng từ kho
            var khos = await Kho.find({masp: masp}).sort({giaban: 'asc'});
            
            if(khos.masp != null){
                var soluongspcon = 0;
                sanpham.giaban = await khos[0].giaban;
                var mausacconhang = [];
                for(var j = 0; j < khos.length; j++){
                    soluongspcon += khos[j].soluongtrongkho
                    if(khos[j].soluongtrongkho > 1){
                        mausacconhang.push(khos[j].mausac)
                    }
                }
                sanpham._doc.mausacconhang = mausacconhang;
                sanpham.soluong = soluongspcon;
            }

            //Binh luan 
            let binhluans = await BinhLuan.find({masp: masp}).sort('desc')
            for(var i = 0; i < binhluans.length; i++){
                const khachhang = await KhachHang.findOne({makh: binhluans[i].makh});
                if(khachhang == null){
                    const nhanvien = await NhanVien.findOne({manv: binhluans[i].makh});
                    if(nhanvien != null){
                        binhluans[i]._doc.nguoibl = nhanvien
                    }
                }else{
                    binhluans[i]._doc.nguoibl = khachhang
                }
                //tra loi binh luan
                let traloibinhluans = await TraLoiBinhLuan.find({mabl: binhluans[i]._id}).sort('desc')
                if(traloibinhluans != null){
                    let binhluantam = [];
                    for (var j = 0; j < traloibinhluans.length; j++){
                        //thong tin nguoi tra loi
                        const khachhang = await KhachHang.findOne({makh: traloibinhluans[j].makh});
                        if(khachhang == null){
                            const nhanvien = await NhanVien.findOne({manv: traloibinhluans[j].makh});
                            if(nhanvien != null){
                                traloibinhluans[j]._doc.nguoitl = nhanvien
                            }
                        }else{
                            binhluans[i]._doc.nguoitl = khachhang
                        }
                        traloibinhluans[j]._doc.binhluancho_id = binhluans[i]._id
                        binhluantam.push(traloibinhluans[j])
                    }
                    binhluans[i]._doc.traloi = binhluantam
                }
            }
            console.log(binhluans)
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
            binhluans: multipleMongooseToObject(binhluans),
            danhgiasanpham,
        });
    }}
    donhang(req, res){
        res.render('nguoidung/donhang');
    }
    taikhoan(req, res){
        res.render('nguoidung/taikhoan');
    }
     async thong_tin_chi_tiet_show(req, res){
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
//Xem san pham theo danh muc
    async danhmuc(req, res, next){
        var loai = req.query.loai;
        var option = {};

        if(req.query.loai){
            option = Object.assign({
                loaisp: req.query.loai
            },option)
        }
        if(req.query.hangsx){
            option = Object.assign({
                hangsx: req.query.hangsx
            },option)
        }
        if(req.query.gia){
            var giaban ={};
            if(req.query.gia == 'duoi-3tr'){
                giaban = {$lte: 3000000}
            }else if(req.query.gia == '3tr-5tr'){
                giaban = {$gte: 3000000, $lte: 5000000}
            }else if(req.query.gia == '5tr-8tr'){
                giaban = {$gte: 5000000, $lte: 8000000}
            }else if(req.query.gia == '8tr-12tr'){
                giaban = {$gte: 8000000, $lte: 12000000}
            }else if(req.query.gia == 'tren-12tr'){
                giaban = {$gte: 12000000}
            }
             option = Object.assign({
                giaban: giaban
            },option)
        }
        if(req.query.tinhtrang){
            option = Object.assign({
                tinhtrangmay: req.query.tinhtrang
            },option)
        }
        
        var sanphams = await SanPham.find(option).sort({giaban: 'desc'});

        const tenPhuKien = {
            dien_thoai: 'Điện thoại',
            may_tinh_bang: 'Máy tính bảng',
            chuot: 'Chuột máy tính',
            tai_nghe: 'Tai nghe',
            ban_phim: 'Bàn phím',
            op_lung: 'Ốp lưng',
        }
        var tenloai =[];
        if(req.query.loai in tenPhuKien){
            tenloai.ten = tenPhuKien[req.query.loai]
            tenloai.loai = req.query.loai
        }
         //Thông tin khách hàng lên header
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        res.render('khac/danhmuc/danhmuc',{
            sanphams:multipleMongooseToObject(sanphams),
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            tenloai,
        })
    }
}

module.exports = new SanPhamController;