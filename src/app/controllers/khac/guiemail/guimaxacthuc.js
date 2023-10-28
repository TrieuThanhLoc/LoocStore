const nodemailer = require("nodemailer");

class GuiEmail{
    guimaxacthuc = async(emailkh, maxacthuc) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "1507thanhloc@gmail.com",
            pass: "ygbg bmsc lbrg ggsk",
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'Thanh Loc 👻" <1507thanhloc@gmai.com>', // sender address
        to: emailkh, // list of receivers
        subject: "Test chức năng send email", // Subject line
        text: 'Hello', // plain text body
        html: "<b style = 'color: red'>Mật khẩu đang nhập của bạn là:</b> <p style = 'color: green'>" + maxacthuc +"</p>", // html body
    });
    return info;
    }
    taoMa = () => {
        var maxacthuc = '';
        for (var i = 0; i < 6; i++){
            var tam = Math.floor(Math.random()*10).toString();
            maxacthuc += tam;
        }
        return maxacthuc;
    }
}
module.exports = new GuiEmail;