const path = require('path');
const express = require('express');
const  handlebars  = require('express-handlebars');
const app = express();
const port = 3000;
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');


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