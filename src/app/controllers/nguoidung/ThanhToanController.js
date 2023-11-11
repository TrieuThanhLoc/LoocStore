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

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

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
        donhang.ngaydathang = Ngay.ngaygiohomnay();
        donhang.trangthai = 'da_tiep_nhan';
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
            var sanpham = await SanPham.findOne({masp: masp});
            sanpham.soluong = sanpham.soluong - 1;
            await sanpham.save();
            return await chitietdonhang.save()
        }))
        donhang.save();
        await GioHang.deleteMany({makh: req.body.makh, masp: {$in: req.body.masp}})
        await LuuGioHangThanhToan.deleteOne({_id: req.body._idgiohangthanhtoan})
        res.redirect('/nguoidung/donhang')
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






    //Thanh toan Online
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



    
    async thanhtoanvnpay(req, res, next){
        var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        ipAddr ='http://127.0.0.1:3000'
        var config = require('../../../config/default');
        // var dateFormat = require('dateformat');

        
        var tmnCode = config.vnp_TmnCode;
        var secretKey = config.vnp_HashSecret;
        var vnpUrl = config.vnp_Url;
        var returnUrl = config.vnp_ReturnUrl;

        var date = new Date();

        var createDate = Ngay.ngaygiohomnay();
        var orderId ='123';
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;
        
        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto"); 
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl)    
    }
}
module.exports = new thanhtoanController;