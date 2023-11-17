const { render } = require('vue');
const { multipleMongooseToObject, MongooseToObject } = require('../../../util/mongoose');
const Ngay = require('../../../util/ngay');
const LayThongTinKhachHang = require('../../../util/laythongtinkhachhang');
const ThanhToanVNPay = require('../../../util/thanhtoanvnpay');
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


const NhanVien = require ('../../../resources/models/NhanVien');
const KhachHang = require ('../../../resources/models/khachhang/KhachHang');
const ThanhToanVNP = require ('../../../resources/models/khachhang/ThanhToanVNP');
const LuuGioHangThanhToan = require ('../../../resources/models/khachhang/LuuGioHangThanhToan');
const DonHang = require('../../../resources/models/DonHang');
const GioHang = require('../../../resources/models/GioHang');
const ChiTietDonHang = require('../../../resources/models/ChiTietDonHang');
const NhatKyDonHang = require('../../../resources/models/NhatKyDonHang');
const DiachiKhachHang = require('../../../resources/models/khachhang/DiaChiKhachHang');
//Thanh Toán online
const NganHangLienKet = require ('../../../resources/models/khachhang/NganHangLienKet');

class thanhtoanController{

    async index(req, res, next){
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        const giohangthanhtoan = await LuuGioHangThanhToan.findOne({makh: thongtintaikhoan._doc.makh})
        const diachikhachhangs = await DiachiKhachHang.find({makh: thongtintaikhoan._doc.makh})
        const nganhanglienkets = await NganHangLienKet.find({makh: thongtintaikhoan._doc.makh})

        res.render('nguoidung/thanhtoan',{
            thongtintaikhoan: MongooseToObject(thongtintaikhoan),
            giohangthanhtoan: MongooseToObject(giohangthanhtoan),
            nganhanglienkets: multipleMongooseToObject(nganhanglienkets),
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
        donhang.ngaydathang = Ngay.ngaygiohomnay();
        const nhatkydonhang = NhatKyDonHang();
        nhatkydonhang.madh = donhang._id;
        nhatkydonhang.ngaytiepnhan =  Ngay.ngaygiohomnay();
        await nhatkydonhang.save();
        await Promise.all( req.body.masp.map( async(masp, i) => {
            const chitietdonhang = new ChiTietDonHang();
            chitietdonhang.masp = masp
            chitietdonhang.madh = donhang._id
            chitietdonhang.soluongdat = req.body.soluongsp[i]
            chitietdonhang.mausacdat = req.body.mausac[i]
           //Cap nhap so luong trong kho
            var kho = await Kho.findOne({masp: masp, mausac: req.body.mausac[i]});
            kho.soluongtrongkho = kho.soluongtrongkho - req.body.soluongsp[i];
            kho.soluongdaban =Number(kho.soluongdaban) + Number(req.body.soluongsp[i]);

            //neu nhu so luong mua lon hong so luong trong kho thi dat hang khong thanh
            if(kho.soluongtrongkho < 0){
                return res.redirect('../thanhtoan/dathangthanhcong?status=0')
            }
            await kho.save();
             //Cặp nhặt giá bán và số lượng từ kho
            var khos = await Kho.find({masp: masp}).sort({giaban: 'asc'});
            var soluongspcon = 0;
            var giaban = await khos[0].giaban;
            let mausacconhang = [];
            for(var j = 0; j < khos.length; j++){
                soluongspcon += khos[j].soluongtrongkho
                if(khos[j].soluongtrongkho >= 1){
                    mausacconhang.push(khos[j].mausac)
                }
            }
            await SanPham.updateOne({masp: masp},{
                giaban: giaban,
                mausacconhang: mausacconhang,
                soluong: soluongspcon
            })//////////////////////
            return await chitietdonhang.save()
        }))
        await GioHang.deleteMany({makh: req.body.makh, masp: {$in: req.body.masp}})
        await LuuGioHangThanhToan.deleteOne({_id: req.body._idgiohangthanhtoan})

        //thanh toan
        if(req.body.phuongthucthanhtoan == 'online'){
            donhang.trangthai = 'cho_thanh_toan';
            await donhang.save();
            req.body.madh = donhang._id
            //chuyen san buoc thanh toan 
            ThanhToanVNPay(req, res)
        }else if(req.body.phuongthucthanhtoan == 'cod'){
            donhang.trangthai = 'da_tiep_nhan';
            await donhang.save();
            res.redirect('/thanhtoan/dathangthanhcong?madh=' + donhang._id)
        }
        
    }
//Ket qua thanh toan qua vnpay
    async hoantatthanhtoanvnp(req, res , next){
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        if(req.query.vnp_TransactionStatus == '00'){//gio dich thanh cong
            const thanhtoanvnp = ThanhToanVNP();
            thanhtoanvnp.madh = req.query.vnp_TxnRef
            thanhtoanvnp.tongTienDonHang = req.query.vnp_Amount
            thanhtoanvnp.magiaodich = req.query.vnp_TransactionNo
            thanhtoanvnp.trangthaigiaodich = req.query.vnp_TransactionStatus
            thanhtoanvnp.ngaythanhtoan = Ngay.ngaygiohomnay();
    
            thanhtoanvnp.vnp_bankcode = req.query.vnp_BankCode
            thanhtoanvnp.vnp_bankcode = req.query.vnp_BankTranNo
            thanhtoanvnp.vnp_cardtype = req.query.vnp_CardType
            thanhtoanvnp.vnp_paydata = req.query.vnp_PayDate
            thanhtoanvnp.vnp_responsecode = req.query.vnp_ResponseCode
            thanhtoanvnp.vnp_tmncode = req.query.vnp_TmnCode
            thanhtoanvnp.vnp_securehash = req.query.vnp_SecureHash

            await thanhtoanvnp.save();

            await DonHang.updateOne({_id: thanhtoanvnp.madh},{
                trangthai: 'da_tiep_nhan'
            })

            res.redirect('../thanhtoan/dathangthanhcong?madh=' + thanhtoanvnp.madh)
        }
    }
    //Sau khi khach hang dat hang thanh cong
     async dathangthanhcong(req, res, next){
        let thongtintaikhoan = new Object;
        await LayThongTinKhachHang(req.taikhoan).then((thongtin)=>{
            thongtintaikhoan = thongtin;
        })
        var dathangthanhcong = false;
        if(req.query.madh != '' && req.query.madh != undefined){
            dathangthanhcong =true
            const donhang = await DonHang.findOne({_id: req.query.madh});
            const chitietdonhangs = await ChiTietDonHang.find({madh: donhang._id});
            const sanpham = [];
            for(var i = 0; i < chitietdonhangs.length; i++){
                var sanphaminfo = await SanPham.findOne({masp: chitietdonhangs[i].masp})
                sanphaminfo._doc.soluongdat = chitietdonhangs[i].soluongdat
                sanphaminfo._doc.mausacdat = chitietdonhangs[i].mausacdat
                sanpham.push(sanphaminfo)
            }
            donhang._doc.sanpham = sanpham;
            
            res.render('nguoidung/dathangthanhcong',{
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                donhang: MongooseToObject(donhang),
                dathangthanhcong,
            })
        }else {//Dat hang that bai
               res.render('nguoidung/dathangthanhcong',{
                thongtintaikhoan: MongooseToObject(thongtintaikhoan),
                dathangthanhcong,                
            })
        }   
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
                sanphamtronggio.ngaythemvaogio = Ngay.ngaygiohomnay();
                await GioHang.updateOne({masp: giohang.masp, makh: giohang.makh}, sanphamtronggio)
                return res.redirect('/giohang');
            }else{
                giohang.soluongsp = 1;
                giohang.ngaythemvaogio = Ngay.ngaygiohomnay();
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






    //Thanh toan Momo
    async ThanhToanMoMo(req, res, next){
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var partnerCode = "MOMO";
        var accessKey = "F8BBA842ECF85";
        var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "pay with MoMo";
        var redirectUrl = "https://momo.vn/return";
        var ipnUrl = "https://callback.url/notify";
        // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        var amount = "50000";
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const Req = https.request(options, res => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('payUrl: ');
                console.log(JSON.parse(body).payUrl);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })

        Req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        console.log("Sending....")
        Req.write(requestBody);
        Req.end();
    }



    async lienketnganhang(req, res, next){
        const nganhanglienket = new NganHangLienKet(req.body);
        nganhanglienket.makh = req.params.makh;
        nganhanglienket.ngaylienket = Ngay.ngaygiohomnay();

        await nganhanglienket.save();

        res.redirect('back');
    }
}
module.exports = new thanhtoanController;