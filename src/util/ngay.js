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

    ngaygio = function (){
        var today = new Date()
        var date = them0odau((today.getFullYear())) + them0odau(((today.getMonth())+1)) + them0odau((today.getDate()));
        var time = them0odau((today.getHours())) + them0odau(today.getMinutes()) + them0odau(( today.getSeconds()));
        return date + time;
    }
}
function them0odau(item){
    if(item < 10 ){
        item = 0 + String(item)
    }
    return String(item)
}
module.exports = new Ngay;