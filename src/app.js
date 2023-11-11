const path = require('path');
const express = require('express');
const  handlebars  = require('express-handlebars');
const app = express();
const port = 3000;
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');

//Sap xep
const SapXep = require('./app/controllers/middleware/SapXep');
//Sap xep 
app.use(SapXep);

//Cookie
app.use(cookieParser())

//Xu ly POST 
app.use(express.urlencoded());
app.use(express.json());

//Templalte engine 
app.engine('hbs', handlebars(
    {
      defaultLayout: 'main',
      extname:".hbs",
      helpers: {
        cong : (a,b)=>{
          return a + b
        },
        nhan: (a,b)=>{
          return a*b
        },
        tru: (a,b)=>{
          return a-b
        },
        chia: (a,b)=>{
          return a/b
        },
        saodanhgia: (sosao)=>{
          var sao = '';
          for(var i = 1; i <= sosao; i++){
            sao += '<span><i class="fa-solid fa-star" style="color: #ffd500;"></i></span>'
          }
          return sao;
        },
        trangthaidonhang:(trangthai)=>{
          if(trangthai == 'da_tiep_nhan'){
            return '<div style="width: 120px; text-align: center; background-color: coral; color: white; border-radius: 15px; padding: 5px 10px;">Đã tiếp nhận</div>'
          }else if(trangthai == 'van_chuyen'){
            return '<div style="width: 120px; text-align: center; background-color: cadetblue; color: white; border-radius: 15px; padding: 5px 10px;">Vận chuyển</div>'
          }else if(trangthai == 'dang_giao'){
            return '<div style="width: 120px; text-align: center; background-color: yellowgreen; color: white; border-radius: 15px; padding: 5px 10px;">Đang giao</div>'
          }
          else if(trangthai == 'hoan_thanh'){
            return '<div style="width: 120px; text-align: center; background-color: green; color: white; border-radius: 15px; padding: 5px 10px;">Hoàn thành</div>'
          }
        }
      }
    }
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views')); //Set views folders

app.use(express.static(path.join(__dirname, 'public'))); //Tra ve path den thu muc pubnlic



//Database
const db = require('./config/db');
db.connect();

// Route
const route = require('./routes');
route(app);

//Ho tro phuong thuc PUT PATH DELETE 
app.use(methodOverride('_method'))

app.listen(port, () => {
  console.log(`Looc Store is running at  http://127.0.0.1:${port}`);
})