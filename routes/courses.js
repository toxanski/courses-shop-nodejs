const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (request, response) => {
  const courses = await Course.getAll();
  response.render('courses', {
    title: 'Курсы',
    isAdd: true,
    courses
  });
});

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render('course', {
    layout: 'empty', // передаю в какой-то новый лайаут(вместо main.hbs) =>
    //=> подключать новые навбары, сайдбары, меню и т.д.
    title: `Курс ${course.title}`,
    course
  });

});

module.exports = router;