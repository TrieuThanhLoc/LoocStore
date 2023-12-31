const NhanVien = require("../../src/resources/models/NhanVien");
const KhachHang = require("../../src/resources/models/khachhang/KhachHang");
const GioHang = require("../../src/resources/models/GioHang");
const LichSuTimKiem = require("../resources/models/khachhang/LichSuTimKiem");


module.exports = async function LayThongTinDangNhap(req){
    var thongtintaikhoan;
    var makh = "makh";
    if(req != undefined){
        if(req.chucvu != undefined){
            var manv = req.id;
            thongtintaikhoan = await NhanVien.findOne({manv: manv});
        }else{
            var makh = req.id
            thongtintaikhoan = await KhachHang.findOne({makh: makh});
        }
         if(thongtintaikhoan){
            if(thongtintaikhoan.manv){
                makh = thongtintaikhoan.manv;
            }else{
                makh = thongtintaikhoan.makh;
            }
            const giohangs = await GioHang.find({makh: makh}).sort({ngaythemvaogio: 'desc'});
            thongtintaikhoan._doc.giohangs = giohangs;
            thongtintaikhoan._doc.soluongsptronggio = giohangs.length;
            thongtintaikhoan._doc.makh = makh;
            thongtintaikhoan.makh = makh;
            const lichsutimkiem = await LichSuTimKiem.find({makh: makh}).sort({ngaytimkiem: 'desc'});
            thongtintaikhoan._doc.lichsutimkiem = lichsutimkiem;
        }
    }
    return thongtintaikhoan;
}