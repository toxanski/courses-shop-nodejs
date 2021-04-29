const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views'); // views - папка, где хранятся шаблоны(можно менять)

app.use(express.static('public'));

app.use(express.urlencoded({
  extended: true
}));

const PORT = process.env.PORT || 3000;

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);

//на express`e без движка hbs
// app.get('/', (request, response) => { 
//   // response.status(200); express ставит автоматически 200 или 304
//   response.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/about', (request, response) => {
//   response.status(200);
//   response.sendFile(path.join(__dirname, 'views', 'about.html'));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});