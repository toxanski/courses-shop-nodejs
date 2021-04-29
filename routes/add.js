const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (request, response) => {
  response.status(200);
  response.render('add', {
    title: 'Добавить курс',
    isCourses: true
  });
});

router.post('/', async (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.img);
  await course.save(); // save() - возвращает промис => можно await
  res.redirect('/courses');
});

module.exports = router;