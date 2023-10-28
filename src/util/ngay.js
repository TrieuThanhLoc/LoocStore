class Ngay{
    ngayhomnay = function () {
        var today = new Date()
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        return date + ' ' + time;
    }
}
module.exports = new Ngay;