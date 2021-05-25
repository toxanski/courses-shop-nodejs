const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders');
const User = require('./models/user');

const Handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
 // views - папка, где хранятся шаблоны(можно менять)


//

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60a2eec3d3c49e1c78d49b15');

    req.user = user;
    // console.log('REQUEST', req.user);
    next();
  } catch (error) {
    console.log(error)
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
}));

const PORT = process.env.PORT || 5000;

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

async function start() {
  try {
    const url = 'mongodb+srv://anton:vWwxMI90z5J7ybxG@cluster0.1tylu.mongodb.net/shop';
    await mongoose.set('useFindAndModify', false);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });


    //юзер
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'tosha.smirnov.2002@gmail.com',
        name: 'Anton',
        cart: {items: []}
      })
      await user.save();
    }
    //
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
