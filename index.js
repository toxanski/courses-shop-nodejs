const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const csrf = require('csurf');


const Handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const app = express();

const MONGODB_URI = 'mongodb+srv://anton:vWwxMI90z5J7ybxG@cluster0.1tylu.mongodb.net/shop';

const store = new MongoStore({
  collections: 'sessions',
  uri: MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
 // views - папка, где хранятся шаблоны(можно менять)

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store // или по-другому store: store
}));

app.use(csrf());
app.use(varMiddleware);
app.use(userMiddleware);

const PORT = process.env.PORT || 80;

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

async function start() {
  try {
    
    await mongoose.set('useFindAndModify', false);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port - ${PORT}`);
    });


  } catch(err) {
    console.log(err);
  }
}

start();

//на express`e без движка hbs
// app.get('/', (request, response) => { 
//   // response.status(200); express ставит автоматически 200 или 304
//   response.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/about', (request, response) => {
//   response.status(200);
//   response.sendFile(path.join(__dirname, 'views', 'about.html'));
// });
