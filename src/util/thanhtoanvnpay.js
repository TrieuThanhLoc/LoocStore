const Ngay = require('../util/ngay');

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

module.exports = async function ThanhToanVNPay(req, res){
    var ipAddr = req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
	var config = require('../config/default');
	
	var tmnCode = config.vnp_TmnCode;
	var secretKey = config.vnp_HashSecret;
	var vnpUrl = config.vnp_Url;
	var returnUrl = config.vnp_ReturnUrl +'?token=' + req.cookies.token; 

	var createDate = Ngay.ngaygio();//20231111172220
	var orderId = req.body.madh;
	var amount = req.body.tienthanhtoan;
	var bankCode = req.body.manh;
	
	var orderInfo = req.body.orderDescription;
	var orderType = req.body.orderType;
	var locale = 'vn';
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
	vnp_Params['vnp_OrderInfo'] = orderId;
	vnp_Params['vnp_OrderType'] = 'other';
	vnp_Params['vnp_Amount'] = Number(amount);
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

 	return res.redirect(vnpUrl)
}