const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', async (request, response) => {
  const courses = await Course.find().populate('userId', 'email name').select('title price img');

  console.log(courses);

  response.render('courses', {
    title: 'Курсы',
    isAdd: true,
    courses // {}, чтобы юзать в courses.hbs
  });
});

//редактирование курса
router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }
  const course = await Course.findById(req.params.id);
  res.render('course-edit', {
    title: `Редактировать курс ${course.title}`,
    course
  });
});

router.post('/edit', auth, async (req, res) => {
  const {id} = req.body; // чтобы лишний раз id не попадал в массив в findByIdAndUpdate();
  delete req.body.id;
  await Course.findByIdAndUpdate(id, req.body);

  res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id});
    res.redirect('/courses');
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty', // передаю в какой-то новый лайаут(вместо main.hbs) =>
    //=> подключать новые навбары, сайдбары, меню и т.д.
    title: `Курс ${course.title}`,
    course
  });
});

module.exports = router;