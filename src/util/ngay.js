class Ngay{
    hopngaythangnam = function(ngaythangnam){
        var manginput = ngaythangnam.split(/[-,' ',:]/);
        var ketqua = them0odau(manginput[2]) + them0odau(manginput[1]) + them0odau(manginput[0])
        return Number(ketqua);
    }
    formatNgay = function(input){
        let tachinput = String(input).split('-');
        return tachinput[2] + '-' + tachinput[1] + '-' + tachinput[0]
    }
    ngaygiohomnay = function () {
        var today = new Date()
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var ketqua = date + ' ' + time
        return ketqua;
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
    layngaythangnam = function (input, muonlay){//input vao kieu YYYY-MM-DD
        let tachinput = String(input).split('-',3);
        if(String(muonlay).toLowerCase() == 'ngay' || String(muonlay).toLowerCase() == 'date' || String(muonlay).toLowerCase() == 'day'){
            return tachinput[2]
        }else if(String(muonlay).toLowerCase() == 'thang' || String(muonlay).toLowerCase() == 'month'){
            return tachinput[1]
        }else if(String(muonlay).toLowerCase() == 'nam' || String(muonlay).toLowerCase() == 'year'){
            return tachinput[0]
        }
    }
}
function them0odau(item){
    if(Number(item) < 10 && String(item).length < 2){
        item = 0 + String(item)
    }
    return String(item)
}

module.exports = new Ngay;