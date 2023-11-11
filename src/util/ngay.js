class Ngay{
    ngaygiohomnay = function () {
        var today = new Date()
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + ' ' + time;
    }
     ngayhomnay = function () {
        var today = new Date()
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        return date;
    }
     thangnay = function () {
        var today = new Date()
        return today.getMonth()+1;
    }
    namnay = function () {
        var today = new Date()
        return today.getFullYear();
    }
}
module.exports = new Ngay;